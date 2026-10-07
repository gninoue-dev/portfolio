// ============================================
// L'ÎLE DES FRAGMENTS — Moteur du jeu
// Boucle, entrées (clavier, souris, tactile), caméra,
// éclairage dynamique, particules, progression et boss.
// L'interface (HTML) est gérée par theme-gaming.js via "ui".
// ============================================
(function () {
  const JeuIle = window.JeuIle = window.JeuIle || {};
  const { PALETTE, aleatoireGraine, creerCanevas, pixel, disque } = JeuIle;

  const VITESSE = 74;
  const VITESSE_COURSE = 118;
  const RAYON_JOUEUR = 4;
  const OBSCURITE_DEPART = 0.9;
  const CLE_SAUVEGARDE = 'jeu';
  const DUREE_CHARGE_PYLONE = 1.7;

  const TOUCHES = {
    ArrowUp: 'haut', KeyW: 'haut',
    ArrowDown: 'bas', KeyS: 'bas',
    ArrowLeft: 'gauche', KeyA: 'gauche',
    ArrowRight: 'droite', KeyD: 'droite'
  };

  // Tampon de lumière : disque blanc dont l'opacité décroît vers le bord
  function creerTamponLumiere(couleur) {
    return creerCanevas(128, 128, ctx => {
      const degrade = ctx.createRadialGradient(64, 64, 0, 64, 64, 64);
      degrade.addColorStop(0, `rgba(${couleur},1)`);
      degrade.addColorStop(0.35, `rgba(${couleur},0.7)`);
      degrade.addColorStop(1, `rgba(${couleur},0)`);
      ctx.fillStyle = degrade;
      ctx.fillRect(0, 0, 128, 128);
    });
  }

  class Jeu {
    constructor(conteneur, ui, options) {
      this.conteneur = conteneur;
      this.ui = ui;
      this.mouvementReduit = options.mouvementReduit;
      this.toucherPrioritaire = window.matchMedia('(pointer: coarse)').matches;

      this.affichage = document.createElement('canvas');
      this.affichage.className = 'jeu-canevas';
      this.affichage.setAttribute('tabindex', '0');
      this.affichage.setAttribute('role', 'application');
      this.affichage.setAttribute('aria-label', options.libelleCanevas);
      conteneur.prepend(this.affichage);
      this.ctxAffichage = this.affichage.getContext('2d');

      this.tampon = document.createElement('canvas');
      this.ctx = this.tampon.getContext('2d');
      this.calqueLumiere = document.createElement('canvas');
      this.ctxLumiere = this.calqueLumiere.getContext('2d');
      this.tamponsLumiere = { '255,255,255': creerTamponLumiere('255,255,255') };

      this.sprites = JeuIle.creerSprites();
      this.monde = JeuIle.creerMonde(this.sprites);
      this.audio = new JeuIle.Audio();
      this.alea = aleatoireGraine(Date.now() & 0xffff);

      this.mode = 'titre';
      this.temps = 0;
      this.particules = [];
      this.projectiles = [];
      this.secousse = 0;
      this.flash = 0;
      this.touches = new Set();
      this.cible = null;
      this.joystick = null;
      this.cooldownDome = 0;
      this.obscuriteCible = OBSCURITE_DEPART;
      this.obscurite = OBSCURITE_DEPART;

      this.reinitialiserEtat(this.lireSauvegarde());
      this.camera = { x: this.joueur.x, y: this.joueur.y };
      this.creerLucioles();
      this.brancherEntrees();
      this.redimensionner();
      this.observateurTaille = new ResizeObserver(() => this.redimensionner());
      this.observateurTaille.observe(conteneur);

      this.dernierInstant = performance.now();
      this.boucle = this.boucle.bind(this);
      this.idAnimation = requestAnimationFrame(this.boucle);
      JeuIle.instance = this;
    }

    // ============================================
    // État, sauvegarde
    // ============================================
    reinitialiserEtat(sauvegarde) {
      const s = sauvegarde || {};
      this.etat = {
        orbes: new Set(s.orbes || []),
        steles: new Set(s.steles || []),
        archiviste: !!s.archiviste,
        bossVaincu: !!s.bossVaincu,
        zones: new Set(s.zones || []),
        succes: new Set(s.succes || []),
        tempsJeu: s.tempsJeu || 0,
        touche: false
      };
      this.joueur = {
        x: this.monde.depart.x, y: this.monde.depart.y, vx: 0, vy: 0,
        direction: 'bas', pas: 0, invulnerable: 0, poussiere: 0
      };
      this.boss = {
        x: this.monde.centreArene.x, y: this.monde.centreArene.y - 8,
        pv: 3, eveille: false, recharge: 2, degat: 0, phaseTir: 0
      };
      this.zoneCourante = null;
      this.audio.changerAmbiance(this.etat.bossVaincu ? 'fin' : 'exploration');
      // aspect des objets selon la progression
      this.monde.steles.forEach(stele => {
        const vue = this.etat.steles.has(stele.indice);
        stele.sprite = vue ? this.sprites.steleAllumee : this.sprites.stele;
        stele.lumiere = { ...stele.lumiere, couleur: vue ? '255,209,102' : '127,193,255', intensite: vue ? 0.7 : 0.45 };
      });
      const phare = this.monde.phare;
      phare.sprite = this.etat.bossVaincu ? this.sprites.phareAllume : this.sprites.phare;
      phare.lumiere.intensite = this.etat.bossVaincu ? 1 : 0;
      this.monde.pylones.forEach(p => {
        p.actif = this.etat.bossVaincu;
        p.charge = this.etat.bossVaincu ? 1 : 0;
        p.lumiere.intensite = this.etat.bossVaincu ? 0.9 : 0;
        p.lumiere.couleur = '255,243,176';
      });
      if (this.etat.bossVaincu) this.boss.pv = 0;
      this.majObscurite(true);
    }

    aUneSauvegarde() {
      const s = this.lireSauvegarde();
      return !!s && (s.orbes?.length || s.steles?.length || s.archiviste || s.bossVaincu);
    }

    lireSauvegarde() {
      try {
        return JSON.parse(lirePreference(CLE_SAUVEGARDE) || 'null');
      } catch (erreur) {
        return null;
      }
    }

    sauvegarder() {
      ecrirePreference(CLE_SAUVEGARDE, JSON.stringify({
        orbes: [...this.etat.orbes],
        steles: [...this.etat.steles],
        archiviste: this.etat.archiviste,
        bossVaincu: this.etat.bossVaincu,
        zones: [...this.etat.zones],
        succes: [...this.etat.succes],
        tempsJeu: Math.round(this.etat.tempsJeu)
      }));
    }

    fragments() {
      return {
        histoire: this.etat.archiviste,
        savoir: this.etat.orbes.size >= this.monde.orbes.length,
        oeuvres: this.etat.steles.size >= this.monde.steles.length,
        lien: this.etat.bossVaincu
      };
    }

    nombreFragments() {
      return Object.values(this.fragments()).filter(Boolean).length;
    }

    domeOuvert() {
      const f = this.fragments();
      return f.histoire && f.savoir && f.oeuvres;
    }

    majObscurite(immediat) {
      this.obscuriteCible = this.etat.bossVaincu ? 0.12 : OBSCURITE_DEPART - this.nombreFragments() * 0.09;
      if (immediat) this.obscurite = this.obscuriteCible;
    }

    debloquerSucces(cle) {
      if (this.etat.succes.has(cle)) return;
      this.etat.succes.add(cle);
      this.audio.jouer('succes');
      this.ui.succes(cle);
      this.sauvegarder();
    }

    // ============================================
    // Démarrage et modes
    // ============================================
    commencer(nouvellePartie) {
      if (nouvellePartie) {
        ecrirePreference(CLE_SAUVEGARDE, '');
        this.reinitialiserEtat(null);
        this.projectiles = [];
      }
      this.mode = 'jeu';
      this.majObscurite();
      this.audio.jouer('eveil');
      this.transitionCamera = this.mouvementReduit ? 0 : 1;
      this.departCamera = { x: this.camera.x, y: this.camera.y };
      this.anneauEveil = this.mouvementReduit ? 0 : 1;
      for (let i = 0; i < (this.mouvementReduit ? 0 : 40); i++) this.emettre(this.joueur.x, this.joueur.y - 8, 'etincelle', '255,209,102');
      this.affichage.focus({ preventScroll: true });
      this.majHud();
    }

    mettreEnPause(pause) {
      if (pause && this.mode === 'jeu') {
        this.mode = 'pause';
        this.touches.clear();
        this.joystick = null;
      } else if (!pause && this.mode === 'pause') {
        this.mode = 'jeu';
        this.dernierInstant = performance.now();
        this.affichage.focus({ preventScroll: true });
      }
    }

    // Bloque le joueur pendant un dialogue ou un panneau d'interface
    bloquer() {
      if (this.mode === 'jeu') this.mode = 'dialogue';
      this.touches.clear();
      this.joystick = null;
      this.cible = null;
      this.ui.boutonAction(null);
    }

    rendreControle() {
      if (this.mode === 'dialogue') this.mode = 'jeu';
      this.dernierInstant = performance.now();
      this.affichage.focus({ preventScroll: true });
    }

    detruire() {
      cancelAnimationFrame(this.idAnimation);
      this.observateurTaille.disconnect();
      this.debrancherEntrees();
      this.audio.detruire();
      this.affichage.remove();
      if (JeuIle.instance === this) JeuIle.instance = null;
    }

    // ============================================
    // Dimensions : rendu basse résolution agrandi (pixels nets)
    // ============================================
    redimensionner() {
      const largeur = this.conteneur.clientWidth;
      const hauteur = this.conteneur.clientHeight;
      if (!largeur || !hauteur) return;
      const ratio = Math.min(window.devicePixelRatio || 1, 2);
      this.echelle = Math.max(2, Math.min(5, Math.round(Math.min(hauteur / 250, largeur / 300))));
      this.vueL = Math.ceil(largeur / this.echelle);
      this.vueH = Math.ceil(hauteur / this.echelle);
      this.tampon.width = this.calqueLumiere.width = this.vueL;
      this.tampon.height = this.calqueLumiere.height = this.vueH;
      this.affichage.width = Math.round(largeur * ratio);
      this.affichage.height = Math.round(hauteur * ratio);
      this.affichage.style.width = `${largeur}px`;
      this.affichage.style.height = `${hauteur}px`;
      this.ratio = ratio;
      this.ctx.imageSmoothingEnabled = false;
    }

    // ============================================
    // Entrées
    // ============================================
    brancherEntrees() {
      this.surToucheBas = (e) => {
        if (e.target.closest && e.target.closest('input, textarea, select, button, a') && e.target !== this.affichage) return;
        if (this.mode !== 'jeu') return;
        if (TOUCHES[e.code]) {
          this.touches.add(TOUCHES[e.code]);
          this.cible = null;
          e.preventDefault();
        } else if (e.key === 'Shift') {
          this.touches.add('course');
        } else if (['KeyE', 'Space', 'Enter', 'NumpadEnter'].includes(e.code)) {
          e.preventDefault();
          if (!e.repeat) this.action();
        } else if (e.code === 'Escape' || e.code === 'KeyP') {
          e.preventDefault();
          this.ui.ouvrirPause();
        } else if (e.code === 'KeyM') {
          this.ui.basculerSon();
        }
      };
      this.surToucheHaut = (e) => {
        if (TOUCHES[e.code]) this.touches.delete(TOUCHES[e.code]);
        if (e.key === 'Shift') this.touches.delete('course');
      };
      this.surPerteFocus = () => { this.touches.clear(); this.joystick = null; };
      this.surVisibilite = () => {
        if (document.hidden) {
          this.audio.suspendre();
          if (this.mode === 'jeu') this.ui.ouvrirPause();
        } else {
          this.audio.reprendre();
          this.dernierInstant = performance.now();
        }
      };

      this.surPointeurBas = (e) => {
        if (this.mode !== 'jeu') return;
        this.affichage.setPointerCapture(e.pointerId);
        this.pointeur = { id: e.pointerId, x0: e.offsetX, y0: e.offsetY, x: e.offsetX, y: e.offsetY, debut: performance.now(), glisse: false };
      };
      this.surPointeurDeplace = (e) => {
        const p = this.pointeur;
        if (!p || p.id !== e.pointerId) return;
        p.x = e.offsetX; p.y = e.offsetY;
        const dx = p.x - p.x0, dy = p.y - p.y0;
        if (!p.glisse && Math.hypot(dx, dy) > 14) {
          p.glisse = true;
          this.cible = null;
        }
        if (p.glisse) {
          const longueur = Math.hypot(dx, dy);
          const force = Math.min(1, longueur / 50);
          this.joystick = { dx: dx / longueur * force, dy: dy / longueur * force, x0: p.x0, y0: p.y0 };
          this.ui.joystick(this.joystick);
        }
      };
      this.surPointeurHaut = (e) => {
        const p = this.pointeur;
        if (!p || p.id !== e.pointerId) return;
        if (!p.glisse && this.mode === 'jeu') this.clicMonde(p.x, p.y);
        this.pointeur = null;
        this.joystick = null;
        this.ui.joystick(null);
      };

      window.addEventListener('keydown', this.surToucheBas);
      window.addEventListener('keyup', this.surToucheHaut);
      window.addEventListener('blur', this.surPerteFocus);
      document.addEventListener('visibilitychange', this.surVisibilite);
      this.affichage.addEventListener('pointerdown', this.surPointeurBas);
      this.affichage.addEventListener('pointermove', this.surPointeurDeplace);
      this.affichage.addEventListener('pointerup', this.surPointeurHaut);
      this.affichage.addEventListener('pointercancel', this.surPointeurHaut);
      this.affichage.addEventListener('contextmenu', e => e.preventDefault());
    }

    debrancherEntrees() {
      window.removeEventListener('keydown', this.surToucheBas);
      window.removeEventListener('keyup', this.surToucheHaut);
      window.removeEventListener('blur', this.surPerteFocus);
      document.removeEventListener('visibilitychange', this.surVisibilite);
    }

    ecranVersMonde(xCss, yCss) {
      return { x: xCss / this.echelle + this.camera.x - this.vueL / 2, y: yCss / this.echelle + this.camera.y - this.vueH / 2 };
    }

    mondeVersEcran(x, y) {
      return { x: (x - this.camera.x + this.vueL / 2) * this.echelle, y: (y - this.camera.y + this.vueH / 2) * this.echelle };
    }

    clicMonde(xCss, yCss) {
      const point = this.ecranVersMonde(xCss, yCss);
      // clic sur un objet interactif : on s'y rend puis on interagit
      const objet = this.monde.objets.find(o => o.interaction && !o.interaction.auto &&
        Math.hypot(o.x - point.x, (o.y - 10) - point.y) < 18);
      if (objet && Math.hypot(objet.x - this.joueur.x, objet.y - this.joueur.y) <= objet.interaction.rayon) {
        this.interagir(objet);
        return;
      }
      this.cible = { x: point.x, y: point.y, objet };
      this.emettre(point.x, point.y, 'repere', '255,255,255');
    }

    // ============================================
    // Lucioles et particules
    // ============================================
    creerLucioles() {
      const nombre = this.mouvementReduit ? 25 : 70;
      this.lucioles = Array.from({ length: nombre }, () => ({
        x: this.alea() * this.monde.LARGEUR * this.monde.T,
        y: this.alea() * this.monde.HAUTEUR * this.monde.T,
        phase: this.alea() * 6.28,
        vitesse: 4 + this.alea() * 8
      }));
    }

    emettre(x, y, type, couleur) {
      if (this.particules.length > 500) return;
      const angle = this.alea() * Math.PI * 2;
      const force = type === 'explosion' ? 40 + this.alea() * 120 : type === 'etincelle' ? 20 + this.alea() * 60 : 8 + this.alea() * 20;
      const vie = type === 'explosion' ? 1.2 + this.alea() * 1.2 : type === 'repere' ? 0.5 : type === 'poussiere' ? 0.45 : 0.6 + this.alea() * 0.6;
      this.particules.push({
        x, y, type, couleur,
        vx: type === 'repere' ? 0 : Math.cos(angle) * force,
        vy: type === 'repere' ? 0 : Math.sin(angle) * force - (type === 'etincelle' ? 20 : 0),
        vie, vieMax: vie,
        taille: type === 'explosion' ? 1 + Math.floor(this.alea() * 3) : 1
      });
    }

    secouer(force) {
      if (!this.mouvementReduit) this.secousse = Math.max(this.secousse, force);
    }

    // ============================================
    // Boucle principale
    // ============================================
    boucle(maintenant) {
      const dt = Math.min(0.05, (maintenant - this.dernierInstant) / 1000);
      this.dernierInstant = maintenant;
      if (this.mode !== 'pause') this.mettreAJour(dt);
      if (!this.conteneur.hidden) this.dessiner();
      this.idAnimation = requestAnimationFrame(this.boucle);
    }

    mettreAJour(dt) {
      this.temps += dt;
      if (this.mode === 'jeu') {
        this.etat.tempsJeu += dt;
        this.deplacerJoueur(dt);
        this.verifierZones();
        this.verifierInteractions(dt);
        this.mettreAJourBoss(dt);
      }
      this.mettreAJourCamera(dt);
      this.mettreAJourParticules(dt);
      if (this.mode === 'titre') this.obscuriteCible = 0.74;
      this.obscurite += (this.obscuriteCible - this.obscurite) * Math.min(1, dt * (this.etat.bossVaincu ? 0.6 : 1.5));
      this.secousse = Math.max(0, this.secousse - dt * 18);
      this.flash = Math.max(0, this.flash - dt * 2.2);
      if (this.anneauEveil) this.anneauEveil = Math.max(0, this.anneauEveil - dt * 0.9);
      this.cooldownDome = Math.max(0, this.cooldownDome - dt);
      this.joueur.invulnerable = Math.max(0, this.joueur.invulnerable - dt);
    }

    deplacerJoueur(dt) {
      const j = this.joueur;
      let dx = 0, dy = 0;
      if (this.touches.has('haut')) dy -= 1;
      if (this.touches.has('bas')) dy += 1;
      if (this.touches.has('gauche')) dx -= 1;
      if (this.touches.has('droite')) dx += 1;
      if (this.joystick) { dx = this.joystick.dx; dy = this.joystick.dy; }
      if (!dx && !dy && this.cible) {
        const ex = this.cible.x - j.x, ey = this.cible.y - j.y;
        const d = Math.hypot(ex, ey);
        const arrivee = this.cible.objet ? this.cible.objet.interaction.rayon - 4 : 3;
        if (d <= arrivee) {
          const objet = this.cible.objet;
          this.cible = null;
          if (objet) this.interagir(objet);
        } else {
          dx = ex / d; dy = ey / d;
        }
      }
      const longueur = Math.hypot(dx, dy);
      if (longueur > 1) { dx /= longueur; dy /= longueur; }
      const vitesse = this.touches.has('course') || (this.joystick && Math.hypot(dx, dy) > 0.95) ? VITESSE_COURSE : VITESSE;
      const lissage = Math.min(1, dt * 14);
      j.vx += (dx * vitesse - j.vx) * lissage;
      j.vy += (dy * vitesse - j.vy) * lissage;
      if (Math.abs(j.vx) < 0.5 && !dx) j.vx = 0;
      if (Math.abs(j.vy) < 0.5 && !dy) j.vy = 0;

      const avantX = j.x, avantY = j.y;
      this.deplacer(j, j.vx * dt, j.vy * dt);
      const parcouru = Math.hypot(j.x - avantX, j.y - avantY);
      if (this.cible && parcouru < 0.05 && Math.hypot(dx, dy) > 0) this.cible = null; // bloqué : on abandonne

      if (parcouru > 0.1) {
        j.pas += parcouru / 7;
        if (Math.abs(dx) > Math.abs(dy)) j.direction = dx < 0 ? 'gauche' : 'droite';
        else if (dy) j.direction = dy < 0 ? 'haut' : 'bas';
        j.poussiere -= dt;
        if (j.poussiere <= 0) {
          j.poussiere = 0.22;
          this.emettre(j.x, j.y, 'poussiere', '200,180,140');
        }
        if (!this.etat.succes.has('premier-pas')) this.debloquerSucces('premier-pas');
      } else {
        j.pas = 0;
      }
      j.enMarche = parcouru > 0.1;
    }

    deplacer(entite, dx, dy) {
      if (!this.bloque(entite.x + dx, entite.y)) entite.x += dx;
      if (!this.bloque(entite.x, entite.y + dy)) entite.y += dy;
    }

    bloque(x, y) {
      const { T, SOL } = this.monde;
      const r = RAYON_JOUEUR;
      for (const [cx, cy] of [[x - r, y - 2], [x + r, y - 2], [x - r, y + 2], [x + r, y + 2]]) {
        if (this.monde.tuile(Math.floor(cx / T), Math.floor(cy / T)) === SOL.eau) return true;
      }
      if (!this.domeOuvert()) {
        const d = Math.hypot(x - this.monde.centreArene.x, y - this.monde.centreArene.y);
        if (d < this.monde.rayonArene + r) {
          if (this.cooldownDome <= 0 && this.mode === 'jeu') {
            this.cooldownDome = 2.5;
            this.audio.jouer('refus');
            this.ui.toast(t('jeu.dome-ferme', { n: 3 - [this.fragments().histoire, this.fragments().savoir, this.fragments().oeuvres].filter(Boolean).length }), 'alerte');
            for (let i = 0; i < 10; i++) this.emettre(x, y - 6, 'etincelle', '255,61,154');
          }
          return true;
        }
      }
      const tx = Math.floor(x / T), ty = Math.floor(y / T);
      for (let gy = ty - 1; gy <= ty + 1; gy++) {
        for (let gx = tx - 1; gx <= tx + 1; gx++) {
          if (gx < 0 || gy < 0 || gx >= this.monde.LARGEUR || gy >= this.monde.HAUTEUR) continue;
          for (const o of this.monde.grilleSolides[gy * this.monde.LARGEUR + gx]) {
            if (o.solide.r) {
              if (Math.hypot(x - o.x, y - o.y) < o.solide.r + r) return true;
            } else if (Math.abs(x - o.x) < o.solide.l / 2 + r && Math.abs(y - (o.y - o.solide.h / 2)) < o.solide.h / 2 + r / 2) {
              return true;
            }
          }
        }
      }
      return false;
    }

    verifierZones() {
      const { ZONES, T } = this.monde;
      const j = this.joueur;
      let zone = null;
      for (const nom of ['village', 'foret', 'ruines', 'arene', 'camp']) {
        const z = ZONES[nom];
        if (Math.hypot(j.x / T - z.x, j.y / T - z.y) < z.r + (nom === 'foret' ? 2 : 0)) { zone = nom; break; }
      }
      if (zone !== this.zoneCourante) {
        this.zoneCourante = zone;
        if (zone) {
          this.ui.zone(zone);
          if (zone !== 'camp' && !this.etat.zones.has(zone)) {
            this.etat.zones.add(zone);
            this.sauvegarder();
            if (['village', 'foret', 'ruines', 'arene'].every(z => this.etat.zones.has(z))) this.debloquerSucces('explorateur');
          }
          if (zone === 'arene' && this.domeOuvert() && !this.etat.bossVaincu && !this.boss.eveille) this.reveillerBoss();
        }
      }
    }

    // Objet interactif le plus proche (affiche l'invite "E")
    verifierInteractions() {
      const j = this.joueur;
      let plusProche = null, distanceMin = Infinity;
      for (const o of this.monde.objets) {
        if (!o.interaction) continue;
        const d = Math.hypot(o.x - j.x, o.y - j.y);
        if (d > o.interaction.rayon) continue;
        if (o.interaction.type === 'orbe') {
          if (!this.etat.orbes.has(o.indice)) this.ramasserOrbe(o);
          continue;
        }
        if (o.interaction.type === 'pylone') continue;
        if (d < distanceMin) { distanceMin = d; plusProche = o; }
      }
      this.objetProche = plusProche;
      this.ui.boutonAction(plusProche ? this.libelleAction(plusProche) : null);
    }

    libelleAction(objet) {
      return {
        archiviste: 'jeu.action-parler',
        panneau: 'jeu.action-lire',
        stele: 'jeu.action-examiner',
        phare: 'jeu.action-examiner'
      }[objet.interaction.type];
    }

    action() {
      if (this.mode !== 'jeu') return;
      if (this.objetProche) this.interagir(this.objetProche);
    }

    interagir(objet) {
      this.audio.jouer('interagir');
      const type = objet.interaction.type;
      if (type === 'archiviste') {
        this.bloquer();
        const dejaFait = this.etat.archiviste;
        const pages = dejaFait
          ? ['jeu.archiviste-retour', 'apropos.p1', 'apropos.p2', 'apropos.p3']
          : ['jeu.archiviste-1', 'jeu.archiviste-2', 'apropos.p1', 'apropos.p2', 'apropos.p3', 'jeu.archiviste-fin'];
        this.ui.dialogue({ nom: 'jeu.nom-archiviste', portrait: 'archiviste', pages }, () => {
          if (!dejaFait) {
            this.etat.archiviste = true;
            this.obtenirFragment('histoire', objet.x, objet.y - 20);
            this.debloquerSucces('bavard');
          }
          this.rendreControle();
        });
      } else if (type === 'panneau') {
        this.bloquer();
        this.ui.dialogue({ nom: 'jeu.nom-panneau', portrait: 'panneau', pages: [objet.interaction.cle] }, () => this.rendreControle());
      } else if (type === 'stele') {
        this.bloquer();
        const nouvelle = !this.etat.steles.has(objet.indice);
        if (nouvelle) {
          this.etat.steles.add(objet.indice);
          objet.sprite = this.sprites.steleAllumee;
          objet.lumiere = { ...objet.lumiere, couleur: '255,209,102', intensite: 0.7 };
          this.audio.jouer('stele');
          for (let i = 0; i < 16; i++) this.emettre(objet.x, objet.y - 16, 'etincelle', '255,209,102');
          this.sauvegarder();
        }
        this.ui.ouvrirProjet(objet.indice, this.etat.steles.size, this.monde.steles.length, () => {
          if (nouvelle && this.etat.steles.size === this.monde.steles.length) {
            this.obtenirFragment('oeuvres', objet.x, objet.y - 20);
            this.debloquerSucces('archeologue');
          }
          this.rendreControle();
        });
      } else if (type === 'phare') {
        this.bloquer();
        if (this.etat.bossVaincu) {
          this.ui.fin(this.statistiques(), () => this.rendreControle());
        } else {
          this.ui.dialogue({ nom: 'jeu.nom-phare', portrait: 'panneau', pages: ['jeu.phare-eteint'] }, () => this.rendreControle());
        }
      }
    }

    ramasserOrbe(orbe) {
      this.etat.orbes.add(orbe.indice);
      const competence = donnees.competences[orbe.indice % donnees.competences.length];
      this.audio.jouer('orbe');
      for (let i = 0; i < (this.mouvementReduit ? 6 : 18); i++) this.emettre(orbe.x, orbe.y - 8, 'etincelle', '138,255,193');
      this.ui.toast(t('jeu.orbe-obtenue', {
        nom: competence.nom,
        niveau: t(`niveau.${competence.niveau}`),
        n: this.etat.orbes.size,
        total: this.monde.orbes.length
      }), 'orbe');
      this.sauvegarder();
      if (this.etat.orbes.size === this.monde.orbes.length) {
        this.obtenirFragment('savoir', orbe.x, orbe.y);
        this.debloquerSucces('collectionneur');
      }
      this.majHud();
    }

    obtenirFragment(cle, x, y) {
      this.audio.jouer('fragment');
      this.secouer(3);
      for (let i = 0; i < (this.mouvementReduit ? 10 : 50); i++) this.emettre(x, y, 'etincelle', '255,243,176');
      this.majObscurite();
      this.sauvegarder();
      this.ui.fragment(cle, this.nombreFragments());
      this.majHud();
      if (this.domeOuvert() && !this.etat.bossVaincu && cle !== 'lien') {
        window.setTimeout(() => this.ui.toast(t('jeu.dome-ouvert'), 'fragment'), 2600);
      }
    }

    // ============================================
    // Le Grand Bug (boss)
    // ============================================
    reveillerBoss() {
      this.boss.eveille = true;
      this.etat.touche = false;
      this.audio.changerAmbiance('boss');
      this.bloquer();
      this.ui.dialogue({ nom: 'jeu.nom-bug', portrait: 'bug', pages: ['jeu.bug-1', 'jeu.bug-2', 'jeu.bug-3'] }, () => {
        this.ui.bossPv(this.boss.pv, 3);
        this.rendreControle();
      });
    }

    mettreAJourBoss(dt) {
      const b = this.boss;
      if (!b.eveille || this.etat.bossVaincu) return;
      const j = this.joueur;
      b.degat = Math.max(0, b.degat - dt);
      // le bug dérive autour du centre
      b.x = this.monde.centreArene.x + Math.sin(this.temps * 0.7) * 22;
      b.y = this.monde.centreArene.y - 10 + Math.cos(this.temps * 0.9) * 12;

      // tirs
      b.recharge -= dt;
      if (b.recharge <= 0) {
        const phase = 3 - b.pv;
        b.recharge = [1.9, 1.5, 1.15][phase] || 1.15;
        const angle = Math.atan2(j.y - 6 - b.y, j.x - b.x);
        const salve = phase === 0 ? [0] : phase === 1 ? [-0.25, 0.25] : [-0.4, 0, 0.4];
        salve.forEach(ecart => this.projectiles.push({
          x: b.x, y: b.y, vx: Math.cos(angle + ecart) * (52 + phase * 8), vy: Math.sin(angle + ecart) * (52 + phase * 8), vie: 4.5
        }));
        this.audio.jouer('tir');
      }

      // projectiles
      this.projectiles = this.projectiles.filter(p => {
        p.x += p.vx * dt; p.y += p.vy * dt; p.vie -= dt;
        if (Math.hypot(p.x - j.x, p.y - (j.y - 6)) < 7 && j.invulnerable <= 0) {
          j.invulnerable = 1.3;
          this.etat.touche = true;
          const d = Math.hypot(p.vx, p.vy) || 1;
          for (let i = 0; i < 6; i++) this.deplacer(j, p.vx / d * 4, p.vy / d * 4);
          this.secouer(5);
          this.flash = this.mouvementReduit ? 0 : 0.35;
          this.audio.jouer('coup');
          for (let i = 0; i < 14; i++) this.emettre(j.x, j.y - 6, 'etincelle', '255,61,154');
          return false;
        }
        return p.vie > 0;
      });

      // charge des pylônes
      this.monde.pylones.forEach(pylone => {
        if (pylone.actif) return;
        const proche = Math.hypot(pylone.x - j.x, pylone.y - j.y) < pylone.interaction.rayon;
        if (proche) {
          pylone.charge = Math.min(1, pylone.charge + dt / DUREE_CHARGE_PYLONE);
          if (Math.floor(this.temps * 8) !== Math.floor((this.temps - dt) * 8)) this.audio.jouer('charge');
          if (this.alea() < 0.5) this.emettre(pylone.x + (this.alea() - 0.5) * 10, pylone.y - 4, 'etincelle', '127,227,255');
          if (pylone.charge >= 1) this.activerPylone(pylone);
        }
      });
    }

    activerPylone(pylone) {
      pylone.actif = true;
      pylone.sprite = this.sprites.pyloneActif;
      pylone.lumiere.intensite = 0.9;
      pylone.lumiere.couleur = '255,243,176';
      this.boss.pv -= 1;
      this.boss.degat = 0.6;
      this.rayonPylone = { pylone, vie: 0.6 };
      this.audio.jouer('pylone');
      this.audio.jouer('boss-touche');
      this.secouer(7);
      this.flash = this.mouvementReduit ? 0 : 0.5;
      for (let i = 0; i < 30; i++) this.emettre(this.boss.x, this.boss.y, 'explosion', i % 2 ? '255,61,154' : '61,242,255');
      this.ui.bossPv(this.boss.pv, 3);
      if (this.boss.pv <= 0) this.vaincreBoss();
    }

    vaincreBoss() {
      this.projectiles = [];
      this.etat.bossVaincu = true;
      this.mode = 'dialogue';
      this.ui.boutonAction(null);
      this.audio.jouer('explosion');
      this.audio.changerAmbiance('fin');
      this.secouer(12);
      for (let i = 0; i < (this.mouvementReduit ? 40 : 220); i++) {
        this.emettre(this.boss.x, this.boss.y, 'explosion', ['255,61,154', '61,242,255', '255,255,255', '255,209,102'][i % 4]);
      }
      this.monde.phare.sprite = this.sprites.phareAllume;
      this.monde.phare.lumiere.intensite = 1;
      window.setTimeout(() => {
        this.obtenirFragment('lien', this.monde.phare.x, this.monde.phare.y - 74);
        this.debloquerSucces('chasseur');
        if (!this.etat.touche) this.debloquerSucces('intouchable');
        if (this.etat.tempsJeu < 300) this.debloquerSucces('eclair');
        this.ui.bossPv(null);
      }, 900);
      window.setTimeout(() => this.ui.fin(this.statistiques(), () => this.rendreControle()), 3400);
    }

    statistiques() {
      return {
        temps: this.etat.tempsJeu,
        succes: [...this.etat.succes],
        orbes: this.etat.orbes.size,
        steles: this.etat.steles.size
      };
    }

    // ============================================
    // Caméra et particules
    // ============================================
    mettreAJourCamera(dt) {
      const { T, LARGEUR, HAUTEUR } = this.monde;
      let cibleX, cibleY;
      if (this.mode === 'titre') {
        cibleX = 36 * T + Math.sin(this.temps * 0.08) * 16 * T;
        cibleY = 27 * T + Math.cos(this.temps * 0.11) * 10 * T;
        this.camera.x += (cibleX - this.camera.x) * Math.min(1, dt * 0.6);
        this.camera.y += (cibleY - this.camera.y) * Math.min(1, dt * 0.6);
      } else {
        cibleX = this.joueur.x + this.joueur.vx * 0.25;
        cibleY = this.joueur.y - 8 + this.joueur.vy * 0.25;
        if (this.transitionCamera > 0) {
          this.transitionCamera = Math.max(0, this.transitionCamera - dt * 0.8);
          const k = 1 - Math.pow(this.transitionCamera, 3);
          this.camera.x = this.departCamera.x + (cibleX - this.departCamera.x) * k;
          this.camera.y = this.departCamera.y + (cibleY - this.departCamera.y) * k;
        } else {
          const lissage = this.mouvementReduit ? 1 : Math.min(1, dt * 6);
          this.camera.x += (cibleX - this.camera.x) * lissage;
          this.camera.y += (cibleY - this.camera.y) * lissage;
        }
      }
      const demiL = this.vueL / 2, demiH = this.vueH / 2;
      const maxX = LARGEUR * T - demiL, maxY = HAUTEUR * T - demiH;
      this.camera.x = maxX < demiL ? LARGEUR * T / 2 : Math.max(demiL, Math.min(maxX, this.camera.x));
      this.camera.y = maxY < demiH ? HAUTEUR * T / 2 : Math.max(demiH, Math.min(maxY, this.camera.y));
    }

    mettreAJourParticules(dt) {
      this.particules = this.particules.filter(p => {
        p.vie -= dt;
        p.x += p.vx * dt;
        p.y += p.vy * dt;
        const frottement = p.type === 'explosion' ? 0.94 : 0.9;
        p.vx *= Math.pow(frottement, dt * 60);
        p.vy *= Math.pow(frottement, dt * 60);
        if (p.type === 'poussiere') p.vy -= 6 * dt;
        return p.vie > 0;
      });
      if (this.rayonPylone) {
        this.rayonPylone.vie -= dt;
        if (this.rayonPylone.vie <= 0) this.rayonPylone = null;
      }
      // étincelles du feu de camp
      if (this.alea() < dt * 6) {
        const f = this.monde.feu;
        this.particules.push({ x: f.x + (this.alea() - 0.5) * 6, y: f.y - 8, vx: (this.alea() - 0.5) * 6, vy: -20 - this.alea() * 16, vie: 1.2, vieMax: 1.2, type: 'braise', couleur: '255,170,80', taille: 1 });
      }
    }

    majHud() {
      const total = this.monde.orbes.length;
      this.ui.hud({
        fragments: this.fragments(),
        orbes: this.etat.orbes.size,
        totalOrbes: total,
        steles: this.etat.steles.size,
        totalSteles: this.monde.steles.length,
        objectif: this.objectifCourant()?.cle
      });
    }

    // Prochain objectif : la zone non terminée la plus proche
    objectifCourant() {
      const f = this.fragments();
      const { ZONES, T } = this.monde;
      if (this.etat.bossVaincu) return { cle: 'jeu.objectif-fin', x: this.monde.phare.x, y: this.monde.phare.y - 20 };
      if (this.domeOuvert()) return { cle: 'jeu.objectif-boss', x: this.monde.centreArene.x, y: this.monde.centreArene.y };
      const restants = [];
      if (!f.histoire) restants.push({ cle: 'jeu.objectif-village', x: this.monde.archiviste.x, y: this.monde.archiviste.y });
      if (!f.savoir) {
        const orbe = this.monde.orbes.filter(o => !this.etat.orbes.has(o.indice))
          .sort((a, b) => Math.hypot(a.x - this.joueur.x, a.y - this.joueur.y) - Math.hypot(b.x - this.joueur.x, b.y - this.joueur.y))[0];
        const dansForet = this.zoneCourante === 'foret';
        restants.push({ cle: 'jeu.objectif-foret', x: dansForet && orbe ? orbe.x : ZONES.foret.x * T, y: dansForet && orbe ? orbe.y : ZONES.foret.y * T });
      }
      if (!f.oeuvres) {
        const stele = this.monde.steles.filter(s => !this.etat.steles.has(s.indice))
          .sort((a, b) => Math.hypot(a.x - this.joueur.x, a.y - this.joueur.y) - Math.hypot(b.x - this.joueur.x, b.y - this.joueur.y))[0];
        const dansRuines = this.zoneCourante === 'ruines';
        restants.push({ cle: 'jeu.objectif-ruines', x: dansRuines && stele ? stele.x : ZONES.ruines.x * T + 8, y: dansRuines && stele ? stele.y : ZONES.ruines.y * T + 8 });
      }
      restants.sort((a, b) => Math.hypot(a.x - this.joueur.x, a.y - this.joueur.y) - Math.hypot(b.x - this.joueur.x, b.y - this.joueur.y));
      return restants[0];
    }

    // ============================================
    // Rendu
    // ============================================
    tamponLumiere(couleur) {
      if (!this.tamponsLumiere[couleur]) this.tamponsLumiere[couleur] = creerTamponLumiere(couleur);
      return this.tamponsLumiere[couleur];
    }

    dessiner() {
      const ctx = this.ctx;
      const { T } = this.monde;
      const secX = this.secousse ? (this.alea() - 0.5) * this.secousse : 0;
      const secY = this.secousse ? (this.alea() - 0.5) * this.secousse : 0;
      const camX = Math.round(this.camera.x - this.vueL / 2 + secX);
      const camY = Math.round(this.camera.y - this.vueH / 2 + secY);
      this.camX = camX; this.camY = camY;

      ctx.fillStyle = PALETTE.eauProfonde;
      ctx.fillRect(0, 0, this.vueL, this.vueH);
      ctx.drawImage(this.monde.sol, -camX, -camY);

      // reflets de l'eau
      for (const r of this.monde.reflets) {
        const x = r.x - camX, y = r.y - camY;
        if (x < -4 || y < -4 || x > this.vueL || y > this.vueH) continue;
        const v = Math.sin(this.temps * 1.6 + r.phase);
        if (v > 0.2) {
          ctx.fillStyle = v > 0.75 ? PALETTE.ecume : PALETTE.eauClaire;
          ctx.fillRect(Math.round(x + Math.sin(this.temps + r.phase) * 2), Math.round(y), v > 0.75 ? 3 : 4, 1);
        }
      }

      // dôme du phare (sol)
      if (!this.domeOuvert()) this.dessinerDome(ctx, camX, camY);

      // entités triées par profondeur
      const visibles = [];
      for (const o of this.monde.objets) {
        if (o.x - camX < -48 || o.x - camX > this.vueL + 48 || o.y - camY < -16 || o.y - camY > this.vueH + 96) continue;
        if (o.type === 'orbe' && this.etat.orbes.has(o.indice)) continue;
        visibles.push(o);
      }
      visibles.push({ type: 'joueur', x: this.joueur.x, y: this.joueur.y });
      if (this.boss.eveille && !this.etat.bossVaincu) visibles.push({ type: 'bug', x: this.boss.x, y: this.boss.y + 24 });
      visibles.sort((a, b) => a.y - b.y);
      for (const o of visibles) this.dessinerEntite(ctx, o, camX, camY);

      // projectiles du bug
      for (const p of this.projectiles) {
        const x = Math.round(p.x - camX), y = Math.round(p.y - camY);
        pixel(ctx, x - 2, y - 2, this.alea() < 0.5 ? PALETTE.bugRose : PALETTE.bugCyan, 5, 5);
        pixel(ctx, x - 1, y - 1, '#ffffff', 3, 3);
      }

      // particules non lumineuses
      for (const p of this.particules) {
        if (p.type !== 'poussiere' && p.type !== 'repere') continue;
        const k = p.vie / p.vieMax;
        if (p.type === 'repere') {
          ctx.strokeStyle = `rgba(255,255,255,${k * 0.8})`;
          ctx.lineWidth = 1;
          ctx.beginPath();
          ctx.arc(Math.round(p.x - camX) + 0.5, Math.round(p.y - camY) + 0.5, 2 + (1 - k) * 6, 0, Math.PI * 2);
          ctx.stroke();
        } else {
          ctx.fillStyle = `rgba(${p.couleur},${k * 0.5})`;
          ctx.fillRect(Math.round(p.x - camX), Math.round(p.y - camY), 1, 1);
        }
      }

      this.dessinerEclairage(camX, camY);

      // particules lumineuses (additives)
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const l of this.lucioles) {
        const x = l.x + Math.sin(this.temps * 0.3 * l.vitesse / 6 + l.phase) * 20 - camX;
        const y = l.y + Math.cos(this.temps * 0.25 * l.vitesse / 6 + l.phase * 2) * 14 - camY;
        if (x < -10 || y < -10 || x > this.vueL + 10 || y > this.vueH + 10) continue;
        const eclat = (Math.sin(this.temps * 2 + l.phase * 3) + 1) / 2;
        if (eclat < 0.25) continue;
        ctx.globalAlpha = eclat * 0.5;
        ctx.drawImage(this.tamponLumiere('255,243,160'), x - 4, y - 4, 8, 8);
        ctx.globalAlpha = eclat;
        ctx.fillStyle = '#fff6b0';
        ctx.fillRect(Math.round(x), Math.round(y), 1, 1);
      }
      ctx.globalAlpha = 1;
      for (const p of this.particules) {
        if (p.type === 'poussiere' || p.type === 'repere') continue;
        const k = p.vie / p.vieMax;
        ctx.fillStyle = `rgba(${p.couleur},${Math.min(1, k * 1.3)})`;
        ctx.fillRect(Math.round(p.x - camX), Math.round(p.y - camY), p.taille, p.taille);
      }
      // rayon d'un pylône vers le bug
      if (this.rayonPylone) {
        const { pylone, vie } = this.rayonPylone;
        ctx.strokeStyle = `rgba(255,243,176,${vie / 0.6})`;
        ctx.lineWidth = 3;
        ctx.beginPath();
        ctx.moveTo(pylone.x - camX, pylone.y - 20 - camY);
        ctx.lineTo(this.boss.x - camX, this.boss.y - camY);
        ctx.stroke();
        ctx.strokeStyle = `rgba(255,255,255,${vie / 0.6})`;
        ctx.lineWidth = 1;
        ctx.stroke();
      }
      // faisceau tournant du phare
      if (this.etat.bossVaincu) {
        const ph = this.monde.phare;
        const angle = this.temps * 0.8;
        ctx.globalAlpha = 0.18;
        ctx.fillStyle = '#fff3b0';
        ctx.beginPath();
        ctx.moveTo(ph.x - camX, ph.y - 74 - camY);
        ctx.arc(ph.x - camX, ph.y - 74 - camY, 320, angle - 0.12, angle + 0.12);
        ctx.closePath();
        ctx.fill();
        ctx.globalAlpha = 1;
      }
      // anneau de lumière au réveil de la lanterne
      if (this.anneauEveil > 0) {
        const k = 1 - this.anneauEveil;
        ctx.strokeStyle = `rgba(255,209,102,${this.anneauEveil})`;
        ctx.lineWidth = 2;
        ctx.beginPath();
        ctx.arc(this.joueur.x - camX, this.joueur.y - 8 - camY, 6 + k * 120, 0, Math.PI * 2);
        ctx.stroke();
      }
      ctx.restore();

      if (this.mode === 'jeu' || this.mode === 'dialogue') this.dessinerBoussole(ctx, camX, camY);
      if (this.flash > 0) {
        ctx.fillStyle = `rgba(255,255,255,${this.flash})`;
        ctx.fillRect(0, 0, this.vueL, this.vueH);
      }

      // agrandissement vers l'écran
      const c = this.ctxAffichage;
      c.imageSmoothingEnabled = false;
      c.drawImage(this.tampon, 0, 0, this.vueL * this.echelle * this.ratio, this.vueH * this.echelle * this.ratio);

      this.positionnerInvite();
    }

    dessinerDome(ctx, camX, camY) {
      const { x, y } = this.monde.centreArene;
      const r = this.monde.rayonArene;
      const cx = x - camX, cy = y - camY;
      if (cx < -r - 20 || cx > this.vueL + r + 20 || cy < -r - 20 || cy > this.vueH + r + 20) return;
      for (let i = 0; i < 90; i++) {
        const angle = (i / 90) * Math.PI * 2 + this.temps * 0.15;
        const bruit = Math.sin(this.temps * 5 + i * 1.3) * 2;
        const px = cx + Math.cos(angle) * (r + bruit);
        const py = cy + Math.sin(angle) * (r * 0.86 + bruit);
        ctx.fillStyle = i % 3 === 0 ? PALETTE.bugRose : i % 3 === 1 ? PALETTE.bugCyan : '#ffffff';
        ctx.fillRect(Math.round(px), Math.round(py), this.alea() < 0.1 ? 4 : 2, 1);
      }
    }

    dessinerEntite(ctx, o, camX, camY) {
      const x = o.x - camX, y = o.y - camY;
      switch (o.type) {
        case 'joueur': {
          const j = this.joueur;
          JeuIle.dessinerJoueur(ctx, x, y, j.direction, j.enMarche ? j.pas : null, this.temps, j.invulnerable > 0);
          break;
        }
        case 'feu':
          JeuIle.dessinerFeu(ctx, x, y, this.temps);
          break;
        case 'archiviste':
          JeuIle.dessinerArchiviste(ctx, x, y, this.temps, this.joueur.x < o.x);
          if (!this.etat.archiviste) this.dessinerBulle(ctx, x, y - 34);
          break;
        case 'orbe': {
          const flotte = Math.sin(this.temps * 2.5 + o.phase) * 2;
          ctx.fillStyle = 'rgba(0,0,0,0.3)';
          ctx.fillRect(Math.round(x - 3), Math.round(y - 1), 7, 2);
          disque(ctx, x, y - 9 + flotte, 4, '#2a8f64');
          disque(ctx, x, y - 9 + flotte, 3, PALETTE.orbe);
          pixel(ctx, x - 1, y - 11 + flotte, '#ffffff', 2, 2);
          const angle = this.temps * 3 + o.phase;
          pixel(ctx, x + Math.cos(angle) * 7, y - 9 + flotte + Math.sin(angle) * 3, '#d8ffe9');
          break;
        }
        case 'pylone': {
          const sprite = o.actif ? this.sprites.pyloneActif : this.boss.eveille ? this.sprites.pylonePret : this.sprites.pylone;
          ctx.drawImage(sprite, Math.round(x - o.ox), Math.round(y - o.oy));
          if (!o.actif && o.charge > 0) {
            ctx.strokeStyle = PALETTE.lumiereFroide;
            ctx.lineWidth = 2;
            ctx.beginPath();
            ctx.arc(Math.round(x), Math.round(y - 34), 5, -Math.PI / 2, -Math.PI / 2 + o.charge * Math.PI * 2);
            ctx.stroke();
          }
          break;
        }
        case 'bug':
          JeuIle.dessinerBug(ctx, Math.round(this.boss.x - camX), Math.round(this.boss.y - camY), this.temps, this.joueur.x - camX, this.joueur.y - 8 - camY, this.boss.degat, this.alea);
          break;
        default:
          if (o.sprite) ctx.drawImage(o.sprite, Math.round(x - o.ox), Math.round(y - o.oy));
          if (o.type === 'stele' && !this.etat.steles.has(o.indice) && this.zoneCourante === 'ruines') {
            pixel(ctx, x - 1, y - 34 + Math.round(Math.sin(this.temps * 4 + o.indice)), PALETTE.rune, 2, 2);
          }
      }
    }

    // Bulle "!" au-dessus d'un personnage
    dessinerBulle(ctx, x, y) {
      const flotte = Math.round(Math.sin(this.temps * 4) * 1.5);
      pixel(ctx, x - 4, y - 9 + flotte, PALETTE.contour, 9, 10);
      pixel(ctx, x - 3, y - 8 + flotte, '#ffffff', 7, 8);
      pixel(ctx, x - 1, y + 1 + flotte, PALETTE.contour, 3, 2);
      pixel(ctx, x, y - 7 + flotte, PALETTE.echarpe, 1, 4);
      pixel(ctx, x, y - 2 + flotte, PALETTE.echarpe, 1, 1);
    }

    dessinerEclairage(camX, camY) {
      const l = this.ctxLumiere;
      l.globalCompositeOperation = 'source-over';
      l.clearRect(0, 0, this.vueL, this.vueH);
      l.fillStyle = `rgba(6,6,24,${this.obscurite})`;
      l.fillRect(0, 0, this.vueL, this.vueH);
      l.globalCompositeOperation = 'destination-out';

      const sources = [];
      const vacillement = 1 + Math.sin(this.temps * 13) * 0.03 + Math.sin(this.temps * 7.3) * 0.03;
      const lanterne = JeuIle.positionLanterne(this.joueur.x, this.joueur.y, this.joueur.direction);
      const rayonLanterne = (this.mode === 'titre' ? 46 : 84) * vacillement * (this.joueur.invulnerable > 0 ? 0.8 : 1);
      sources.push({ x: lanterne.x, y: lanterne.y, r: rayonLanterne, couleur: '255,200,120', intensite: 1 });
      for (const o of this.monde.objets) {
        if (!o.lumiere || !o.lumiere.intensite) continue;
        if (o.type === 'orbe' && this.etat.orbes.has(o.indice)) continue;
        const ly = o.y + (o.lumiere.decalageY || 0);
        if (o.x - camX < -o.lumiere.r || o.x - camX > this.vueL + o.lumiere.r || ly - camY < -o.lumiere.r || ly - camY > this.vueH + o.lumiere.r) continue;
        const scintille = o.lumiere.scintille ? vacillement * (1 + Math.sin(this.temps * 17) * 0.04) : 1;
        sources.push({ x: o.x, y: ly, r: o.lumiere.r * scintille, couleur: o.lumiere.couleur, intensite: o.lumiere.intensite });
      }
      if (this.boss.eveille && !this.etat.bossVaincu) sources.push({ x: this.boss.x, y: this.boss.y, r: 50, couleur: '255,61,154', intensite: 0.8 });
      for (const p of this.projectiles) sources.push({ x: p.x, y: p.y, r: 16, couleur: '255,61,154', intensite: 0.7 });
      for (const p of this.particules) {
        if (p.type === 'explosion' && this.alea() < 0.2) sources.push({ x: p.x, y: p.y, r: 10, couleur: p.couleur, intensite: 0.5 * p.vie / p.vieMax });
      }

      const blanc = this.tamponsLumiere['255,255,255'];
      for (const s of sources) {
        l.globalAlpha = Math.min(1, s.intensite);
        l.drawImage(blanc, s.x - camX - s.r, s.y - camY - s.r, s.r * 2, s.r * 2);
      }
      l.globalAlpha = 1;
      this.ctx.drawImage(this.calqueLumiere, 0, 0);

      // teinte colorée des lumières
      const ctx = this.ctx;
      ctx.save();
      ctx.globalCompositeOperation = 'lighter';
      for (const s of sources) {
        ctx.globalAlpha = 0.16 * s.intensite * (this.obscurite + 0.2);
        const r = s.r * 0.8;
        ctx.drawImage(this.tamponLumiere(s.couleur), s.x - camX - r, s.y - camY - r, r * 2, r * 2);
      }
      ctx.restore();
    }

    // Flèche au bord de l'écran vers l'objectif
    dessinerBoussole(ctx, camX, camY) {
      const objectif = this.objectifCourant();
      if (!objectif) return;
      const ox = objectif.x - camX, oy = objectif.y - camY;
      const marge = 14;
      if (ox > marge && ox < this.vueL - marge && oy > marge + 10 && oy < this.vueH - marge) return;
      const cx = this.vueL / 2, cy = this.vueH / 2;
      const angle = Math.atan2(oy - cy, ox - cx);
      const k = Math.min((cx - marge) / Math.abs(Math.cos(angle) || 0.001), (cy - marge - 6) / Math.abs(Math.sin(angle) || 0.001));
      const fx = cx + Math.cos(angle) * k, fy = cy + Math.sin(angle) * k;
      const pulse = 1 + Math.sin(this.temps * 5) * 0.15;
      ctx.save();
      ctx.translate(Math.round(fx), Math.round(fy));
      ctx.rotate(angle);
      ctx.scale(pulse, pulse);
      ctx.fillStyle = PALETTE.contour;
      ctx.beginPath(); ctx.moveTo(7, 0); ctx.lineTo(-5, -6); ctx.lineTo(-2, 0); ctx.lineTo(-5, 6); ctx.closePath(); ctx.fill();
      ctx.fillStyle = PALETTE.lumiereChaude;
      ctx.beginPath(); ctx.moveTo(5, 0); ctx.lineTo(-3, -4); ctx.lineTo(-1, 0); ctx.lineTo(-3, 4); ctx.closePath(); ctx.fill();
      ctx.restore();
    }

    // Invite "E" (HTML, nette) au-dessus de l'objet proche
    positionnerInvite() {
      const o = this.mode === 'jeu' ? this.objetProche : null;
      if (!o) { this.ui.invite(null); return; }
      const hauteur = { archiviste: 38, stele: 36, panneau: 24, phare: 92 }[o.interaction.type] || 30;
      const p = this.mondeVersEcran(o.x, o.y - hauteur);
      this.ui.invite({ x: p.x, y: p.y, tactile: this.toucherPrioritaire });
    }
  }

  JeuIle.Jeu = Jeu;
})();
