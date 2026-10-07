// État du header au scroll
const entete = document.getElementById('enteteSite');
function majEtatEntete() {
  if (window.scrollY > 20) {
    entete.classList.add('defile');
  } else {
    entete.classList.remove('defile');
  }
}
majEtatEntete();
window.addEventListener('scroll', majEtatEntete, { passive: true });

// Menu mobile
const boutonMenu = document.getElementById('boutonMenu');
const navPrincipale = document.getElementById('navPrincipale');

boutonMenu.addEventListener('click', () => {
  const estOuvert = navPrincipale.classList.toggle('ouvert');
  boutonMenu.setAttribute('aria-expanded', estOuvert);
});

document.querySelectorAll('.lien-nav').forEach(lien => {
  lien.addEventListener('click', () => {
    navPrincipale.classList.remove('ouvert');
    boutonMenu.setAttribute('aria-expanded', 'false');
  });
});

// Comportement générique des menus déroulants (langue + thème)
function initMenuDeroulant(menuEl, boutonEl) {
  boutonEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const estOuvert = menuEl.classList.contains('ouvert');
    fermerTousLesMenus();
    if (!estOuvert) {
      menuEl.classList.add('ouvert');
      boutonEl.setAttribute('aria-expanded', 'true');
    }
  });
}

function fermerTousLesMenus() {
  document.querySelectorAll('.menu-deroulant').forEach(menu => {
    menu.classList.remove('ouvert');
    menu.querySelector('.bouton-controle')?.setAttribute('aria-expanded', 'false');
  });
}

document.addEventListener('click', fermerTousLesMenus);

const menuLangue = document.getElementById('menuLangue');
const menuTheme = document.getElementById('menuTheme');
initMenuDeroulant(menuLangue, document.getElementById('boutonLangue'));
initMenuDeroulant(menuTheme, document.getElementById('boutonTheme'));

// Sélecteur de langue — la traduction réelle du contenu
// est propre à chaque thème (voir theme-*.js), qui écoute
// l'événement "changementLangue" déclenché ici.
const langueActuelle = document.getElementById('langueActuelle');

document.querySelectorAll('[data-langue]').forEach(bouton => {
  bouton.addEventListener('click', () => {
    document.querySelectorAll('[data-langue]').forEach(b => b.classList.remove('active'));
    bouton.classList.add('active');
    langueActuelle.textContent = bouton.dataset.langue.toUpperCase();
    document.documentElement.lang = bouton.dataset.langue;
    document.dispatchEvent(new CustomEvent('changementLangue', { detail: { langue: bouton.dataset.langue } }));
  });
});

// Sélecteur de thème (Professionnel / Gaming / Style personnel)
// appliquerTheme() est réutilisée par le bouton "Essayer un
// autre thème" à l'intérieur de chaque thème (theme-*.js).
const themeActuel = document.getElementById('themeActuel');
const ordreThemes = ['professionnel', 'gaming', 'personnel'];

function appliquerTheme(choix) {
  document.querySelectorAll('[data-choix-theme]').forEach(b => {
    b.classList.toggle('active', b.dataset.choixTheme === choix);
  });
  document.body.dataset.theme = choix;
  document.dispatchEvent(new CustomEvent('changementTheme', { detail: { theme: choix } }));
}

document.querySelectorAll('[data-choix-theme]').forEach(bouton => {
  bouton.addEventListener('click', () => appliquerTheme(bouton.dataset.choixTheme));
});
