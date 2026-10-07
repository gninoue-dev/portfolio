// ============================================
// SOCLE COMMUN
// Header, i18n, chargement des thèmes à la demande,
// mémorisation des préférences, footer, outils partagés.
// ============================================

const LANGUES = ['fr', 'en'];
const ORDRE_THEMES = ['professionnel', 'gaming', 'personnel'];
const FICHIERS_THEMES = {
  professionnel: { css: 'css/theme-professionnel.css', js: 'js/theme-professionnel.js' },
  gaming: { css: 'css/theme-gaming.css', js: 'js/theme-gaming.js' },
  personnel: { css: 'css/theme-personnel.css', js: 'js/theme-personnel.js' }
};

const mouvementReduit = window.matchMedia('(prefers-reduced-motion: reduce)');

// ============================================
// Préférences mémorisées (localStorage peut être indisponible)
// ============================================
function lirePreference(cle) {
  try {
    return window.localStorage.getItem(`portfolio.${cle}`);
  } catch (erreur) {
    return null;
  }
}

function ecrirePreference(cle, valeur) {
  try {
    window.localStorage.setItem(`portfolio.${cle}`, valeur);
  } catch (erreur) {
    // Stockage bloqué (navigation privée, etc.) : on continue sans mémoriser
  }
}

// ============================================
// Traduction
// ============================================
let langueCourante = 'fr';

function t(cle, variables) {
  const texte = traductions[langueCourante][cle] ?? traductions.fr[cle] ?? cle;
  if (!variables) return texte;
  return texte.replace(/\{(\w+)\}/g, (morceau, nom) => variables[nom] ?? morceau);
}

// Choisit la bonne langue dans un objet { fr, en } de donnees.js
function tr(valeur) {
  if (valeur && typeof valeur === 'object') return valeur[langueCourante] || valeur.fr || '';
  return valeur || '';
}

// Années d'expérience calculées depuis l'année de début (donnees.js)
function anneesExperience() {
  return Math.max(1, new Date().getFullYear() - donnees.profil.anneeDebut);
}

// Liste de valeurs (textes ou objets { fr, en }) dans la langue courante
function listeTraduite(valeurs) {
  return (valeurs || []).map(tr).filter(Boolean).join(', ');
}

function echapperHtml(texte) {
  return String(texte)
    .replace(/&/g, '&amp;')
    .replace(/</g, '&lt;')
    .replace(/>/g, '&gt;')
    .replace(/"/g, '&quot;');
}

// Traduit tous les éléments marqués sous "racine"
function traduireElements(racine = document) {
  racine.querySelectorAll('[data-i18n]').forEach(el => { el.textContent = t(el.dataset.i18n); });
  racine.querySelectorAll('[data-i18n-html]').forEach(el => { el.innerHTML = t(el.dataset.i18nHtml); });
  racine.querySelectorAll('[data-i18n-aria]').forEach(el => { el.setAttribute('aria-label', t(el.dataset.i18nAria)); });
  racine.querySelectorAll('[data-i18n-title]').forEach(el => { el.setAttribute('title', t(el.dataset.i18nTitle)); });
  racine.querySelectorAll('[data-i18n-placeholder]').forEach(el => { el.setAttribute('placeholder', t(el.dataset.i18nPlaceholder)); });
  racine.querySelectorAll('[data-i18n-alt]').forEach(el => { el.setAttribute('alt', t(el.dataset.i18nAlt)); });
}

function appliquerLangue(langue, annoncer = false) {
  if (!LANGUES.includes(langue)) langue = 'fr';
  langueCourante = langue;
  document.documentElement.lang = langue;
  document.title = t('commun.titre-page');
  ecrirePreference('langue', langue);

  document.querySelectorAll('[data-langue]').forEach(b => {
    const estActive = b.dataset.langue === langue;
    b.classList.toggle('active', estActive);
    b.setAttribute('aria-pressed', estActive);
  });
  document.getElementById('langueActuelle').textContent = langue.toUpperCase();

  traduireElements();
  majLibelleTheme();
  rendrePiedPage();

  const theme = modulesThemes[themeCourant];
  if (theme && theme.changerLangue) theme.changerLangue(langue);

  if (annoncer) annoncerLecteur(t('commun.langue-change'));
  document.dispatchEvent(new CustomEvent('changementLangue', { detail: { langue } }));
}

// Annonce discrète pour les lecteurs d'écran
function annoncerLecteur(message) {
  const zone = document.getElementById('annonceLecteur');
  zone.textContent = '';
  window.setTimeout(() => { zone.textContent = message; }, 60);
}

// ============================================
// Header : état au scroll, menu mobile, menus déroulants
// ============================================
const entete = document.getElementById('enteteSite');
function majEtatEntete() {
  entete.classList.toggle('defile', window.scrollY > 20);
}
majEtatEntete();
window.addEventListener('scroll', majEtatEntete, { passive: true });

const boutonMenu = document.getElementById('boutonMenu');
const navPrincipale = document.getElementById('navPrincipale');

function ouvrirMenuMobile(ouvrir) {
  navPrincipale.classList.toggle('ouvert', ouvrir);
  boutonMenu.setAttribute('aria-expanded', ouvrir);
  boutonMenu.dataset.i18nAria = ouvrir ? 'commun.fermer-menu' : 'commun.ouvrir-menu';
  boutonMenu.setAttribute('aria-label', t(boutonMenu.dataset.i18nAria));
  document.body.classList.toggle('menu-ouvert', ouvrir);
}

boutonMenu.addEventListener('click', () => {
  ouvrirMenuMobile(!navPrincipale.classList.contains('ouvert'));
});

function initMenuDeroulant(menuEl) {
  const boutonEl = menuEl.querySelector('.bouton-controle');
  boutonEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const estOuvert = menuEl.classList.contains('ouvert');
    fermerTousLesMenus();
    if (!estOuvert) {
      menuEl.classList.add('ouvert');
      boutonEl.setAttribute('aria-expanded', 'true');
      menuEl.querySelector('.option-deroulante.active, .option-deroulante')?.focus({ preventScroll: true });
    }
  });

  // Flèches haut / bas dans la liste
  menuEl.addEventListener('keydown', (e) => {
    if (!['ArrowDown', 'ArrowUp'].includes(e.key) || !menuEl.classList.contains('ouvert')) return;
    e.preventDefault();
    const options = [...menuEl.querySelectorAll('.option-deroulante')];
    const index = options.indexOf(document.activeElement);
    const suivant = e.key === 'ArrowDown' ? index + 1 : index - 1;
    options[(suivant + options.length) % options.length].focus();
  });
}

function fermerTousLesMenus() {
  document.querySelectorAll('.menu-deroulant').forEach(menu => {
    menu.classList.remove('ouvert');
    menu.querySelector('.bouton-controle')?.setAttribute('aria-expanded', 'false');
  });
}

document.addEventListener('click', fermerTousLesMenus);
document.addEventListener('keydown', (e) => {
  if (e.key !== 'Escape') return;
  const menuOuvert = document.querySelector('.menu-deroulant.ouvert');
  if (menuOuvert) {
    fermerTousLesMenus();
    menuOuvert.querySelector('.bouton-controle').focus();
  } else if (navPrincipale.classList.contains('ouvert')) {
    ouvrirMenuMobile(false);
    boutonMenu.focus();
  }
});

initMenuDeroulant(document.getElementById('menuLangue'));
initMenuDeroulant(document.getElementById('menuTheme'));

document.querySelectorAll('[data-langue]').forEach(bouton => {
  bouton.addEventListener('click', () => {
    appliquerLangue(bouton.dataset.langue, true);
    fermerTousLesMenus();
  });
});

document.querySelectorAll('[data-choix-theme]').forEach(bouton => {
  bouton.addEventListener('click', () => {
    fermerTousLesMenus();
    ouvrirMenuMobile(false);
    appliquerTheme(bouton.dataset.choixTheme);
  });
});

// ============================================
// Navigation vers les sections
// Chaque thème peut intercepter (ex. le jeu téléporte le joueur)
// via sa méthode allerA(section) qui renvoie true si gérée.
// ============================================
function allerASection(section) {
  const theme = modulesThemes[themeCourant];
  if (theme && theme.allerA && theme.allerA(section)) return;
  const cible = document.getElementById(section);
  if (cible) {
    cible.scrollIntoView({ behavior: mouvementReduit.matches ? 'auto' : 'smooth' });
    if (!cible.hasAttribute('tabindex')) cible.setAttribute('tabindex', '-1');
    cible.focus({ preventScroll: true });
  } else {
    window.scrollTo({ top: 0, behavior: mouvementReduit.matches ? 'auto' : 'smooth' });
  }
}

document.addEventListener('click', (e) => {
  const lien = e.target.closest('a[data-section], a.logo');
  if (!lien) return;
  e.preventDefault();
  ouvrirMenuMobile(false);
  allerASection(lien.dataset.section || 'accueil');
});

// ============================================
// Chargement des thèmes à la demande
// ============================================
const modulesThemes = {};
const promessesFichiers = {};
let themeCourant = null;
let changementEnCours = null;

// Appelé par chaque js/theme-*.js une fois chargé
function enregistrerTheme(nom, module) {
  modulesThemes[nom] = module;
}

function chargerFichier(type, chemin) {
  const cle = `${type}:${chemin}`;
  if (promessesFichiers[cle]) return promessesFichiers[cle];
  promessesFichiers[cle] = new Promise((resoudre, rejeter) => {
    const el = type === 'css' ? document.createElement('link') : document.createElement('script');
    if (type === 'css') {
      el.rel = 'stylesheet';
      el.href = chemin;
      el.dataset.fichierTheme = chemin;
    } else {
      el.src = chemin;
    }
    el.onload = () => resoudre(el);
    el.onerror = () => {
      delete promessesFichiers[cle];
      el.remove();
      rejeter(new Error(`Échec du chargement : ${chemin}`));
    };
    document.head.appendChild(el);
  });
  return promessesFichiers[cle];
}

// Charge un script externe (bibliothèque CDN) une seule fois
function chargerBibliotheque(url) {
  return chargerFichier('js', url);
}

function majLibelleTheme() {
  if (!themeCourant) return;
  document.getElementById('themeActuel').textContent = t(`theme.${themeCourant}`);
  document.querySelectorAll('[data-choix-theme]').forEach(b => {
    const estActif = b.dataset.choixTheme === themeCourant;
    b.classList.toggle('active', estActif);
    b.setAttribute('aria-pressed', estActif);
  });
}

function attendre(ms) {
  return new Promise(resoudre => window.setTimeout(resoudre, ms));
}

async function appliquerTheme(nom, options = {}) {
  if (!FICHIERS_THEMES[nom]) nom = 'professionnel';
  if (nom === themeCourant && !options.forcer) return;
  if (changementEnCours) await changementEnCours;

  changementEnCours = (async () => {
    const voile = document.getElementById('voileTheme');
    const zone = document.getElementById('zoneTheme');
    const premierChargement = themeCourant === null;
    const ancien = themeCourant;

    voile.classList.add('visible');
    if (!premierChargement && !mouvementReduit.matches) await attendre(320);

    try {
      const fichiers = FICHIERS_THEMES[nom];
      await Promise.all([chargerFichier('css', fichiers.css), chargerFichier('js', fichiers.js)]);
    } catch (erreur) {
      console.warn(erreur.message);
      voile.classList.remove('visible');
      annoncerLecteur(t('commun.erreur-theme'));
      if (premierChargement && nom !== 'professionnel') {
        changementEnCours = null;
        return appliquerTheme('professionnel');
      }
      return;
    }

    if (ancien && modulesThemes[ancien]?.demonter) modulesThemes[ancien].demonter();

    // Seule la feuille du thème actif reste active
    document.querySelectorAll('link[data-fichier-theme]').forEach(lien => {
      lien.disabled = lien.dataset.fichierTheme !== FICHIERS_THEMES[nom].css;
    });

    themeCourant = nom;
    document.body.dataset.theme = nom;
    ecrirePreference('theme', nom);
    zone.innerHTML = '';
    window.scrollTo(0, 0);

    modulesThemes[nom].monter(zone);
    traduireElements(zone);
    majLibelleTheme();
    majEtatEntete();
    rendrePiedPage();

    document.body.classList.remove('chargement');
    window.requestAnimationFrame(() => voile.classList.remove('visible'));
    if (!premierChargement) annoncerLecteur(t('commun.theme-change', { theme: t(`theme.${nom}`) }));
    document.dispatchEvent(new CustomEvent('changementTheme', { detail: { theme: nom } }));
  })();

  await changementEnCours;
  changementEnCours = null;
}

function themeSuivant() {
  const index = ORDRE_THEMES.indexOf(themeCourant);
  return ORDRE_THEMES[(index + 1) % ORDRE_THEMES.length];
}

// ============================================
// Footer (CV, réseaux, crédits) et bulle WhatsApp
// ============================================
const RESEAUX = [
  { cle: 'github', icone: 'fa-brands fa-github', nom: 'GitHub' },
  { cle: 'linkedin', icone: 'fa-brands fa-linkedin-in', nom: 'LinkedIn' },
  { cle: 'facebook', icone: 'fa-brands fa-facebook-f', nom: 'Facebook' },
  { cle: 'tiktok', icone: 'fa-brands fa-tiktok', nom: 'TikTok' },
  { cle: 'instagram', icone: 'fa-brands fa-instagram', nom: 'Instagram' }
];

function lienWhatsapp() {
  return `https://wa.me/${donnees.liens.whatsapp}?text=${encodeURIComponent(t('commun.whatsapp-message'))}`;
}

function lienDemandeCv() {
  return `mailto:${donnees.liens.email}?subject=${encodeURIComponent(t('footer.cv-sujet'))}`;
}

// Bouton CV : téléchargement si le PDF existe, sinon demande par email
function htmlBoutonCv(classe = 'bouton-action bouton-principal') {
  if (donnees.liens.cv) {
    return `<a href="${donnees.liens.cv}" download class="${classe}">
      <i class="fa-solid fa-download" aria-hidden="true"></i> <span>${t('footer.cv')}</span></a>`;
  }
  return `<a href="${lienDemandeCv()}" class="${classe}">
    <i class="fa-solid fa-file-lines" aria-hidden="true"></i> <span>${t('footer.cv-demande')}</span></a>`;
}

function rendrePiedPage() {
  document.getElementById('zoneCv').innerHTML = htmlBoutonCv();

  const reseaux = [
    ...RESEAUX.filter(r => donnees.liens[r.cle]).map(r => ({ ...r, url: donnees.liens[r.cle], externe: true })),
    { icone: 'fa-solid fa-envelope', nom: t('contact.email'), url: `mailto:${donnees.liens.email}` }
  ];
  document.getElementById('piedReseaux').innerHTML = reseaux.map(r => `
    <a href="${r.url}" ${r.externe ? 'target="_blank" rel="noopener"' : ''} aria-label="${r.nom}" title="${r.nom}">
      <i class="${r.icone}" aria-hidden="true"></i></a>`).join('');

  const creditsTheme = modulesThemes[themeCourant]?.credits;
  document.getElementById('piedCredits').textContent =
    [t('footer.credits'), creditsTheme ? t(creditsTheme) : ''].filter(Boolean).join(' · ');

  document.getElementById('bulleWhatsapp').href = lienWhatsapp();
  document.getElementById('anneeCourante').textContent = new Date().getFullYear();
}

// ============================================
// Formulaire de contact partagé (FormSubmit en AJAX)
// Chaque thème construit son formulaire puis appelle brancherFormulaire.
// ============================================
function brancherFormulaire(formulaire, statut, bouton) {
  formulaire.addEventListener('submit', async (e) => {
    e.preventDefault();
    const contenuBouton = bouton.innerHTML;
    bouton.disabled = true;
    bouton.textContent = t('contact.envoi-cours');
    statut.textContent = '';
    statut.className = statut.className.replace(/\s?(succes|erreur)/g, '');

    try {
      const reponse = await fetch(donnees.liens.formulaire, {
        method: 'POST',
        headers: { Accept: 'application/json' },
        body: new FormData(formulaire)
      });
      if (!reponse.ok) throw new Error(`Statut ${reponse.status}`);
      statut.textContent = t('contact.succes');
      statut.classList.add('succes');
      formulaire.reset();
      formulaire.dispatchEvent(new CustomEvent('messageEnvoye'));
    } catch (erreur) {
      statut.textContent = t('contact.erreur');
      statut.classList.add('erreur');
    } finally {
      bouton.disabled = false;
      bouton.innerHTML = contenuBouton;
      traduireElements(bouton);
    }
  });
}

// ============================================
// Démarrage : langue et thème depuis l'URL (?lang=en&theme=gaming),
// sinon depuis la dernière visite, sinon FR + Professionnel.
// ============================================
(function demarrer() {
  const parametres = new URLSearchParams(window.location.search);
  const langue = parametres.get('lang') || lirePreference('langue') || 'fr';
  const theme = parametres.get('theme') || lirePreference('theme') || 'professionnel';

  appliquerLangue(langue);
  appliquerTheme(theme);
})();
