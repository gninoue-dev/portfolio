// ============================================
// Dictionnaire de traduction FR / EN
// ============================================
const traductions = {
  fr: {
    "nav.accueil": "Accueil",
    "nav.apropos": "À propos",
    "nav.competences": "Compétences",
    "nav.projets": "Projets",
    "nav.contact": "Me contacter",
    "theme.professionnel": "Professionnel",
    "theme.gaming": "Gaming",
    "theme.personnel": "Style personnel",
    "accueil.salutation": "Bienvenue sur mon portfolio",
    "accueil.jesuis": "Je suis",
    "accueil.role": "Développeur <span class=\"role-accent\">Full Stack</span> Junior",
    "accueil.langage": "Langage favori :",
    "accueil.bouton-projets": "Voir mes projets",
    "badge.experience": "Ans d'expérience",
    "badge.projets": "Projets réalisés",
    "apropos.titre": "À propos de moi",
    "apropos.role": "Dev. Full Stack<br>Junior",
    "apropos.p1": "Passionné par l'informatique et les jeux vidéo depuis l'enfance, j'ai naturellement choisi de transformer cette passion en véritable projet professionnel. Après l'obtention de mon baccalauréat, j'ai intégré la filière Informatique et Génie Logiciel, domaine dans lequel je poursuis actuellement ma deuxième année de licence.",
    "apropos.p2": "En tant que développeur Full Stack junior, je conçois et développe des sites web, applications, bases de données, de la conception à la mise en production. J'aime transformer des idées en solutions concrètes, fonctionnelles et intuitives.",
    "apropos.p3": "Au-delà du développement, je m'intéresse également à d'autres domaines tels que le graphisme, la modélisation 3D, le montage vidéo et la maintenance informatique. Ces compétences, que je développe en complément de mes connaissances en programmation, me permettent de créer des projets plus complets en associant la technologie, la créativité et la technique.",
    "competences.titre": "Mes compétences",
    "competences.niveau": "Niveau :",
    "niveau.debutant": "Débutant",
    "niveau.intermediaire": "Intermédiaire",
    "niveau.expert": "Expert",
    "projets.titre": "Mes projets",
    "projets.code": "Code",
    "projets.demo": "Démo",
    "projets.telecharger": "Télécharger",
    "projets.termine": "Terminé",
    "projets.encours": "En cours",
    "contact.titre": "Me contacter",
    "contact.dispo": "Disponible pour des stages, des entretiens, des projets freelance.",
    "contact.formulaire-titre": "M'envoyer un email",
    "contact.label-nom": "Nom",
    "contact.label-email": "Email",
    "contact.label-message": "Message",
    "contact.bouton-envoyer": "Envoyer le message",
    "contact.envoi-cours": "Envoi en cours...",
    "contact.succes": "Message envoyé avec succès, merci !",
    "contact.erreur": "Une erreur s'est produite, réessaie ou écris-moi directement par email.",
    "theme-bouton.changer": "Essayer un autre thème du portfolio",
    "footer.cv": "Télécharger mon CV",
    "footer.droits": "Tous droits réservés."
  },
  en: {
    "nav.accueil": "Home",
    "nav.apropos": "About",
    "nav.competences": "Skills",
    "nav.projets": "Projects",
    "nav.contact": "Contact me",
    "theme.professionnel": "Professional",
    "theme.gaming": "Gaming",
    "theme.personnel": "Personal Style",
    "accueil.salutation": "Welcome to my portfolio",
    "accueil.jesuis": "I am",
    "accueil.role": "Junior <span class=\"role-accent\">Full Stack</span> Developer",
    "accueil.langage": "Favorite language:",
    "accueil.bouton-projets": "View my projects",
    "badge.experience": "Years of experience",
    "badge.projets": "Completed projects",
    "apropos.titre": "About me",
    "apropos.role": "Junior Full Stack<br>Developer",
    "apropos.p1": "Passionate about technology and video games since childhood, I naturally turned that passion into a genuine professional path. After earning my high school diploma, I joined the Computer Science and Software Engineering program, where I'm currently in my second year of a bachelor's degree.",
    "apropos.p2": "As a junior Full Stack developer, I design and build websites, applications, and databases, from concept to deployment. I love turning ideas into concrete, functional, and intuitive solutions.",
    "apropos.p3": "Beyond development, I'm also interested in other areas such as graphic design, 3D modeling, video editing, and computer maintenance. These skills, which I develop alongside my programming knowledge, let me build more complete projects by combining technology, creativity, and technical skill.",
    "competences.titre": "My Skills",
    "competences.niveau": "Level:",
    "niveau.debutant": "Beginner",
    "niveau.intermediaire": "Intermediate",
    "niveau.expert": "Expert",
    "projets.titre": "My Projects",
    "projets.code": "Code",
    "projets.demo": "Demo",
    "projets.telecharger": "Download",
    "projets.termine": "Completed",
    "projets.encours": "In progress",
    "contact.titre": "Contact Me",
    "contact.dispo": "Available for internships, interviews, and freelance projects.",
    "contact.formulaire-titre": "Send Me an Email",
    "contact.label-nom": "Name",
    "contact.label-email": "Email",
    "contact.label-message": "Message",
    "contact.bouton-envoyer": "Send Message",
    "contact.envoi-cours": "Sending...",
    "contact.succes": "Message sent successfully, thank you!",
    "contact.erreur": "Something went wrong, please try again or email me directly.",
    "theme-bouton.changer": "Try another portfolio theme",
    "footer.cv": "Download my CV",
    "footer.droits": "All rights reserved."
  }
};

let langueCourante = 'fr';

// ============================================
// État du header au scroll
// ============================================
const entete = document.getElementById('enteteSite');
function majEtatEntete(){
  if(window.scrollY > 20){
    entete.classList.add('defile');
  } else {
    entete.classList.remove('defile');
  }
}
majEtatEntete();
window.addEventListener('scroll', majEtatEntete, { passive: true });

// ============================================
// Menu mobile
// ============================================
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

// ============================================
// Comportement générique des menus déroulants (langue + thème)
// ============================================
function initMenuDeroulant(menuEl, boutonEl){
  boutonEl.addEventListener('click', (e) => {
    e.stopPropagation();
    const estOuvert = menuEl.classList.contains('ouvert');
    fermerTousLesMenus();
    if(!estOuvert){
      menuEl.classList.add('ouvert');
      boutonEl.setAttribute('aria-expanded', 'true');
    }
  });
}

function fermerTousLesMenus(){
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

// ============================================
// Application de la langue sur toute la page
// ============================================
const langueActuelle = document.getElementById('langueActuelle');
const themeActuel = document.getElementById('themeActuel');

function appliquerLangue(langue){
  langueCourante = langue;
  const dico = traductions[langue];

  document.querySelectorAll('[data-i18n]').forEach(el => {
    const cle = el.dataset.i18n;
    if(dico[cle] !== undefined) el.textContent = dico[cle];
  });

  document.querySelectorAll('[data-i18n-html]').forEach(el => {
    const cle = el.dataset.i18nHtml;
    if(dico[cle] !== undefined) el.innerHTML = dico[cle];
  });

  document.documentElement.lang = langue;
  langueActuelle.textContent = langue.toUpperCase();

  const themeCourant = document.body.dataset.theme || 'professionnel';
  themeActuel.textContent = dico[`theme.${themeCourant}`];

  rendreCompetences();
  rendreProjets();
}

document.querySelectorAll('[data-langue]').forEach(bouton => {
  bouton.addEventListener('click', () => {
    document.querySelectorAll('[data-langue]').forEach(b => b.classList.remove('active'));
    bouton.classList.add('active');
    appliquerLangue(bouton.dataset.langue);
  });
});

// ============================================
// Sélection du thème (Professionnel / Gaming / Style personnel)
// ============================================
const ordreThemes = ['professionnel', 'gaming', 'personnel'];

function appliquerTheme(choix){
  document.querySelectorAll('[data-choix-theme]').forEach(b => {
    b.classList.toggle('active', b.dataset.choixTheme === choix);
  });
  themeActuel.textContent = traductions[langueCourante][`theme.${choix}`];
  document.body.dataset.theme = choix;
}

document.querySelectorAll('[data-choix-theme]').forEach(bouton => {
  bouton.addEventListener('click', () => appliquerTheme(bouton.dataset.choixTheme));
});

// ============================================
// Bouton "Essayer un autre thème du portfolio"
// ============================================
const boutonChangerTheme = document.getElementById('boutonChangerTheme');
boutonChangerTheme.addEventListener('click', () => {
  const indexActuel = ordreThemes.indexOf(document.body.dataset.theme || 'professionnel');
  const prochainTheme = ordreThemes[(indexActuel + 1) % ordreThemes.length];
  appliquerTheme(prochainTheme);
});

// ============================================
// Animation des compteurs (badges expérience / projets)
// ============================================
const compteurs = document.querySelectorAll('[data-compteur]');

function animerCompteur(element){
  const cible = parseInt(element.dataset.compteur, 10);
  let actuel = 0;
  const duree = 1200;
  const etapeTemps = 16;
  const increment = cible / (duree / etapeTemps);

  const intervalle = setInterval(() => {
    actuel += increment;
    if(actuel >= cible){
      element.textContent = cible;
      clearInterval(intervalle);
    } else {
      element.textContent = Math.floor(actuel);
    }
  }, etapeTemps);
}

const observateurCompteurs = new IntersectionObserver((entrees) => {
  entrees.forEach(entree => {
    if(entree.isIntersecting){
      animerCompteur(entree.target);
      observateurCompteurs.unobserve(entree.target);
    }
  });
}, { threshold: 0.5 });

compteurs.forEach(compteur => observateurCompteurs.observe(compteur));

// ============================================
// Section Compétences — génération des cartes (traduites)
// ============================================
const competences = [
  { nom: "HTML",                icone: "fa-brands fa-html5",     niveau: "expert" },
  { nom: "CSS",                 icone: "fa-brands fa-css3-alt",  niveau: "intermediaire" },
  { nom: "JavaScript",          icone: "fa-brands fa-js",        niveau: "intermediaire" },
  { nom: "React",               icone: "fa-brands fa-react",     niveau: "debutant" },
  { nom: "Kotlin",              icone: "fa-solid fa-mobile-screen-button", niveau: "debutant" },
  { nom: "PHP",                 icone: "fa-brands fa-php",       niveau: "debutant" },
  { nom: "C",                   icone: "fa-solid fa-code",       niveau: "intermediaire" },
  { nom: "C++",                 icone: "fa-solid fa-code",       niveau: "intermediaire" },
  { nom: "GDScript",            icone: "fa-solid fa-gamepad",    niveau: "debutant" },
  { nom: "Blender",             icone: "fa-solid fa-cube",       niveau: "debutant" },
  { nom: "After Effects",       icone: "fa-brands fa-adobe",     niveau: "intermediaire" },
  { nom: "Photoshop",           icone: "fa-brands fa-adobe",     niveau: "intermediaire" },
  { nom: "Figma",                icone: "fa-brands fa-figma",     niveau: "intermediaire" },
  { nom: "Laravel",             icone: "fa-brands fa-laravel",   niveau: "debutant" },
  { nom: "MySQL / SQL",         icone: "fa-solid fa-database",   niveau: "intermediaire" },
  { nom: "Git / GitHub",        icone: "fa-brands fa-github",    niveau: "intermediaire" }
];

function creerCarteCompetence(competence, index){
  const dico = traductions[langueCourante];
  const carte = document.createElement('div');
  carte.className = 'carte-competence';
  carte.dataset.niveau = competence.niveau;
  carte.style.setProperty('--delai-flotte', `${(index % 4) * 0.4}s`);

  const estImage = /\.(svg|png|jpg|jpeg)$/i.test(competence.icone || "");
  const iconeHtml = estImage
    ? `<img src="${competence.icone}" alt="${competence.nom}" class="competence-logo">`
    : `<i class="${competence.icone || 'fa-solid fa-star'}"></i>`;

  const ordreNiveaux = ['debutant', 'intermediaire', 'expert'];
  const niveauxHtml = ordreNiveaux.map(valeur => `
    <li class="niveau-option" data-valeur="${valeur}">
      <span class="puce"></span>${dico[`niveau.${valeur}`]}
    </li>
  `).join('');

  carte.innerHTML = `
    <div class="competence-icone">${iconeHtml}</div>
    <h4 class="competence-nom">${competence.nom}</h4>
    <p class="competence-etiquette">${dico['competences.niveau']}</p>
    <ul class="niveau-liste">${niveauxHtml}</ul>
  `;
  return carte;
}

const grilleCompetences = document.getElementById('grilleCompetences');

function rendreCompetences(){
  grilleCompetences.innerHTML = '';
  competences.forEach((competence, index) => {
    grilleCompetences.appendChild(creerCarteCompetence(competence, index));
  });
}

// ============================================
// Section Projets — génération des cartes (traduites)
// ============================================
const projets = [
  {
    nom: "Zaomon",
    description: "Jeu d'action 2D avec système de combos à 3 coups et sprites pixel art retravaillés.",
    descriptionEn: "2D action game featuring a 3-hit combo system and reworked pixel art sprites.",
    technos: ["Godot 4", "GDScript", "Blender"],
    image: "res/projets/zaomon.jpg",
    lienCode: "https://github.com/gninoue-dev/ZAOMON",
    statut: "encours"
  },
  {
    nom: "ExamSecure",
    description: "Plateforme anti-triche pour examens avec reconnaissance faciale via webcam et backend PDO.",
    descriptionEn: "Anti-cheating platform for exams with webcam-based facial recognition and a PDO backend.",
    technos: ["PHP", "MySQL", "JavaScript"],
    image: "res/projets/examsecure.jpg",
    lienCode: "#",
    statut: "encours"
  },
  {
    nom: "TP PRAD 1",
    description: "Jeu de devinette client-serveur, des sockets TCP Python jusqu'à un serveur C++ avec WebSocket fait main.",
    descriptionEn: "Client-server guessing game, from Python TCP sockets to a C++ server with a hand-built WebSocket.",
    technos: ["Python", "C++", "WebSocket"],
    image: "res/projets/prad1.jpg",
    lienCode: "#",
    statut: "termine"
  },
  {
    nom: "Bot-Ozen-MD-panel",
    description: "Bot ludique pensé pour tourner sur de petits hébergeurs comme Katabump.",
    descriptionEn: "A fun bot designed to run on small hosting panels like Katabump.",
    technos: ["JavaScript"],
    image: "res/projets/bot-ozen-md-panel.jpg",
    lienCode: "https://github.com/gninoue-dev/Bot-Ozen-MD-panel",
    statut: "termine"
  },
  {
    nom: "FocusFlow",
    description: "Mini-application de gestion du temps et des priorités.",
    descriptionEn: "Mini time-management and task-priority application.",
    technos: ["Java"],
    image: "res/projets/focusflow.jpg",
    lienCode: "https://github.com/gninoue-dev/FocusFlow",
    statut: "encours"
  },
  {
    nom: "EditSensei_AI",
    description: "IA capable de créer des montages vidéo et d'interagir avec l'utilisateur pendant le montage — un assistant qui aide à monter et éditer des vidéos.",
    descriptionEn: "AI capable of creating video edits and interacting with the user during editing — an assistant that helps cut and edit videos.",
    technos: ["Intelligence artificielle"],
    image: "res/projets/editsensei-ai.jpg",
    lienCode: "https://github.com/gninoue-dev/EditSensei_AI",
    statut: "encours"
  },
  {
    nom: "Projet Web Fin de Module",
    description: "Projet de fin de module développement web/mobile, licence 2.",
    descriptionEn: "End-of-module project for web/mobile development, 2nd year of bachelor's degree.",
    technos: ["JavaScript"],
    image: "res/projets/projet-web-fin-module.jpg",
    lienCode: "#",
    statut: "encours"
  },
  {
    nom: "GameRpg",
    description: "Mini jeu de survie en JavaScript.",
    descriptionEn: "Small JavaScript survival game.",
    technos: ["JavaScript"],
    image: "res/projets/gamerpg.jpg",
    lienCode: "https://github.com/gninoue-dev/GameRpg",
    lienDemo: "https://gninoue-dev.github.io/GameRpg/",
    statut: "termine"
  },
  {
    nom: "gameSnake",
    description: "Le jeu du serpent, réalisé pour le fun et pour apprendre le JavaScript.",
    descriptionEn: "The classic snake game, built for fun and to learn JavaScript.",
    technos: ["JavaScript"],
    image: "res/projets/gamesnake.jpg",
    lienCode: "https://github.com/gninoue-dev/gameSnake",
    lienDemo: "https://gninoue-dev.github.io/gameSnake/",
    statut: "termine"
  }
];

function creerCarteProjet(projet){
  const dico = traductions[langueCourante];
  const carte = document.createElement('div');
  carte.className = 'carte-projet';

  const technosHtml = projet.technos.map(t => `<span class="etiquette-tech">${t}</span>`).join('');
  const description = langueCourante === 'en' ? (projet.descriptionEn || projet.description) : projet.description;
  const libelleStatut = projet.statut === 'termine' ? dico['projets.termine'] : dico['projets.encours'];

  let boutonDemo = '';
  if(projet.lienDemo){
    boutonDemo = `<a href="${projet.lienDemo}" target="_blank" rel="noopener" class="lien-projet lien-demo">
      <i class="fa-solid fa-arrow-up-right-from-square"></i> ${dico['projets.demo']}
    </a>`;
  } else if(projet.lienTelechargement){
    boutonDemo = `<a href="${projet.lienTelechargement}" download class="lien-projet lien-telechargement">
      <i class="fa-solid fa-download"></i> ${dico['projets.telecharger']}
    </a>`;
  }

  carte.innerHTML = `
    <div class="projet-image">
      <img src="${projet.image}" alt="${projet.nom}" loading="lazy">
      <span class="badge-statut badge-${projet.statut}">${libelleStatut}</span>
    </div>
    <div class="projet-contenu">
      <h4 class="projet-nom">${projet.nom}</h4>
      <p class="projet-description">${description}</p>
      <div class="projet-technos">${technosHtml}</div>
      <div class="projet-liens">
        <a href="${projet.lienCode}" target="_blank" rel="noopener" class="lien-projet lien-code"><i class="fa-brands fa-github"></i> ${dico['projets.code']}</a>
        ${boutonDemo}
      </div>
    </div>
  `;
  return carte;
}

const grilleProjets = document.getElementById('grilleProjets');

function rendreProjets(){
  grilleProjets.innerHTML = '';
  projets.forEach(projet => grilleProjets.appendChild(creerCarteProjet(projet)));
}

// Premier rendu, langue française propre appliquée dès le chargement
appliquerLangue('fr');

// ============================================
// Formulaire de contact (via FormSubmit, en AJAX)
// ============================================
const formulaireContact = document.getElementById('formulaireContact');
const statutEnvoi = document.getElementById('statutEnvoi');
const boutonEnvoyer = document.getElementById('boutonEnvoyer');

formulaireContact.addEventListener('submit', async (e) => {
  e.preventDefault();
  const dico = traductions[langueCourante];

  boutonEnvoyer.disabled = true;
  boutonEnvoyer.innerHTML = dico['contact.envoi-cours'];
  statutEnvoi.textContent = '';
  statutEnvoi.className = 'statut-envoi';

  const donnees = new FormData(formulaireContact);

  try {
    const reponse = await fetch('https://formsubmit.co/ajax/Devgninoue@gmail.com', {
      method: 'POST',
      headers: { 'Accept': 'application/json' },
      body: donnees
    });

    if(reponse.ok){
      statutEnvoi.textContent = dico['contact.succes'];
      statutEnvoi.classList.add('succes');
      formulaireContact.reset();
    } else {
      throw new Error('Échec de l\'envoi');
    }
  } catch (erreur){
    statutEnvoi.textContent = dico['contact.erreur'];
    statutEnvoi.classList.add('erreur');
  } finally {
    boutonEnvoyer.disabled = false;
    boutonEnvoyer.innerHTML = `<i class="fa-solid fa-paper-plane"></i> ${dico['contact.bouton-envoyer']}`;
  }
});

// ============================================
// Année courante dans le footer
// ============================================
const anneeCourante = document.getElementById('anneeCourante');
if(anneeCourante){
  anneeCourante.textContent = new Date().getFullYear();
}