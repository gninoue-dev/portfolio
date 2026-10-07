// ============================================
// THÈME STYLE PERSONNEL — "DEV : le manga"
// Planches de manga (encre, trames, onomatopées) et
// interfaces cyberpunk (terminal, glitch, néon).
// Tous les visuels sont originaux et dessinés en CSS/SVG.
// GSAP est chargé à la demande pour les animations.
// ============================================
(function () {
  const GSAP = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/gsap.min.js';
  const SCROLL_TRIGGER = 'https://cdnjs.cloudflare.com/ajax/libs/gsap/3.12.5/ScrollTrigger.min.js';
  const ICONES_CATEGORIES = {
    jeu: 'fa-solid fa-gamepad', web: 'fa-solid fa-globe', ia: 'fa-solid fa-wand-magic-sparkles', outil: 'fa-solid fa-screwdriver-wrench',
    logiciel: 'fa-solid fa-microchip', creation: 'fa-solid fa-palette'
  };
  // Mot décoratif en katakana par catégorie de projet (lecture du mot anglais)
  const KATAKANA_CATEGORIES = { jeu: 'ゲーム', web: 'ウェブ', ia: 'エーアイ', outil: 'ツール' };
  const NIVEAUX = { debutant: 1, intermediaire: 2, expert: 3 };

  let zone = null;
  let categorieCompetences = 'tout';
  let contexteGsap = null;
  let observateur = null;
  let minuteurTerminal = null;

  const $ = selecteur => zone.querySelector(selecteur);
  const racine = () => zone.querySelector('.perso-racine');

  // Lignes de vitesse (SVG) façon planche de manga
  function lignesDeVitesse(nombre, graine) {
    let a = graine;
    const alea = () => { a = (a * 9301 + 49297) % 233280; return a / 233280; };
    const lignes = Array.from({ length: nombre }, () => {
      const angle = alea() * Math.PI * 2;
      const debut = 150 + alea() * 120;
      const epaisseur = 0.6 + alea() * 2.6;
      const x1 = 500 + Math.cos(angle) * debut, y1 = 500 + Math.sin(angle) * debut;
      const x2 = 500 + Math.cos(angle) * 760, y2 = 500 + Math.sin(angle) * 760;
      const nx = Math.cos(angle + Math.PI / 2) * epaisseur, ny = Math.sin(angle + Math.PI / 2) * epaisseur;
      return `<polygon points="${x1.toFixed(1)},${y1.toFixed(1)} ${(x2 + nx).toFixed(1)},${(y2 + ny).toFixed(1)} ${(x2 - nx).toFixed(1)},${(y2 - ny).toFixed(1)}"/>`;
    }).join('');
    return `<svg class="perso-vitesse" viewBox="0 0 1000 1000" preserveAspectRatio="xMidYMid slice" aria-hidden="true">${lignes}</svg>`;
  }

  function reserve(valeur) {
    // information personnelle non fournie : espace réservé assumé
    const texte = Array.isArray(valeur) ? listeTraduite(valeur) : tr(valeur);
    return texte
      ? echapperHtml(texte)
      : `<span class="perso-verrou"><i class="fa-solid fa-lock" aria-hidden="true"></i> ${t('perso.a-debloquer')}</span>`;
  }

  // Lignes de la fiche personnage (reconstruites au changement de langue)
  function lignesFiche() {
    const p = donnees.profil;
    return [
      ['perso.fiche-nom', echapperHtml(p.nomComplet)],
      ['perso.fiche-pseudo', t('perso.fiche-pseudo-valeur')],
      ['perso.fiche-classe', t('profil.role-court')],
      ['perso.fiche-niveau', t('apropos.etudes')],
      ['perso.fiche-origine', reserve(p.ville)],
      ['perso.fiche-arme', echapperHtml(p.langageFavori)],
      ['perso.fiche-quete', t('apropos.objectif')],
      ['perso.fiche-personnalite', reserve(p.personnalite)],
      ['perso.fiche-animes', reserve(p.animesFavoris)],
      ['perso.fiche-jeux', reserve(p.jeuxFavoris)],
      ['perso.fiche-tekken', reserve(p.personnagesTekken)],
      ['perso.fiche-devise', reserve(p.citation)]
    ].map(([cle, valeur]) => `<div${cle === 'perso.fiche-devise' ? ' class="perso-fiche-devise"' : ''}><dt>${t(cle)}</dt><dd>${valeur}</dd></div>`).join('');
  }

  // ============================================
  // Gabarit
  // ============================================
  function gabarit() {
    const p = donnees.profil;
    return `
      <!-- COUVERTURE -->
      <section id="accueil" class="perso-couverture" aria-labelledby="persoTitre">
        ${lignesDeVitesse(110, 7)}
        <span class="perso-kanji-vertical" aria-hidden="true">開発者</span>
        <span class="perso-onomatopee perso-onomatopee-1" aria-hidden="true">ドン</span>

        <div class="perso-couverture-grille">
          <div class="perso-couverture-texte">
            <p class="perso-tampon"><span data-i18n="perso.volume"></span> <strong>01</strong> <span class="perso-alias">a.k.a. ${p.pseudoJeu}</span></p>
            <h1 class="perso-titre" id="persoTitre">
              <span class="perso-glitch" data-texte="GNINOUE">GNINOUE</span>
              <span class="perso-glitch perso-glitch-rouge" data-texte="JEAN-MARC">JEAN&#8209;MARC</span>
            </h1>
            <p class="perso-sous-titre" data-i18n="perso.sous-titre"></p>
            <div class="perso-terminal perso-terminal-mini" aria-hidden="true">
              <span class="perso-invite">dev@gninoue:~$</span> <span id="persoTape"></span><span class="perso-curseur">█</span>
            </div>
            <div class="perso-actions">
              <a href="#projets" data-section="projets" class="perso-bouton perso-bouton-encre"><i class="fa-solid fa-book" aria-hidden="true"></i> <span data-i18n="perso.lire-volumes"></span></a>
              <a href="#contact" data-section="contact" class="perso-bouton"><i class="fa-solid fa-comment" aria-hidden="true"></i> <span data-i18n="perso.ecrire"></span></a>
            </div>
          </div>

          <div class="perso-case-photo">
            <div class="perso-photo-cadre">
              <picture>
                <source srcset="${p.photoWebp}" type="image/webp">
                <img src="${p.photo}" data-i18n-alt="pro.photo-alt" width="720" height="720" fetchpriority="high">
              </picture>
              <span class="perso-trame" aria-hidden="true"></span>
            </div>
            <p class="perso-bulle perso-bulle-photo" data-i18n="perso.bulle-bonjour"></p>
            <span class="perso-onomatopee perso-onomatopee-2" aria-hidden="true">ゴゴゴ</span>
          </div>
        </div>

        <p class="perso-defiler" aria-hidden="true"><span data-i18n="perso.tourner-page"></span> <i class="fa-solid fa-arrow-down"></i></p>
      </section>

      <!-- CHAPITRE 1 : À PROPOS -->
      <section id="apropos" class="perso-chapitre perso-papier" aria-labelledby="persoApropos">
        <header class="perso-entete-chapitre perso-anime">
          <span class="perso-numero-chapitre">01</span>
          <div>
            <p class="perso-etiquette-chapitre" data-i18n="perso.chapitre"></p>
            <h2 id="persoApropos" data-i18n="apropos.titre"></h2>
          </div>
          <span class="perso-kanji-titre" aria-hidden="true">物語</span>
        </header>

        <div class="perso-planche">
          <div class="perso-case perso-case-large perso-anime">
            <p class="perso-narration" data-i18n="apropos.p1"></p>
          </div>
          <div class="perso-case perso-case-sombre perso-anime">
            ${lignesDeVitesse(60, 3)}
            <p class="perso-bulle perso-bulle-centre" data-i18n="apropos.p2"></p>
          </div>
          <div class="perso-case perso-anime">
            <p class="perso-narration" data-i18n="apropos.p3"></p>
            <span class="perso-onomatopee perso-onomatopee-3" aria-hidden="true">キラッ</span>
          </div>

          <aside class="perso-case perso-fiche perso-anime" aria-labelledby="persoFicheTitre">
            <h3 id="persoFicheTitre"><i class="fa-solid fa-id-card" aria-hidden="true"></i> <span data-i18n="perso.fiche"></span></h3>
            <dl id="persoFicheLignes">${lignesFiche()}</dl>
          </aside>
        </div>
      </section>

      <!-- CHAPITRE 2 : COMPÉTENCES -->
      <section id="competences" class="perso-chapitre perso-nuit" aria-labelledby="persoCompetences">
        <header class="perso-entete-chapitre perso-anime">
          <span class="perso-numero-chapitre">02</span>
          <div>
            <p class="perso-etiquette-chapitre" data-i18n="perso.chapitre"></p>
            <h2 id="persoCompetences" data-i18n="competences.titre"></h2>
          </div>
          <span class="perso-kanji-titre" aria-hidden="true">技術</span>
        </header>

        <div class="perso-terminal perso-terminal-grand perso-anime">
          <div class="perso-terminal-barre" aria-hidden="true"><span></span><span></span><span></span><em>skills.exe</em></div>
          <div class="perso-onglets" role="group" data-i18n-aria="perso.filtrer-competences" id="persoOnglets"></div>
          <ul class="perso-liste-competences" id="persoCompetencesListe"></ul>
          <p class="perso-legende"><span data-i18n="perso.legende"></span></p>
        </div>
      </section>

      <!-- CHAPITRE 3 : PROJETS -->
      <section id="projets" class="perso-chapitre perso-papier" aria-labelledby="persoProjets">
        <header class="perso-entete-chapitre perso-anime">
          <span class="perso-numero-chapitre">03</span>
          <div>
            <p class="perso-etiquette-chapitre" data-i18n="perso.chapitre"></p>
            <h2 id="persoProjets" data-i18n="projets.titre"></h2>
          </div>
          <span class="perso-kanji-titre" aria-hidden="true">作品</span>
        </header>
        <p class="perso-intro-chapitre perso-anime" data-i18n="perso.intro-volumes"></p>
        <div class="perso-etagere" id="persoEtagere"></div>
      </section>

      <!-- CHAPITRE 4 : CONTACT -->
      <section id="contact" class="perso-chapitre perso-nuit" aria-labelledby="persoContact">
        <header class="perso-entete-chapitre perso-anime">
          <span class="perso-numero-chapitre">04</span>
          <div>
            <p class="perso-etiquette-chapitre" data-i18n="perso.chapitre"></p>
            <h2 id="persoContact" data-i18n="contact.titre"></h2>
          </div>
          <span class="perso-kanji-titre" aria-hidden="true">連絡</span>
        </header>

        <div class="perso-contact">
          <div class="perso-case perso-case-papier perso-anime">
            <p class="perso-bulle perso-bulle-cri" data-i18n="contact.sous-titre"></p>
            <p class="perso-dispo"><span class="perso-point" aria-hidden="true"></span><span data-i18n="contact.dispo"></span></p>
            <ul class="perso-liens-contact">
              <li><a href="mailto:${donnees.liens.email}"><i class="fa-solid fa-envelope" aria-hidden="true"></i> ${donnees.liens.email}</a></li>
              <li><a href="https://wa.me/${donnees.liens.whatsapp}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${donnees.liens.whatsappAffiche}</a></li>
              <li><a href="${donnees.liens.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github" aria-hidden="true"></i> github.com/gninoue-dev</a></li>
            </ul>
          </div>

          <form class="perso-terminal perso-formulaire perso-anime" id="persoFormulaire" novalidate>
            <div class="perso-terminal-barre" aria-hidden="true"><span></span><span></span><span></span><em>message.sh</em></div>
            <input type="hidden" name="_subject" value="Portfolio (thème personnel) : nouveau message">
            <input type="text" name="_honey" class="visuellement-cache" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label for="persoNom"><span aria-hidden="true">&gt;</span> <span data-i18n="contact.label-nom"></span></label>
            <input type="text" id="persoNom" name="Nom" autocomplete="name" required data-i18n-placeholder="contact.placeholder-nom">
            <label for="persoEmail"><span aria-hidden="true">&gt;</span> <span data-i18n="contact.label-email"></span></label>
            <input type="email" id="persoEmail" name="Email" autocomplete="email" required data-i18n-placeholder="contact.placeholder-email">
            <label for="persoMessage"><span aria-hidden="true">&gt;</span> <span data-i18n="contact.label-message"></span></label>
            <textarea id="persoMessage" name="Message" rows="5" required data-i18n-placeholder="contact.placeholder-message"></textarea>
            <button type="submit" class="perso-bouton perso-bouton-neon" id="persoEnvoyer"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> <span data-i18n="contact.bouton-envoyer"></span></button>
            <p class="perso-statut" id="persoStatut" role="status"></p>
          </form>
        </div>
      </section>

      <!-- À SUIVRE : autres thèmes -->
      <section class="perso-a-suivre perso-papier" aria-labelledby="persoASuivre">
        ${lignesDeVitesse(80, 11)}
        <p class="perso-a-suivre-titre" id="persoASuivre" data-i18n="perso.a-suivre"></p>
        <p class="perso-a-suivre-texte" data-i18n="perso.autre-dimension"></p>
        <div class="perso-portails">
          <button class="perso-portail" data-aller-theme="professionnel"><i class="fa-solid fa-briefcase" aria-hidden="true"></i> <span data-i18n="theme.professionnel"></span></button>
          <button class="perso-portail" data-aller-theme="gaming"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> <span data-i18n="theme.gaming"></span></button>
        </div>
      </section>
    `;
  }

  // ============================================
  // Compétences : "jauge de puissance" façon jeu de combat
  // ============================================
  function rendreOnglets() {
    const categories = ['tout', ...new Set(donnees.competences.map(c => c.categorie))];
    $('#persoOnglets').innerHTML = categories.map(c => `
      <button class="perso-onglet ${c === categorieCompetences ? 'actif' : ''}" data-categorie="${c}" aria-pressed="${c === categorieCompetences}">
        ${t(`categorie.${c}`)}
      </button>`).join('');
  }

  function rendreCompetences() {
    const liste = donnees.competences.filter(c => categorieCompetences === 'tout' || c.categorie === categorieCompetences);
    $('#persoCompetencesListe').innerHTML = liste.map((c, i) => `
      <li class="perso-competence" style="--i:${i}">
        <span class="perso-competence-nom"><i class="${c.icone}" aria-hidden="true"></i> ${c.nom}</span>
        <span class="perso-jauge" aria-hidden="true">
          ${Array.from({ length: 9 }, (_, k) => `<span class="${k < NIVEAUX[c.niveau] * 3 ? 'plein' : ''}"></span>`).join('')}
        </span>
        <span class="perso-competence-niveau">${t(`niveau.${c.niveau}`)}</span>
      </li>`).join('');
  }

  // ============================================
  // Projets : couvertures de volumes de manga
  // ============================================
  function rendreEtagere() {
    $('#persoEtagere').innerHTML = donnees.projets.map((projet, i) => {
      const numero = String(i + 1).padStart(2, '0');
      const liens = [
        projet.lienCode
          ? `<a href="${projet.lienCode}" target="_blank" rel="noopener" class="perso-lien-volume"><i class="fa-brands fa-github" aria-hidden="true"></i> ${t('projets.code')}</a>`
          : `<span class="perso-lien-volume perso-lien-inactif"><i class="fa-solid fa-lock" aria-hidden="true"></i> ${t('projets.code-prive')}</span>`,
        projet.lienDemo
          ? `<a href="${projet.lienDemo}" target="_blank" rel="noopener" class="perso-lien-volume"><i class="fa-solid fa-play" aria-hidden="true"></i> ${t('projets.demo')}</a>`
          : ''
      ].join('');
      return `
        <article class="perso-volume perso-volume-${projet.categorie} perso-anime" style="--i:${i}">
          <div class="perso-volume-couverture" aria-hidden="true">
            <span class="perso-volume-numero">VOL.${numero}</span>
            <span class="perso-volume-katakana">${KATAKANA_CATEGORIES[projet.categorie] || ''}</span>
            <i class="${ICONES_CATEGORIES[projet.categorie]} perso-volume-icone"></i>
            <span class="perso-volume-titre-couverture">${echapperHtml(tr(projet.nom))}</span>
          </div>
          <div class="perso-volume-contenu">
            <p class="perso-volume-meta">
              ${projet.vedette ? `<span class="perso-vedette"><i class="fa-solid fa-star" aria-hidden="true"></i> ${t('projets.vedette')}</span>` : ''}
              <span class="perso-statut-${projet.statut}">${t(`projets.${projet.statut}`)}</span>
              <span>${t(`categorie.${projet.categorie}`)}</span>
            </p>
            <h3>${tr(projet.nom)}</h3>
            <p>${tr(projet.description)}</p>
            <ul class="perso-technos">${projet.technos.map(x => `<li>${x}</li>`).join('')}</ul>
            <div class="perso-volume-liens">${liens}</div>
          </div>
        </article>`;
    }).join('');
  }

  // ============================================
  // Terminal qui tape des commandes dans la couverture
  // ============================================
  function lancerTerminal() {
    const cible = $('#persoTape');
    const commandes = t('perso.commandes').split('|');
    if (mouvementReduit.matches) { cible.textContent = commandes[0]; return; }
    let indexCommande = 0, indexLettre = 0, efface = false;
    window.clearInterval(minuteurTerminal);
    minuteurTerminal = window.setInterval(() => {
      if (!zone) return;
      const texte = commandes[indexCommande];
      if (!efface) {
        indexLettre++;
        if (indexLettre > texte.length + 22) efface = true;
      } else {
        indexLettre -= 2;
        if (indexLettre <= 0) { efface = false; indexCommande = (indexCommande + 1) % commandes.length; indexLettre = 0; }
      }
      cible.textContent = texte.slice(0, Math.min(indexLettre, texte.length));
    }, 55);
  }

  // ============================================
  // Animations (GSAP si disponible, sinon IntersectionObserver)
  // ============================================
  function animerAvecObservateur() {
    racine().classList.add('perso-avec-observateur');
    observateur = new IntersectionObserver(entrees => {
      entrees.forEach(e => {
        if (e.isIntersecting) { e.target.classList.add('visible'); observateur.unobserve(e.target); }
      });
    }, { threshold: 0.15 });
    zone.querySelectorAll('.perso-anime:not(.visible)').forEach(el => observateur.observe(el));
  }

  async function animer() {
    if (mouvementReduit.matches) {
      zone.querySelectorAll('.perso-anime').forEach(el => el.classList.add('visible'));
      return;
    }
    try {
      await chargerBibliotheque(GSAP);
      await chargerBibliotheque(SCROLL_TRIGGER);
    } catch (erreur) {
      animerAvecObservateur();
      return;
    }
    if (!zone || !window.gsap) return;
    gsap.registerPlugin(ScrollTrigger);
    racine().classList.add('perso-avec-gsap');
    contexteGsap = gsap.context(() => {
      // couverture : entrée en "coup de poing"
      gsap.from('.perso-titre .perso-glitch', { x: -80, skewX: -20, opacity: 0, duration: .7, stagger: .12, ease: 'power4.out' });
      gsap.from('.perso-case-photo', { scale: .7, rotate: 6, opacity: 0, duration: .9, ease: 'back.out(1.6)', delay: .15 });
      gsap.from('.perso-bulle-photo', { scale: 0, opacity: 0, duration: .5, ease: 'back.out(2.5)', delay: .9 });
      gsap.from('.perso-onomatopee', { scale: 2.4, opacity: 0, duration: .5, stagger: .2, ease: 'power3.out', delay: .5 });
      gsap.to('.perso-couverture .perso-vitesse', { rotate: 8, duration: 30, ease: 'none', repeat: -1, yoyo: true });
      gsap.to('.perso-kanji-vertical', { yPercent: 18, ease: 'none', scrollTrigger: { trigger: '.perso-couverture', start: 'top top', end: 'bottom top', scrub: true } });

      // cases de manga : chacune entre avec un léger angle
      gsap.utils.toArray('.perso-anime').forEach((el, i) => {
        gsap.fromTo(el, { y: 60, rotate: i % 2 ? 1.5 : -1.5, opacity: 0 }, {
          y: 0, rotate: 0, opacity: 1, duration: .8, ease: 'power3.out',
          scrollTrigger: { trigger: el, start: 'top 88%', once: true }
        });
      });
      gsap.utils.toArray('.perso-kanji-titre').forEach(el => {
        gsap.fromTo(el, { yPercent: 40 }, { yPercent: -40, ease: 'none', scrollTrigger: { trigger: el, scrub: true } });
      });
    }, racine());
  }

  // Inclinaison 3D des volumes au survol (souris uniquement)
  function brancherInclinaison() {
    if (mouvementReduit.matches || !window.matchMedia('(pointer: fine)').matches) return;
    $('#persoEtagere').addEventListener('pointermove', (e) => {
      const volume = e.target.closest('.perso-volume');
      if (!volume) return;
      const r = volume.getBoundingClientRect();
      const x = (e.clientX - r.left) / r.width - 0.5;
      const y = (e.clientY - r.top) / r.height - 0.5;
      volume.style.setProperty('--incl-x', `${(-y * 8).toFixed(2)}deg`);
      volume.style.setProperty('--incl-y', `${(x * 10).toFixed(2)}deg`);
    });
    $('#persoEtagere').addEventListener('pointerout', (e) => {
      const volume = e.target.closest('.perso-volume');
      if (volume && !volume.contains(e.relatedTarget)) {
        volume.style.setProperty('--incl-x', '0deg');
        volume.style.setProperty('--incl-y', '0deg');
      }
    });
  }

  function brancherInteractions() {
    $('#persoOnglets').addEventListener('click', (e) => {
      const bouton = e.target.closest('[data-categorie]');
      if (!bouton) return;
      categorieCompetences = bouton.dataset.categorie;
      rendreOnglets();
      rendreCompetences();
    });
    zone.querySelectorAll('[data-aller-theme]').forEach(b => b.addEventListener('click', () => appliquerTheme(b.dataset.allerTheme)));
    brancherFormulaire($('#persoFormulaire'), $('#persoStatut'), $('#persoEnvoyer'));
    brancherInclinaison();
  }

  enregistrerTheme('personnel', {
    credits: 'perso.credits',

    monter(el) {
      zone = el;
      zone.innerHTML = `<div class="perso-racine">${gabarit()}</div>`;
      traduireElements(zone);
      rendreOnglets();
      rendreCompetences();
      rendreEtagere();
      brancherInteractions();
      lancerTerminal();
      animer();
    },

    demonter() {
      if (contexteGsap) contexteGsap.revert();
      contexteGsap = null;
      if (observateur) observateur.disconnect();
      observateur = null;
      window.clearInterval(minuteurTerminal);
      zone = null;
    },

    changerLangue() {
      if (!zone) return;
      rendreOnglets();
      rendreCompetences();
      rendreEtagere();
      zone.querySelectorAll('#persoEtagere .perso-anime').forEach(el => { el.classList.add('visible'); el.style.opacity = 1; });
      $('#persoFicheLignes').innerHTML = lignesFiche();
      lancerTerminal();
    }
  });
})();
