// ============================================
// THÈME GAMING — "L'Île des Fragments"
// Interface HTML du jeu (écran-titre, HUD, dialogues,
// panneaux, pause, fin) et mode lecture.
// Le moteur (js/gaming/*.js) est chargé à la demande.
// ============================================
(function () {
  const SCRIPTS_JEU = ['js/gaming/graphismes.js', 'js/gaming/monde.js', 'js/gaming/audio.js', 'js/gaming/jeu.js'];
  const FRAGMENTS = [
    { cle: 'histoire', icone: 'fa-solid fa-scroll' },
    { cle: 'savoir', icone: 'fa-solid fa-gem' },
    { cle: 'oeuvres', icone: 'fa-solid fa-landmark' },
    { cle: 'lien', icone: 'fa-solid fa-lightbulb' }
  ];
  const SUCCES = [
    { cle: 'premier-pas', icone: 'fa-solid fa-shoe-prints' },
    { cle: 'bavard', icone: 'fa-solid fa-comments' },
    { cle: 'explorateur', icone: 'fa-solid fa-compass' },
    { cle: 'collectionneur', icone: 'fa-solid fa-gem' },
    { cle: 'archeologue', icone: 'fa-solid fa-landmark' },
    { cle: 'chasseur', icone: 'fa-solid fa-bug' },
    { cle: 'intouchable', icone: 'fa-solid fa-shield-halved' },
    { cle: 'eclair', icone: 'fa-solid fa-bolt' }
  ];
  const ICONES_CATEGORIES = {
    jeu: 'fa-solid fa-gamepad', web: 'fa-solid fa-globe', ia: 'fa-solid fa-wand-magic-sparkles', outil: 'fa-solid fa-screwdriver-wrench',
    logiciel: 'fa-solid fa-microchip', creation: 'fa-solid fa-palette'
  };

  let zone = null;
  let jeu = null;
  let enLecture = false;
  let dialogueCourant = null;
  let fermeturePanneau = null;
  let dernierHud = null;
  let minuteursToasts = [];
  let confirmationRecommencer = false;
  let ecouteurClavierUi = null;

  const $ = selecteur => zone.querySelector(selecteur);

  // ============================================
  // Gabarit
  // ============================================
  function gabarit() {
    return `
      <section id="accueil" class="jeu-scene" aria-labelledby="jeuTitre">
        <h1 class="visuellement-cache" id="jeuTitreCache" data-i18n="jeu.titre"></h1>

        <div class="jeu-hud" id="jeuHud" hidden>
          <div class="jeu-hud-fragments" id="jeuFragments"></div>
          <p class="jeu-hud-objectif"><i class="fa-solid fa-location-arrow" aria-hidden="true"></i> <span id="jeuObjectif"></span></p>
        </div>

        <div class="jeu-barre-outils">
          <button class="jeu-outil jeu-outil-lecture" id="jeuBoutonLecture">
            <i class="fa-solid fa-book-open" aria-hidden="true"></i><span class="jeu-libelle-long" data-i18n="jeu.mode-lecture"></span><span class="jeu-libelle-court" data-i18n="jeu.mode-lecture-court"></span>
          </button>
          <button class="jeu-outil jeu-outil-icone" id="jeuBoutonSon" aria-pressed="false" data-i18n-aria="jeu.son" data-i18n-title="jeu.son">
            <i class="fa-solid fa-volume-xmark" aria-hidden="true"></i>
          </button>
          <button class="jeu-outil jeu-outil-icone" id="jeuBoutonPause" data-i18n-aria="jeu.pause" data-i18n-title="jeu.pause" hidden>
            <i class="fa-solid fa-pause" aria-hidden="true"></i>
          </button>
        </div>

        <div class="jeu-boss" id="jeuBoss" hidden>
          <span class="jeu-boss-nom" data-i18n="jeu.nom-bug"></span>
          <span class="jeu-boss-barre"><span id="jeuBossPv"></span></span>
        </div>

        <div class="jeu-toasts" id="jeuToasts" aria-live="polite"></div>
        <div class="jeu-banniere" id="jeuBanniere" aria-hidden="true"><strong></strong><span></span></div>
        <div class="jeu-invite" id="jeuInvite" aria-hidden="true" hidden></div>
        <div class="jeu-joystick" id="jeuJoystick" aria-hidden="true" hidden><span></span></div>
        <button class="jeu-bouton-action" id="jeuBoutonAction" hidden></button>

        <!-- Écran-titre -->
        <div class="jeu-ecran-titre" id="jeuEcranTitre">
          <div class="jeu-titre-contenu">
            <p class="jeu-titre-sur" data-i18n="jeu.sous-titre"></p>
            <h2 class="jeu-titre" id="jeuTitre"></h2>
            <p class="jeu-titre-intro" data-i18n="jeu.intro"></p>
            <div class="jeu-titre-actions" id="jeuTitreActions">
              <p class="jeu-chargement" id="jeuChargement"><span class="jeu-chargeur" aria-hidden="true"></span><span data-i18n="jeu.chargement"></span></p>
            </div>
            <div class="jeu-titre-secondaires">
              <button class="jeu-bouton jeu-bouton-secondaire" id="jeuTitreLecture">
                <i class="fa-solid fa-book-open" aria-hidden="true"></i> <span data-i18n="jeu.mode-lecture"></span>
              </button>
              <span data-zone-cv="jeu-bouton jeu-bouton-cv"></span>
            </div>
            <p class="jeu-titre-duree" data-i18n="jeu.duree"></p>
            <ul class="jeu-titre-controles">
              <li><i class="fa-solid fa-keyboard" aria-hidden="true"></i><span data-i18n="jeu.controles-clavier"></span></li>
              <li><i class="fa-solid fa-computer-mouse" aria-hidden="true"></i><span data-i18n="jeu.controles-souris"></span></li>
              <li><i class="fa-solid fa-hand-pointer" aria-hidden="true"></i><span data-i18n="jeu.controles-tactile"></span></li>
            </ul>
            <p class="jeu-titre-note" id="jeuNoteMouvement" data-i18n="jeu.mouvement-reduit" hidden></p>
          </div>
        </div>

        <!-- Dialogue -->
        <div class="jeu-dialogue" id="jeuDialogue" role="dialog" aria-modal="false" aria-labelledby="jeuDialogueNom" hidden>
          <canvas class="jeu-portrait" id="jeuPortrait" width="32" height="32" aria-hidden="true"></canvas>
          <div class="jeu-dialogue-corps">
            <p class="jeu-dialogue-nom" id="jeuDialogueNom"></p>
            <p class="jeu-dialogue-texte" id="jeuDialogueTexte" aria-live="polite"></p>
            <div class="jeu-dialogue-pied">
              <span class="jeu-dialogue-page" id="jeuDialoguePage"></span>
              <button class="jeu-bouton jeu-bouton-petit" id="jeuDialogueSuivant"></button>
            </div>
          </div>
        </div>

        <!-- Panneau de projet / pause / fin (contenu injecté) -->
        <div class="jeu-modale" id="jeuModale" role="dialog" aria-modal="true" aria-labelledby="jeuModaleTitre" hidden>
          <div class="jeu-modale-boite" id="jeuModaleBoite"></div>
        </div>
      </section>

      <div class="jeu-lecture" id="jeuLecture" hidden>
        <div class="jeu-lecture-barre">
          <button class="jeu-bouton" id="jeuRetourJeu"><i class="fa-solid fa-gamepad" aria-hidden="true"></i> <span data-i18n="jeu.retour-jeu"></span></button>
        </div>
        <div id="jeuLectureContenu"></div>
      </div>
    `;
  }

  // ============================================
  // Écran-titre
  // ============================================
  function rendreTitre() {
    const titre = $('#jeuTitre');
    let indice = 0;
    // chaque mot reste insécable, chaque lettre s'anime
    titre.innerHTML = t('jeu.titre').split(' ').map(mot => `<span class="jeu-mot">${[...mot].map(lettre =>
      `<span class="jeu-lettre" style="--i:${indice++}">${echapperHtml(lettre)}</span>`).join('')}</span>`
    ).join(' ');
    titre.setAttribute('aria-label', t('jeu.titre'));
  }

  function rendreActionsTitre() {
    if (!jeu) return;
    const actions = $('#jeuTitreActions');
    const sauvegarde = jeu.aUneSauvegarde();
    actions.innerHTML = sauvegarde
      ? `<button class="jeu-bouton jeu-bouton-principal" data-demarrer="continuer"><i class="fa-solid fa-play" aria-hidden="true"></i> ${t('jeu.continuer')}</button>
         <button class="jeu-bouton" data-demarrer="nouvelle"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> ${t('jeu.nouvelle-partie')}</button>`
      : `<button class="jeu-bouton jeu-bouton-principal" data-demarrer="nouvelle"><i class="fa-solid fa-play" aria-hidden="true"></i> ${t('jeu.jouer')}</button>`;
    actions.querySelectorAll('[data-demarrer]').forEach(bouton => {
      bouton.addEventListener('click', () => demarrerPartie(bouton.dataset.demarrer === 'nouvelle'));
    });
  }

  function demarrerPartie(nouvelle) {
    $('#jeuEcranTitre').classList.add('ferme');
    window.setTimeout(() => { if (zone) $('#jeuEcranTitre').hidden = true; }, 700);
    $('#jeuHud').hidden = false;
    $('#jeuBoutonPause').hidden = false;
    jeu.commencer(nouvelle);
    ui.zone('camp');
  }

  // ============================================
  // Interface appelée par le moteur
  // ============================================
  const ui = {
    hud(etat) {
      dernierHud = etat;
      $('#jeuFragments').innerHTML = FRAGMENTS.map(f => `
        <span class="jeu-fragment ${etat.fragments[f.cle] ? 'obtenu' : ''}" title="${t(`jeu.fragment-${f.cle}`)}">
          <i class="${f.icone}" aria-hidden="true"></i><span class="visuellement-cache">${t(`jeu.fragment-${f.cle}`)} : ${t(etat.fragments[f.cle] ? 'jeu.obtenu' : 'jeu.manquant')}</span>
        </span>`).join('') + `
        <span class="jeu-compteur" title="${t('jeu.orbes')}"><i class="fa-solid fa-circle-dot" aria-hidden="true"></i> ${etat.orbes}/${etat.totalOrbes}</span>
        <span class="jeu-compteur" title="${t('jeu.steles')}"><i class="fa-solid fa-monument" aria-hidden="true"></i> ${etat.steles}/${etat.totalSteles}</span>`;
      $('#jeuObjectif').textContent = etat.objectif ? t(etat.objectif) : '';
    },

    toast(texte, type = 'info') {
      const conteneur = $('#jeuToasts');
      const el = document.createElement('p');
      el.className = `jeu-toast jeu-toast-${type}`;
      const icones = { orbe: 'fa-solid fa-circle-dot', fragment: 'fa-solid fa-star', succes: 'fa-solid fa-trophy', alerte: 'fa-solid fa-triangle-exclamation', info: 'fa-solid fa-circle-info' };
      el.innerHTML = `<i class="${icones[type] || icones.info}" aria-hidden="true"></i> <span>${echapperHtml(texte)}</span>`;
      conteneur.appendChild(el);
      while (conteneur.children.length > 4) conteneur.firstElementChild.remove();
      minuteursToasts.push(window.setTimeout(() => el.classList.add('sortie'), type === 'succes' ? 3800 : 2800));
      minuteursToasts.push(window.setTimeout(() => el.remove(), type === 'succes' ? 4300 : 3300));
    },

    zone(nom) {
      const banniere = $('#jeuBanniere');
      banniere.querySelector('strong').textContent = t(`jeu.zone-${nom}`);
      banniere.querySelector('span').textContent = t(`jeu.zone-${nom}-sous`);
      banniere.classList.remove('visible');
      void banniere.offsetWidth;
      banniere.classList.add('visible');
      annoncerLecteur(t(`jeu.zone-${nom}`));
    },

    fragment(cle, nombre) {
      this.toast(t('jeu.fragment-obtenu', { nom: t(`jeu.fragment-${cle}`), n: nombre }), 'fragment');
    },

    succes(cle) {
      this.toast(t('jeu.succes-debloque', { nom: t(`succes.${cle}`) }), 'succes');
    },

    bossPv(pv, total) {
      const barre = $('#jeuBoss');
      if (pv === null || pv === undefined) { barre.hidden = true; return; }
      barre.hidden = false;
      $('#jeuBossPv').style.width = `${(pv / total) * 100}%`;
    },

    invite(position) {
      const el = $('#jeuInvite');
      if (!position) { el.hidden = true; return; }
      el.hidden = false;
      el.innerHTML = position.tactile ? '<i class="fa-solid fa-hand-pointer"></i>' : 'E';
      el.style.transform = `translate(${Math.round(position.x)}px, ${Math.round(position.y)}px) translate(-50%, -100%)`;
    },

    boutonAction(cle) {
      const bouton = $('#jeuBoutonAction');
      if (!cle) { bouton.hidden = true; return; }
      bouton.hidden = false;
      bouton.textContent = t(cle);
    },

    joystick(etat) {
      const el = $('#jeuJoystick');
      if (!etat) { el.hidden = true; return; }
      el.hidden = false;
      el.style.left = `${etat.x0}px`;
      el.style.top = `${etat.y0}px`;
      el.firstElementChild.style.transform = `translate(${etat.dx * 26}px, ${etat.dy * 26}px)`;
    },

    dialogue(options, quandFini) {
      ouvrirDialogue(options, quandFini);
    },

    ouvrirProjet(indice, vues, total, quandFerme) {
      const projet = donnees.projets[indice % donnees.projets.length];
      ouvrirModale(`
        <p class="jeu-modale-sur"><i class="fa-solid fa-monument" aria-hidden="true"></i> ${t('jeu.stele-progression', { n: vues, total })}</p>
        <h2 class="jeu-modale-titre" id="jeuModaleTitre">${tr(projet.nom)}</h2>
        <p class="jeu-projet-meta">
          ${projet.vedette ? `<span class="jeu-etiquette jeu-etiquette-vedette"><i class="fa-solid fa-star" aria-hidden="true"></i> ${t('projets.vedette')}</span>` : ''}
          <span class="jeu-etiquette jeu-etiquette-${projet.statut}">${t(`projets.${projet.statut}`)}</span>
          <span class="jeu-etiquette"><i class="${ICONES_CATEGORIES[projet.categorie]}" aria-hidden="true"></i> ${t(`categorie.${projet.categorie}`)}</span>
        </p>
        <p class="jeu-modale-texte">${tr(projet.description)}</p>
        <ul class="jeu-technos">${projet.technos.map(x => `<li>${x}</li>`).join('')}</ul>
        <div class="jeu-modale-actions">
          ${liensProjet(projet)}
          <button class="jeu-bouton jeu-bouton-principal" data-fermer><i class="fa-solid fa-check" aria-hidden="true"></i> ${t('jeu.fermer')}</button>
        </div>`, quandFerme);
    },

    ouvrirPause() {
      if (!jeu || jeu.mode !== 'jeu') return;
      jeu.mettreEnPause(true);
      confirmationRecommencer = false;
      ouvrirModale(`
        <h2 class="jeu-modale-titre" id="jeuModaleTitre"><i class="fa-solid fa-pause" aria-hidden="true"></i> ${t('jeu.pause')}</h2>
        <div class="jeu-menu-pause">
          <button class="jeu-bouton jeu-bouton-principal" data-fermer><i class="fa-solid fa-play" aria-hidden="true"></i> ${t('jeu.reprendre')}</button>
          <button class="jeu-bouton" data-pause="lecture"><i class="fa-solid fa-book-open" aria-hidden="true"></i> ${t('jeu.mode-lecture')}</button>
          <button class="jeu-bouton" data-pause="son"><i class="fa-solid ${jeu.audio.actif ? 'fa-volume-high' : 'fa-volume-xmark'}" aria-hidden="true"></i> ${t(jeu.audio.actif ? 'jeu.son-active' : 'jeu.son-coupe')}</button>
          <button class="jeu-bouton" data-pause="theme"><i class="fa-solid fa-palette" aria-hidden="true"></i> ${t('jeu.changer-theme')}</button>
          <span data-zone-cv="jeu-bouton jeu-bouton-cv"></span>
          <button class="jeu-bouton jeu-bouton-danger" data-pause="recommencer"><i class="fa-solid fa-rotate-right" aria-hidden="true"></i> <span>${t('jeu.recommencer')}</span></button>
        </div>
        <h3 class="jeu-modale-sous-titre">${t('jeu.controles')}</h3>
        <ul class="jeu-liste-controles">
          <li><i class="fa-solid fa-keyboard" aria-hidden="true"></i> ${t('jeu.controles-clavier')}</li>
          <li><i class="fa-solid fa-computer-mouse" aria-hidden="true"></i> ${t('jeu.controles-souris')}</li>
          <li><i class="fa-solid fa-hand-pointer" aria-hidden="true"></i> ${t('jeu.controles-tactile')}</li>
        </ul>
        <h3 class="jeu-modale-sous-titre">${t('jeu.fin-succes')}</h3>
        ${htmlSucces(jeu.etat.succes)}`, () => jeu && jeu.mettreEnPause(false));
      remplirZonesCv($('#jeuModaleBoite'));

      $('#jeuModaleBoite').addEventListener('click', (e) => {
        const bouton = e.target.closest('[data-pause]');
        if (!bouton) return;
        const choix = bouton.dataset.pause;
        if (choix === 'lecture') {
          fermerModale(false);
          ouvrirLecture();
        } else if (choix === 'son') {
          ui.basculerSon();
          bouton.innerHTML = `<i class="fa-solid ${jeu.audio.actif ? 'fa-volume-high' : 'fa-volume-xmark'}" aria-hidden="true"></i> ${t(jeu.audio.actif ? 'jeu.son-active' : 'jeu.son-coupe')}`;
        } else if (choix === 'theme') {
          fermerModale(false);
          appliquerTheme(themeSuivant());
        } else if (choix === 'recommencer') {
          if (!confirmationRecommencer) {
            confirmationRecommencer = true;
            bouton.querySelector('span').textContent = t('jeu.confirmer-recommencer');
            return;
          }
          fermerModale(false);
          jeu.mettreEnPause(false);
          ui.bossPv(null);
          jeu.commencer(true);
          ui.zone('camp');
        }
      });
    },

    fin(stats, quandFerme) {
      const minutes = Math.floor(stats.temps / 60);
      const secondes = String(Math.floor(stats.temps % 60)).padStart(2, '0');
      ouvrirModale(`
        <p class="jeu-modale-sur"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> 4 / 4 ${t('jeu.fragments')}</p>
        <h2 class="jeu-modale-titre jeu-titre-fin" id="jeuModaleTitre">${t('jeu.fin-titre')}</h2>
        <p class="jeu-modale-texte">${t('jeu.fin-texte')}</p>
        <dl class="jeu-stats">
          <div><dt>${t('jeu.fin-temps')}</dt><dd>${minutes}:${secondes}</dd></div>
          <div><dt>${t('jeu.fin-succes')}</dt><dd>${stats.succes.length} / ${SUCCES.length}</dd></div>
        </dl>
        ${htmlSucces(new Set(stats.succes))}
        <h3 class="jeu-modale-sous-titre">${t('jeu.fin-contact')}</h3>
        <ul class="jeu-contacts">
          <li><a href="mailto:${donnees.liens.email}"><i class="fa-solid fa-envelope" aria-hidden="true"></i> ${donnees.liens.email}</a></li>
          <li><a href="${lienWhatsapp()}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${donnees.liens.whatsappAffiche}</a></li>
          <li><a href="${donnees.liens.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github" aria-hidden="true"></i> github.com/gninoue-dev</a></li>
        </ul>
        <div class="jeu-modale-actions">
          <button class="jeu-bouton jeu-bouton-principal" data-fin="ecrire"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> ${t('jeu.ecrire')}</button>
          <span data-zone-cv="jeu-bouton jeu-bouton-cv"></span>
          <button class="jeu-bouton" data-fermer><i class="fa-solid fa-person-walking" aria-hidden="true"></i> ${t('jeu.continuer-explorer')}</button>
        </div>`, quandFerme);
      remplirZonesCv($('#jeuModaleBoite'));
      $('#jeuModaleBoite').querySelector('[data-fin="ecrire"]').addEventListener('click', () => {
        fermerModale(true);
        ouvrirLecture('contact');
      });
    },

    basculerSon() {
      if (!jeu) return;
      const actif = jeu.audio.basculer();
      const bouton = $('#jeuBoutonSon');
      bouton.setAttribute('aria-pressed', actif);
      bouton.innerHTML = `<i class="fa-solid ${actif ? 'fa-volume-high' : 'fa-volume-xmark'}" aria-hidden="true"></i>`;
      annoncerLecteur(t(actif ? 'jeu.son-active' : 'jeu.son-coupe'));
    }
  };

  function liensProjet(projet) {
    return [
      projet.lienCode
        ? `<a class="jeu-bouton" href="${projet.lienCode}" target="_blank" rel="noopener"><i class="fa-brands fa-github" aria-hidden="true"></i> ${t('projets.code')}</a>`
        : `<span class="jeu-bouton jeu-bouton-inactif"><i class="fa-solid fa-lock" aria-hidden="true"></i> ${t(projet.codeBientot ? 'projets.code-bientot' : 'projets.code-prive')}</span>`,
      projet.lienDemo
        ? `<a class="jeu-bouton" href="${projet.lienDemo}" target="_blank" rel="noopener"><i class="fa-solid fa-play" aria-hidden="true"></i> ${t('projets.demo')}</a>`
        : ''
    ].join('');
  }

  function htmlSucces(obtenus) {
    return `<ul class="jeu-succes">${SUCCES.map(s => `
      <li class="${obtenus.has(s.cle) ? 'obtenu' : ''}">
        <i class="${s.icone}" aria-hidden="true"></i>
        <span><strong>${t(`succes.${s.cle}`)}</strong><small>${t(`succes.${s.cle}-desc`)}</small></span>
        <span class="visuellement-cache">${t(obtenus.has(s.cle) ? 'jeu.obtenu' : 'jeu.manquant')}</span>
      </li>`).join('')}</ul>`;
  }

  // ============================================
  // Dialogues (texte machine à écrire)
  // ============================================
  function dessinerPortrait(type) {
    const canevas = $('#jeuPortrait');
    const ctx = canevas.getContext('2d');
    ctx.imageSmoothingEnabled = false;
    ctx.clearRect(0, 0, 32, 32);
    ctx.fillStyle = '#17142e';
    ctx.fillRect(0, 0, 32, 32);
    if (!window.JeuIle) return;
    if (type === 'archiviste') JeuIle.dessinerArchiviste(ctx, 16, 38, 0, false);
    else if (type === 'bug') JeuIle.dessinerBug(ctx, 16, 16, performance.now() / 1000, 16, 30, 0, Math.random);
    else ctx.drawImage(jeu.sprites.panneau, 8, 8);
  }

  function ouvrirDialogue(options, quandFini) {
    const boite = $('#jeuDialogue');
    dialogueCourant = { ...options, page: 0, quandFini, ouvertA: performance.now(), ecriture: null };
    $('#jeuDialogueNom').textContent = t(options.nom);
    dessinerPortrait(options.portrait);
    boite.hidden = false;
    afficherPage();
    $('#jeuDialogueSuivant').focus({ preventScroll: true });
  }

  function afficherPage() {
    const d = dialogueCourant;
    const texte = t(d.pages[d.page]);
    const zoneTexte = $('#jeuDialogueTexte');
    const derniere = d.page === d.pages.length - 1;
    $('#jeuDialogueSuivant').innerHTML = derniere
      ? `${t('jeu.fermer')} <i class="fa-solid fa-xmark" aria-hidden="true"></i>`
      : `${t('jeu.suivant')} <i class="fa-solid fa-caret-down" aria-hidden="true"></i>`;
    $('#jeuDialoguePage').textContent = d.pages.length > 1 ? `${d.page + 1} / ${d.pages.length}` : '';
    window.clearInterval(d.ecriture);
    if (mouvementReduit.matches) {
      zoneTexte.textContent = texte;
      d.ecriture = null;
      return;
    }
    let i = 0;
    zoneTexte.textContent = '';
    d.texteComplet = texte;
    d.ecriture = window.setInterval(() => {
      i += 2;
      zoneTexte.textContent = texte.slice(0, i);
      if (i % 6 === 0 && jeu) jeu.audio.jouer('dialogue');
      if (i >= texte.length) {
        window.clearInterval(d.ecriture);
        d.ecriture = null;
      }
    }, 18);
  }

  function avancerDialogue() {
    const d = dialogueCourant;
    if (!d || performance.now() - d.ouvertA < 280) return;
    if (d.ecriture) {
      window.clearInterval(d.ecriture);
      d.ecriture = null;
      $('#jeuDialogueTexte').textContent = d.texteComplet;
      return;
    }
    if (d.page < d.pages.length - 1) {
      d.page++;
      afficherPage();
    } else {
      fermerDialogue();
    }
  }

  function fermerDialogue() {
    const d = dialogueCourant;
    if (!d) return;
    window.clearInterval(d.ecriture);
    dialogueCourant = null;
    $('#jeuDialogue').hidden = true;
    if (d.quandFini) d.quandFini();
  }

  // ============================================
  // Modale (projet, pause, fin)
  // ============================================
  function ouvrirModale(html, quandFerme) {
    // boîte neuve à chaque ouverture : aucun ancien écouteur ne subsiste
    const boite = document.createElement('div');
    boite.className = 'jeu-modale-boite';
    boite.id = 'jeuModaleBoite';
    boite.innerHTML = `<button class="jeu-modale-fermer" data-fermer aria-label="${t('jeu.fermer')}"><i class="fa-solid fa-xmark" aria-hidden="true"></i></button>${html}`;
    $('#jeuModaleBoite').replaceWith(boite);
    fermeturePanneau = { quandFerme, ouvertA: performance.now() };
    boite.querySelectorAll('[data-fermer]').forEach(b => b.addEventListener('click', () => {
      if (performance.now() - fermeturePanneau.ouvertA < 280) return;
      fermerModale(true);
    }));
    $('#jeuModale').hidden = false;
    window.requestAnimationFrame(() => boite.querySelector('.jeu-bouton-principal, [data-fermer]')?.focus({ preventScroll: true }));
  }

  function fermerModale(executerRappel) {
    const modale = $('#jeuModale');
    if (modale.hidden) return;
    modale.hidden = true;
    const rappel = fermeturePanneau?.quandFerme;
    fermeturePanneau = null;
    if (executerRappel && rappel) rappel();
  }

  // ============================================
  // Mode lecture : tout le contenu, sans jouer
  // ============================================
  function rendreLecture() {
    const p = donnees.profil;
    const categories = [...new Set(donnees.competences.map(c => c.categorie))];
    const niveaux = ['debutant', 'intermediaire', 'expert'];
    $('#jeuLectureContenu').innerHTML = `
      <header class="jeu-lecture-entete">
        <picture>
          <source srcset="${p.photoWebp}" type="image/webp">
          <img src="${p.photo}" alt="${t('pro.photo-alt')}" width="160" height="160" loading="lazy">
        </picture>
        <div>
          <p class="jeu-lecture-sur">${t('jeu.lecture-titre')}</p>
          <h2 class="jeu-lecture-nom">${p.nomComplet}</h2>
          <p class="jeu-lecture-role">${t('profil.role-court')} · ${t('pro.langage')} <strong>${p.langageFavori}</strong></p>
          <p class="jeu-lecture-intro"><i class="fa-solid fa-location-dot" aria-hidden="true"></i> ${tr(p.ville)} · <i class="fa-solid fa-gamepad" aria-hidden="true"></i> ${p.pseudoJeu}</p>
          <p class="jeu-lecture-intro">${t('jeu.lecture-intro')}</p>
          <span data-zone-cv="jeu-bouton jeu-bouton-cv jeu-bouton-cv-lecture"></span>
        </div>
      </header>

      <section id="apropos" class="jeu-lecture-section" aria-labelledby="jeuLectApropos">
        <h2 id="jeuLectApropos"><i class="fa-solid fa-scroll" aria-hidden="true"></i> ${t('apropos.titre')}</h2>
        <p>${t('apropos.p1')}</p>
        <p>${t('apropos.p2')}</p>
        <p>${t('apropos.p3')}</p>
        <ul class="jeu-lecture-puces">
          <li><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i> ${t('apropos.etudes')}</li>
          <li><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i> ${t('apropos.objectif')}</li>
        </ul>
      </section>

      <section id="competences" class="jeu-lecture-section" aria-labelledby="jeuLectCompetences">
        <h2 id="jeuLectCompetences"><i class="fa-solid fa-gem" aria-hidden="true"></i> ${t('competences.titre')}</h2>
        <div class="jeu-lecture-categories">
          ${categories.map(cat => `
            <div class="jeu-lecture-categorie">
              <h3><i class="${ICONES_CATEGORIES[cat]}" aria-hidden="true"></i> ${t(`categorie.${cat}`)}</h3>
              <ul>${donnees.competences.filter(c => c.categorie === cat).map(c => `
                <li>
                  <span class="jeu-lecture-competence"><i class="${c.icone}" aria-hidden="true"></i> ${c.nom}</span>
                  <span class="jeu-niveau" title="${t(`niveau.${c.niveau}`)}">
                    ${niveaux.map((n, i) => `<span class="${i <= niveaux.indexOf(c.niveau) ? 'plein' : ''}"></span>`).join('')}
                    <span class="jeu-niveau-texte">${t(`niveau.${c.niveau}`)}</span>
                  </span>
                </li>`).join('')}
              </ul>
            </div>`).join('')}
        </div>
      </section>

      <section id="projets" class="jeu-lecture-section" aria-labelledby="jeuLectProjets">
        <h2 id="jeuLectProjets"><i class="fa-solid fa-landmark" aria-hidden="true"></i> ${t('projets.titre')}</h2>
        <div class="jeu-lecture-projets">
          ${donnees.projets.map(projet => `
            <article class="jeu-carte-projet">
              <p class="jeu-projet-meta">
                ${projet.vedette ? `<span class="jeu-etiquette jeu-etiquette-vedette"><i class="fa-solid fa-star" aria-hidden="true"></i> ${t('projets.vedette')}</span>` : ''}
                <span class="jeu-etiquette jeu-etiquette-${projet.statut}">${t(`projets.${projet.statut}`)}</span>
                <span class="jeu-etiquette"><i class="${ICONES_CATEGORIES[projet.categorie]}" aria-hidden="true"></i> ${t(`categorie.${projet.categorie}`)}</span>
              </p>
              <h3>${tr(projet.nom)}</h3>
              <p>${tr(projet.description)}</p>
              <ul class="jeu-technos">${projet.technos.map(x => `<li>${x}</li>`).join('')}</ul>
              <div class="jeu-carte-liens">${liensProjet(projet)}</div>
            </article>`).join('')}
        </div>
      </section>

      <section id="contact" class="jeu-lecture-section" aria-labelledby="jeuLectContact">
        <h2 id="jeuLectContact"><i class="fa-solid fa-lightbulb" aria-hidden="true"></i> ${t('contact.titre')}</h2>
        <p>${t('contact.sous-titre')} ${t('contact.dispo')}</p>
        <div class="jeu-lecture-contact">
          <ul class="jeu-contacts">
            <li><a href="mailto:${donnees.liens.email}"><i class="fa-solid fa-envelope" aria-hidden="true"></i> ${donnees.liens.email}</a></li>
            <li><a href="${lienWhatsapp()}" target="_blank" rel="noopener"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i> ${donnees.liens.whatsappAffiche}</a></li>
            <li><a href="${donnees.liens.github}" target="_blank" rel="noopener"><i class="fa-brands fa-github" aria-hidden="true"></i> github.com/gninoue-dev</a></li>
          </ul>
          <form class="jeu-formulaire" id="jeuFormulaire" novalidate>
            <input type="hidden" name="_subject" value="Portfolio (thème Gaming) : nouveau message">
            <input type="text" name="_honey" class="visuellement-cache" tabindex="-1" autocomplete="off" aria-hidden="true">
            <label for="jeuNom">${t('contact.label-nom')}</label>
            <input type="text" id="jeuNom" name="Nom" autocomplete="name" required placeholder="${t('contact.placeholder-nom')}">
            <label for="jeuEmail">${t('contact.label-email')}</label>
            <input type="email" id="jeuEmail" name="Email" autocomplete="email" required placeholder="${t('contact.placeholder-email')}">
            <label for="jeuMessage">${t('contact.label-message')}</label>
            <textarea id="jeuMessage" name="Message" rows="5" required placeholder="${t('contact.placeholder-message')}"></textarea>
            <button type="submit" class="jeu-bouton jeu-bouton-principal" id="jeuEnvoyer"><i class="fa-solid fa-paper-plane" aria-hidden="true"></i> <span data-i18n="contact.bouton-envoyer">${t('contact.bouton-envoyer')}</span></button>
            <p class="jeu-statut" id="jeuStatut" role="status"></p>
          </form>
        </div>
      </section>`;
    brancherFormulaire($('#jeuFormulaire'), $('#jeuStatut'), $('#jeuEnvoyer'));
    remplirZonesCv($('#jeuLectureContenu'));
  }

  function ouvrirLecture(section) {
    if (!enLecture) {
      enLecture = true;
      if (jeu) {
        if (jeu.mode === 'jeu') jeu.mettreEnPause(true);
        jeu.lecturePause = true;
      }
      rendreLecture();
      $('.jeu-scene').hidden = true;
      $('#jeuLecture').hidden = false;
    }
    window.requestAnimationFrame(() => {
      const cible = section ? zone.querySelector(`#${section}`) : $('#jeuLecture');
      const y = cible.getBoundingClientRect().top + window.scrollY - (section ? 90 : 0);
      window.scrollTo({ top: section ? y : 0, behavior: 'auto' });
      const titre = section ? cible.querySelector('h2') : $('#jeuRetourJeu');
      if (titre) {
        titre.setAttribute('tabindex', '-1');
        titre.focus({ preventScroll: true });
      }
    });
  }

  function fermerLecture() {
    if (!enLecture) return;
    enLecture = false;
    $('#jeuLecture').hidden = true;
    $('.jeu-scene').hidden = false;
    window.scrollTo({ top: 0, behavior: 'auto' });
    if (jeu) {
      jeu.redimensionner();
      if (jeu.lecturePause) {
        jeu.lecturePause = false;
        jeu.mettreEnPause(false);
      }
    }
    $('#jeuBoutonLecture').focus({ preventScroll: true });
  }

  // ============================================
  // Branchements
  // ============================================
  function brancherInterface() {
    $('#jeuBoutonLecture').addEventListener('click', () => ouvrirLecture());
    $('#jeuTitreLecture').addEventListener('click', () => ouvrirLecture());
    $('#jeuRetourJeu').addEventListener('click', fermerLecture);
    $('#jeuBoutonSon').addEventListener('click', () => ui.basculerSon());
    $('#jeuBoutonPause').addEventListener('click', () => ui.ouvrirPause());
    $('#jeuBoutonAction').addEventListener('click', () => jeu && jeu.action());
    $('#jeuDialogueSuivant').addEventListener('click', avancerDialogue);

    ecouteurClavierUi = (e) => {
      if (!zone) return;
      // stopPropagation : la même touche ne doit pas aussi agir dans le jeu
      if (dialogueCourant && ['KeyE', 'Space', 'Enter'].includes(e.code)) {
        e.stopPropagation();
        if (document.activeElement === $('#jeuDialogueSuivant') && e.code !== 'KeyE') return;
        e.preventDefault();
        if (!e.repeat) avancerDialogue();
      } else if (e.key === 'Escape' && !$('#jeuModale').hidden) {
        e.preventDefault();
        e.stopPropagation();
        fermerModale(true);
      } else if (e.key === 'Escape' && dialogueCourant) {
        e.preventDefault();
        e.stopPropagation();
        fermerDialogue();
      } else if (e.key === 'Tab' && !$('#jeuModale').hidden) {
        // focus piégé dans la modale
        const focusables = [...$('#jeuModaleBoite').querySelectorAll('button, a[href]')];
        const premier = focusables[0], dernier = focusables[focusables.length - 1];
        if (e.shiftKey && document.activeElement === premier) { e.preventDefault(); dernier.focus(); }
        else if (!e.shiftKey && document.activeElement === dernier) { e.preventDefault(); premier.focus(); }
      }
    };
    document.addEventListener('keydown', ecouteurClavierUi);
  }

  async function chargerMoteur() {
    try {
      for (const script of SCRIPTS_JEU) await chargerFichier('js', script);
    } catch (erreur) {
      console.warn(erreur.message);
      $('#jeuChargement').textContent = t('commun.erreur-theme');
      return;
    }
    if (!zone) return; // thème quitté pendant le chargement
    jeu = new JeuIle.Jeu($('.jeu-scene'), ui, {
      mouvementReduit: mouvementReduit.matches,
      libelleCanevas: t('jeu.libelle-canevas')
    });
    rendreActionsTitre();
    jeu.majHud();
    $('#jeuTitreActions .jeu-bouton-principal')?.focus({ preventScroll: true });
  }

  enregistrerTheme('gaming', {
    credits: 'jeu.credits',

    monter(el) {
      zone = el;
      zone.innerHTML = gabarit();
      rendreTitre();
      if (mouvementReduit.matches) $('#jeuNoteMouvement').hidden = false;
      brancherInterface();
      chargerMoteur();
    },

    demonter() {
      if (jeu) jeu.detruire();
      jeu = null;
      minuteursToasts.forEach(id => window.clearTimeout(id));
      minuteursToasts = [];
      if (dialogueCourant) window.clearInterval(dialogueCourant.ecriture);
      dialogueCourant = null;
      fermeturePanneau = null;
      enLecture = false;
      document.removeEventListener('keydown', ecouteurClavierUi);
      zone = null;
    },

    changerLangue() {
      if (!zone) return;
      rendreTitre();
      rendreActionsTitre();
      if (dernierHud) ui.hud(dernierHud);
      if (jeu) jeu.affichage.setAttribute('aria-label', t('jeu.libelle-canevas'));
      if (dialogueCourant) {
        $('#jeuDialogueNom').textContent = t(dialogueCourant.nom);
        afficherPage();
      }
      if (enLecture) rendreLecture();
    },

    // Les liens du header ouvrent le mode lecture à la bonne section
    allerA(section) {
      if (!zone) return false;
      if (section === 'accueil') {
        fermerLecture();
        window.scrollTo({ top: 0, behavior: 'auto' });
        return true;
      }
      if (!$('#jeuModale').hidden) fermerModale(true);
      if (dialogueCourant) fermerDialogue();
      ouvrirLecture(section);
      return true;
    }
  });
})();
