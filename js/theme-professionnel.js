// ============================================
// THÈME PROFESSIONNEL
// Construit la page à partir de donnees.js et traductions.js.
// Structure de Dev conservée : accueil, à propos, compétences,
// projets, contact, bloc "Essayer un autre thème".
// ============================================
(function () {
  const ICONES_CATEGORIES = {
    jeu: 'fa-solid fa-gamepad',
    web: 'fa-solid fa-globe',
    ia: 'fa-solid fa-wand-magic-sparkles',
    outil: 'fa-solid fa-screwdriver-wrench'
  };
  const ICONES_THEMES = {
    professionnel: 'fa-solid fa-briefcase',
    gaming: 'fa-solid fa-gamepad',
    personnel: 'fa-solid fa-bolt'
  };

  let zoneCourante = null;
  let filtreProjets = 'tout';
  let observateurs = [];
  let ecouteurDefilement = null;

  // ---------- Gabarit principal ----------
  function gabarit() {
    const p = donnees.profil;
    return `
      <div class="pro-fond" aria-hidden="true">
        ${Array.from({ length: 10 }, (_, i) => `<span class="pro-particule pro-p${i + 1}"></span>`).join('')}
      </div>

      <section id="accueil" class="pro-accueil">
        <div class="pro-accueil-conteneur">
          <div class="pro-accueil-texte">
            <p class="pro-salutation pro-entree"><span class="pro-trait"></span><span data-i18n="pro.salutation"></span></p>
            <h1 class="pro-titre pro-entree">
              <span class="pro-jesuis" data-i18n="pro.jesuis"></span>
              <span class="pro-nom">${p.nomComplet.replace(/-/g, "&#8209;")}</span>
            </h1>
            <p class="pro-role pro-entree" data-i18n-html="pro.role"></p>
            <p class="pro-accroche pro-entree" data-i18n="pro.accroche"></p>
            <p class="pro-langage pro-entree"><i class="fa-solid fa-code" aria-hidden="true"></i>
              <span data-i18n="pro.langage"></span> <strong>${p.langageFavori}</strong></p>
            <div class="pro-actions pro-entree">
              <a href="#projets" data-section="projets" class="bouton-action bouton-principal">
                <span data-i18n="pro.bouton-projets"></span> <i class="fa-solid fa-arrow-right" aria-hidden="true"></i></a>
              <a href="#contact" data-section="contact" class="bouton-action bouton-secondaire">
                <i class="fa-solid fa-envelope" aria-hidden="true"></i> <span data-i18n="pro.bouton-contact"></span></a>
              <a href="${donnees.liens.github}" target="_blank" rel="noopener" class="pro-bouton-icone" aria-label="GitHub" title="GitHub">
                <i class="fa-brands fa-github" aria-hidden="true"></i></a>
            </div>
          </div>

          <div class="pro-accueil-visuel pro-entree">
            <div class="pro-carte-photo">
              <span class="pro-anneau" aria-hidden="true"></span>
              <span class="pro-orbite" aria-hidden="true"><span></span></span>
              <picture>
                <source srcset="${p.photoWebp}" type="image/webp">
                <img src="${p.photo}" data-i18n-alt="pro.photo-alt" class="pro-photo" width="720" height="720" fetchpriority="high">
              </picture>
              <span class="pro-badge pro-badge-experience">
                <span class="pro-badge-chiffre" data-compteur="${p.anneesExperience}">0</span>
                <span class="pro-badge-libelle" data-i18n="pro.badge-experience"></span>
              </span>
              <span class="pro-badge pro-badge-projets">
                <span class="pro-badge-chiffre" data-compteur="${donnees.projets.length}">0</span>
                <span class="pro-badge-libelle" data-i18n="pro.badge-projets"></span>
              </span>
            </div>
          </div>
        </div>

        <a href="#apropos" data-section="apropos" class="pro-defiler" data-i18n-aria="pro.defiler">
          <span class="pro-souris" aria-hidden="true"><span></span></span>
        </a>
      </section>

      <section id="apropos" class="pro-section pro-apropos" aria-labelledby="titreApropos">
        <div class="pro-conteneur">
          <h2 class="pro-etiquette pro-revele" id="titreApropos"><span class="pro-num">01.</span> <span data-i18n="apropos.titre"></span></h2>
          <div class="pro-apropos-grille">
            <div class="pro-apropos-texte">
              <p class="pro-revele" data-i18n="apropos.p1"></p>
              <p class="pro-revele" data-i18n="apropos.p2"></p>
              <p class="pro-revele" data-i18n="apropos.p3"></p>
              <ul class="pro-puces pro-revele">
                <li><i class="fa-solid fa-graduation-cap" aria-hidden="true"></i><span data-i18n="apropos.etudes"></span></li>
                <li><i class="fa-solid fa-flag-checkered" aria-hidden="true"></i><span data-i18n="apropos.objectif"></span></li>
              </ul>
            </div>
            <aside class="pro-carte-identite pro-revele">
              <p class="pro-identite-nom">Gninoue<br>Jean-Marc</p>
              <span class="pro-identite-separateur"></span>
              <p class="pro-identite-role" data-i18n="profil.role-court"></p>
              <dl class="pro-chiffres">
                <div><dt data-i18n="apropos.chiffre-projets"></dt><dd data-compteur="${donnees.projets.length}">0</dd></div>
                <div><dt data-i18n="apropos.chiffre-competences"></dt><dd data-compteur="${donnees.competences.length}">0</dd></div>
                <div><dt data-i18n="apropos.chiffre-annees"></dt><dd data-compteur="${p.anneesExperience}">0</dd></div>
              </dl>
            </aside>
          </div>
        </div>
      </section>

      <section id="competences" class="pro-section pro-competences" aria-labelledby="titreCompetences">
        <div class="pro-conteneur">
          <h2 class="pro-etiquette pro-revele" id="titreCompetences"><span class="pro-num">02.</span> <span data-i18n="competences.titre"></span></h2>
          <div class="pro-grille-competences" id="proGrilleCompetences"></div>
        </div>
      </section>

      <section id="projets" class="pro-section pro-projets" aria-labelledby="titreProjets">
        <div class="pro-conteneur">
          <div class="pro-entete-section">
            <h2 class="pro-etiquette pro-revele" id="titreProjets"><span class="pro-num">03.</span> <span data-i18n="projets.titre"></span></h2>
            <div class="pro-filtres pro-revele" role="group" data-i18n-aria="projets.filtrer" id="proFiltres"></div>
          </div>
          <div class="pro-grille-projets" id="proGrilleProjets"></div>
          <p class="pro-centre pro-revele">
            <a href="${donnees.liens.github}?tab=repositories" target="_blank" rel="noopener" class="bouton-action bouton-secondaire">
              <i class="fa-brands fa-github" aria-hidden="true"></i> <span data-i18n="projets.voir-github"></span></a>
          </p>
        </div>
      </section>

      <section id="contact" class="pro-section pro-contact" aria-labelledby="titreContact">
        <div class="pro-conteneur">
          <h2 class="pro-etiquette pro-revele" id="titreContact"><span class="pro-num">04.</span> <span data-i18n="contact.titre"></span></h2>
          <div class="pro-contact-grille">
            <div class="pro-contact-intro pro-revele">
              <p class="pro-contact-sous-titre" data-i18n="contact.sous-titre"></p>
              <p class="pro-disponibilite"><span class="pro-point-dispo" aria-hidden="true"></span><span data-i18n="contact.dispo"></span></p>
              <ul class="pro-contact-infos">
                <li><a href="mailto:${donnees.liens.email}"><span class="pro-contact-icone"><i class="fa-solid fa-envelope" aria-hidden="true"></i></span>
                  <span><small data-i18n="contact.email"></small>${donnees.liens.email}</span></a></li>
                <li><a href="https://wa.me/${donnees.liens.whatsapp}" target="_blank" rel="noopener"><span class="pro-contact-icone"><i class="fa-brands fa-whatsapp" aria-hidden="true"></i></span>
                  <span><small data-i18n="contact.whatsapp"></small>${donnees.liens.whatsappAffiche}</span></a></li>
                <li><a href="${donnees.liens.github}" target="_blank" rel="noopener"><span class="pro-contact-icone"><i class="fa-brands fa-github" aria-hidden="true"></i></span>
                  <span><small data-i18n="contact.github"></small>github.com/gninoue-dev</span></a></li>
              </ul>
            </div>

            <form class="pro-formulaire pro-revele" id="proFormulaire" novalidate>
              <h3 class="pro-formulaire-titre" data-i18n="contact.formulaire-titre"></h3>
              <input type="hidden" name="_subject" value="Portfolio : nouveau message">
              <input type="text" name="_honey" class="visuellement-cache" tabindex="-1" autocomplete="off" aria-hidden="true">
              <div class="pro-champ">
                <label for="proNom" data-i18n="contact.label-nom"></label>
                <input type="text" id="proNom" name="Nom" autocomplete="name" required data-i18n-placeholder="contact.placeholder-nom">
              </div>
              <div class="pro-champ">
                <label for="proEmail" data-i18n="contact.label-email"></label>
                <input type="email" id="proEmail" name="Email" autocomplete="email" required data-i18n-placeholder="contact.placeholder-email">
              </div>
              <div class="pro-champ">
                <label for="proMessage" data-i18n="contact.label-message"></label>
                <textarea id="proMessage" name="Message" rows="5" required data-i18n-placeholder="contact.placeholder-message"></textarea>
              </div>
              <button type="submit" class="bouton-action bouton-principal" id="proEnvoyer">
                <i class="fa-solid fa-paper-plane" aria-hidden="true"></i> <span data-i18n="contact.bouton-envoyer"></span>
              </button>
              <p class="pro-statut" id="proStatut" role="status"></p>
            </form>
          </div>
        </div>
      </section>

      <section class="pro-section pro-changer-theme" aria-labelledby="titreChangerTheme">
        <div class="pro-conteneur pro-revele">
          <h2 class="pro-changer-titre" id="titreChangerTheme" data-i18n="pro.essayer-theme"></h2>
          <p class="pro-changer-texte" data-i18n="pro.essayer-theme-texte"></p>
          <div class="pro-cartes-themes">
            ${ORDRE_THEMES.filter(n => n !== 'professionnel').map(nom => `
              <button class="pro-carte-theme pro-carte-theme-${nom}" data-aller-theme="${nom}">
                <span class="pro-carte-theme-icone"><i class="${ICONES_THEMES[nom]}" aria-hidden="true"></i></span>
                <span class="pro-carte-theme-texte">
                  <strong data-i18n="theme.${nom}"></strong>
                  <small data-i18n="theme.description-${nom}"></small>
                </span>
                <i class="fa-solid fa-arrow-right pro-carte-theme-fleche" aria-hidden="true"></i>
              </button>`).join('')}
          </div>
          <button class="pro-bouton-changer" id="proBoutonChanger">
            <i class="fa-solid fa-shuffle" aria-hidden="true"></i> <span data-i18n="pro.essayer-bouton"></span>
          </button>
        </div>
      </section>
    `;
  }

  // ---------- Compétences ----------
  function rendreCompetences() {
    const grille = zoneCourante.querySelector('#proGrilleCompetences');
    const niveaux = ['debutant', 'intermediaire', 'expert'];
    grille.innerHTML = donnees.competences.map((c, index) => `
      <article class="pro-carte-competence pro-revele" data-niveau="${c.niveau}" style="--delai:${(index % 4) * 70}ms">
        <div class="pro-competence-haut">
          <span class="pro-competence-icone"><i class="${c.icone}" aria-hidden="true"></i></span>
          <span class="pro-competence-categorie">${t(`categorie.${c.categorie}`)}</span>
        </div>
        <h3 class="pro-competence-nom">${c.nom}</h3>
        <p class="visuellement-cache">${t('competences.niveau')} ${t(`niveau.${c.niveau}`)}</p>
        <div class="pro-jauge" aria-hidden="true">
          ${niveaux.map((n, i) => `<span class="${i <= niveaux.indexOf(c.niveau) ? 'rempli' : ''}"></span>`).join('')}
        </div>
        <ul class="pro-niveaux" aria-hidden="true">
          ${niveaux.map(n => `<li class="${n === c.niveau ? 'atteint' : ''}">${t(`niveau.${n}`)}</li>`).join('')}
        </ul>
      </article>`).join('');
  }

  // ---------- Projets ----------
  function initialesProjet(nom) {
    return nom.split(/\s+/).slice(0, 2).map(m => m[0]).join('').toUpperCase();
  }

  function rendreFiltres() {
    const categories = ['tout', ...new Set(donnees.projets.map(p => p.categorie))];
    zoneCourante.querySelector('#proFiltres').innerHTML = categories.map(c => `
      <button class="pro-filtre ${c === filtreProjets ? 'actif' : ''}" data-filtre="${c}" aria-pressed="${c === filtreProjets}">
        ${t(`categorie.${c}`)}
      </button>`).join('');
  }

  function rendreProjets() {
    const grille = zoneCourante.querySelector('#proGrilleProjets');
    const liste = donnees.projets.filter(p => filtreProjets === 'tout' || p.categorie === filtreProjets);
    grille.innerHTML = liste.map((projet, index) => {
      const visuel = projet.image
        ? `<img src="${projet.image}" alt="${tr(projet.nom)}" loading="lazy">`
        : `<div class="pro-visuel-reserve pro-visuel-${projet.categorie}" role="img" aria-label="${tr(projet.nom)} — ${t('projets.capture-a-venir')}">
             <span class="pro-visuel-initiales">${initialesProjet(tr(projet.nom))}</span>
             <i class="${ICONES_CATEGORIES[projet.categorie]} pro-visuel-icone" aria-hidden="true"></i>
           </div>`;
      const lienCode = projet.lienCode
        ? `<a href="${projet.lienCode}" target="_blank" rel="noopener" class="pro-lien-projet"><i class="fa-brands fa-github" aria-hidden="true"></i> ${t('projets.code')}</a>`
        : `<span class="pro-lien-projet pro-lien-inactif"><i class="fa-solid fa-lock" aria-hidden="true"></i> ${t('projets.code-prive')}</span>`;
      const lienDemo = projet.lienDemo
        ? `<a href="${projet.lienDemo}" target="_blank" rel="noopener" class="pro-lien-projet pro-lien-demo"><i class="fa-solid fa-arrow-up-right-from-square" aria-hidden="true"></i> ${t('projets.demo')}</a>`
        : '';
      return `
        <article class="pro-carte-projet pro-revele" style="--delai:${(index % 3) * 80}ms">
          <div class="pro-projet-image">
            ${visuel}
            <span class="pro-badge-statut pro-statut-${projet.statut}">${t(`projets.${projet.statut}`)}</span>
          </div>
          <div class="pro-projet-contenu">
            <p class="pro-projet-categorie"><i class="${ICONES_CATEGORIES[projet.categorie]}" aria-hidden="true"></i> ${t(`categorie.${projet.categorie}`)}</p>
            <h3 class="pro-projet-nom">${tr(projet.nom)}</h3>
            <p class="pro-projet-description">${tr(projet.description)}</p>
            <ul class="pro-projet-technos">${projet.technos.map(x => `<li>${x}</li>`).join('')}</ul>
            <div class="pro-projet-liens">${lienCode}${lienDemo}</div>
          </div>
        </article>`;
    }).join('');
    observerRevelations(grille);
  }

  // ---------- Animations au défilement ----------
  function animerCompteur(el) {
    const cible = parseInt(el.dataset.compteur, 10);
    if (mouvementReduit.matches) { el.textContent = cible; return; }
    const debut = performance.now();
    const duree = 1200;
    function etape(maintenant) {
      const progression = Math.min((maintenant - debut) / duree, 1);
      const adouci = 1 - Math.pow(1 - progression, 3);
      el.textContent = Math.round(cible * adouci);
      if (progression < 1) requestAnimationFrame(etape);
    }
    requestAnimationFrame(etape);
  }

  function observerRevelations(racine) {
    const elements = racine.querySelectorAll('.pro-revele:not(.visible)');
    if (!('IntersectionObserver' in window) || mouvementReduit.matches) {
      elements.forEach(el => el.classList.add('visible'));
      return;
    }
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        if (entree.isIntersecting) {
          entree.target.classList.add('visible');
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.12, rootMargin: '0px 0px -40px 0px' });
    elements.forEach(el => observateur.observe(el));
    observateurs.push(observateur);
  }

  function observerCompteurs() {
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        if (entree.isIntersecting) {
          animerCompteur(entree.target);
          observateur.unobserve(entree.target);
        }
      });
    }, { threshold: 0.5 });
    zoneCourante.querySelectorAll('[data-compteur]').forEach(el => observateur.observe(el));
    observateurs.push(observateur);
  }

  // Lien du header surligné selon la section visible
  function observerSections() {
    const liens = document.querySelectorAll('.lien-nav');
    const observateur = new IntersectionObserver((entrees) => {
      entrees.forEach(entree => {
        if (!entree.isIntersecting) return;
        liens.forEach(l => l.classList.toggle('actif', l.dataset.section === entree.target.id));
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    zoneCourante.querySelectorAll('section[id]').forEach(s => observateur.observe(s));
    observateurs.push(observateur);
  }

  // Léger parallaxe de la photo du hero
  function brancherParallaxe() {
    if (mouvementReduit.matches) return;
    const photo = zoneCourante.querySelector('.pro-carte-photo');
    let enAttente = false;
    ecouteurDefilement = () => {
      if (enAttente) return;
      enAttente = true;
      requestAnimationFrame(() => {
        const decalage = Math.min(window.scrollY, 700);
        photo.style.transform = `translateY(${decalage * 0.12}px)`;
        enAttente = false;
      });
    };
    window.addEventListener('scroll', ecouteurDefilement, { passive: true });
  }

  // ---------- Interactions ----------
  function brancherInteractions() {
    zoneCourante.querySelector('#proFiltres').addEventListener('click', (e) => {
      const bouton = e.target.closest('[data-filtre]');
      if (!bouton) return;
      filtreProjets = bouton.dataset.filtre;
      rendreFiltres();
      rendreProjets();
    });

    zoneCourante.querySelectorAll('[data-aller-theme]').forEach(bouton => {
      bouton.addEventListener('click', () => appliquerTheme(bouton.dataset.allerTheme));
    });
    zoneCourante.querySelector('#proBoutonChanger').addEventListener('click', () => appliquerTheme(themeSuivant()));

    brancherFormulaire(
      zoneCourante.querySelector('#proFormulaire'),
      zoneCourante.querySelector('#proStatut'),
      zoneCourante.querySelector('#proEnvoyer')
    );
  }

  enregistrerTheme('professionnel', {
    monter(zone) {
      zoneCourante = zone;
      zone.innerHTML = gabarit();
      rendreCompetences();
      rendreFiltres();
      rendreProjets();
      brancherInteractions();
      observerRevelations(zone);
      observerCompteurs();
      observerSections();
      brancherParallaxe();
    },

    demonter() {
      observateurs.forEach(o => o.disconnect());
      observateurs = [];
      if (ecouteurDefilement) window.removeEventListener('scroll', ecouteurDefilement);
      ecouteurDefilement = null;
      document.querySelectorAll('.lien-nav.actif').forEach(l => l.classList.remove('actif'));
      zoneCourante = null;
    },

    changerLangue() {
      if (!zoneCourante) return;
      rendreCompetences();
      rendreFiltres();
      rendreProjets();
      observerRevelations(zoneCourante);
    }
  });
})();
