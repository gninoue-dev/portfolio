// ============================================
// SOURCE DE DONNÉES UNIQUE
// Contenu partagé par les 3 thèmes : profil, liens,
// compétences, projets. Aucun thème ne duplique ces infos.
// Les textes traduisibles sont des objets { fr, en }.
// Une valeur vide ('') = information manquante : le site
// affiche un espace réservé (voir QUESTIONS.md / RESSOURCES.md).
// ============================================
const donnees = {
  profil: {
    nomComplet: 'Gninoue Jean-Marc',
    prenom: 'Jean-Marc',
    pseudo: 'Dev Gninoue',
    pseudoJeu: 'OZEN', // pseudo en jeu et en montage vidéo
    photo: 'res/photo-profil-720.jpg',
    photoWebp: 'res/photo-profil-720.webp',
    langageFavori: 'C++',
    // Les années d'expérience se calculent depuis cette année de début
    anneeDebut: 2024,
    ville: { fr: "Abidjan, Côte d'Ivoire", en: 'Abidjan, Ivory Coast' },
    personnalite: {
      fr: "Je suis quelqu'un qui aime apprendre et découvrir de nouvelles choses : en bref, un curieux.",
      en: 'I love learning and discovering new things: in short, a curious mind.'
    },
    citation: {
      fr: "La vie est comme un MMORPG : amasse plein de skills et tu n'en seras pas déçu.",
      en: "Life is like an MMORPG: stack up plenty of skills and you won't be disappointed."
    },
    animesFavoris: [
      { fr: "L'Attaque des Titans", en: 'Attack on Titan' },
      'Hajime no Ippo', 'Re:Zero', 'Monster', 'Death Note', 'Erased'
    ],
    jeuxFavoris: [
      'Watch Dogs', 'GTA San Andreas',
      { fr: 'God of War (I à III)', en: 'God of War (I to III)' }
    ],
    personnagesTekken: ['Bob', 'Nina'],
    idole: { fr: 'Kylian Mbappé (football)', en: 'Kylian Mbappé (football)' }
  },

  liens: {
    email: 'devgninoue@gmail.com',
    whatsapp: '2250103508128',
    whatsappAffiche: '+225 01 03 50 81 28',
    github: 'https://github.com/gninoue-dev',
    // ---------- Réseaux : coller l'adresse entre les guillemets ----------
    // Un réseau vide n'est pas affiché ; rempli, son icône apparaît dans le footer.
    linkedin: '', // ex. 'https://www.linkedin.com/in/ton-profil'
    tiktok: '', // ex. 'https://www.tiktok.com/@ton-pseudo'
    facebook: '',
    instagram: '',
    // ---------- CV ----------
    // Déposer le PDF dans res/ puis écrire : cv: 'res/cv-gninoue-jean-marc.pdf'
    // Le bouton passe alors de "Demander mon CV" à "Télécharger mon CV" partout.
    cv: '',
    // Point d'accès du formulaire de contact (FormSubmit, en AJAX)
    formulaire: 'https://formsubmit.co/ajax/Devgninoue@gmail.com'
  },

  // ---------- Ajouter une compétence ----------
  // Une ligne suffit : elle apparaît dans les 3 thèmes (et devient une
  // orbe de plus dans le jeu). Icônes : https://fontawesome.com/search?o=r&m=free
  // categorie : web | logiciel | jeu | creation | outil
  // niveau : debutant | intermediaire | expert
  competences: [
    { nom: 'HTML', icone: 'fa-brands fa-html5', niveau: 'expert', categorie: 'web' },
    { nom: 'CSS', icone: 'fa-brands fa-css3-alt', niveau: 'intermediaire', categorie: 'web' },
    { nom: 'JavaScript', icone: 'fa-brands fa-js', niveau: 'intermediaire', categorie: 'web' },
    { nom: 'React', icone: 'fa-brands fa-react', niveau: 'debutant', categorie: 'web' },
    { nom: 'PHP', icone: 'fa-brands fa-php', niveau: 'debutant', categorie: 'web' },
    { nom: 'Laravel', icone: 'fa-brands fa-laravel', niveau: 'debutant', categorie: 'web' },
    { nom: 'MySQL / SQL', icone: 'fa-solid fa-database', niveau: 'intermediaire', categorie: 'web' },
    { nom: 'C', icone: 'fa-solid fa-code', niveau: 'intermediaire', categorie: 'logiciel' },
    { nom: 'C++', icone: 'fa-solid fa-code', niveau: 'intermediaire', categorie: 'logiciel' },
    { nom: 'Python', icone: 'fa-brands fa-python', niveau: 'debutant', categorie: 'logiciel' },
    { nom: 'Kotlin', icone: 'fa-solid fa-mobile-screen-button', niveau: 'debutant', categorie: 'logiciel' },
    { nom: 'GDScript', icone: 'fa-solid fa-gamepad', niveau: 'debutant', categorie: 'jeu' },
    { nom: 'Blender', icone: 'fa-solid fa-cube', niveau: 'debutant', categorie: 'jeu' },
    { nom: 'After Effects', icone: 'fa-solid fa-film', niveau: 'intermediaire', categorie: 'creation' },
    { nom: 'Photoshop', icone: 'fa-solid fa-image', niveau: 'intermediaire', categorie: 'creation' },
    { nom: 'Figma', icone: 'fa-brands fa-figma', niveau: 'intermediaire', categorie: 'creation' },
    { nom: 'Git / GitHub', icone: 'fa-brands fa-github', niveau: 'intermediaire', categorie: 'outil' }
  ],

  // statut : termine | encours
  // categorie : jeu | web | ia | outil
  // nom : texte simple ou { fr, en }
  // codeBientot : true si le code sera publié plus tard (au lieu de "Code privé")
  // vedette : true pour le projet phare (affiché en premier, avec un badge)
  // image : '' tant que la capture n'est pas fournie (RESSOURCES.md)
  projets: [
    {
      id: 'projet-web',
      nom: { fr: 'Projet web de fin de module', en: 'End-of-module web project' },
      description: {
        fr: 'Mon projet phare : le projet de fin de module de développement web et mobile, en licence 2.',
        en: 'My flagship project: the end-of-module web and mobile development project, second year of bachelor.'
      },
      technos: ['JavaScript'],
      categorie: 'web',
      image: '', // capture : 'res/projets/projet-web.webp'
      lienCode: 'https://github.com/gninoue-dev/projet_web_fin_module',
      lienDemo: '',
      statut: 'encours',
      vedette: true
    },
    {
      id: 'zaomon',
      nom: 'Zaomon',
      description: {
        fr: "Jeu d'action-plateforme en cours de développement : combos à trois coups et sprites pixel art retravaillés. L'histoire reste secrète jusqu'à la sortie.",
        en: 'Action platformer in development: three-hit combos and reworked pixel art sprites. The story stays secret until release.'
      },
      technos: ['Godot 4', 'GDScript', 'Blender'],
      categorie: 'jeu',
      image: '', // capture : 'res/projets/zaomon.webp'
      lienCode: 'https://github.com/gninoue-dev/ZAOMON',
      lienDemo: '',
      statut: 'encours'
    },
    {
      id: 'editsensei',
      nom: 'EditSensei AI',
      description: {
        fr: "Assistant IA pour Adobe After Effects : on décrit le montage en langage naturel, l'IA le traduit en actions dans le logiciel et dialogue avec le monteur pendant l'édition.",
        en: 'AI assistant for Adobe After Effects: describe the edit in plain language, the AI turns it into actions inside the software and talks with the editor while editing.'
      },
      technos: ['Python', 'FastAPI', 'React', 'WebSocket', 'After Effects'],
      categorie: 'ia',
      image: '', // capture : 'res/projets/editsensei.webp'
      lienCode: 'https://github.com/gninoue-dev/EditSensei_AI',
      lienDemo: '',
      statut: 'encours'
    },
    {
      id: 'examsecure',
      nom: 'ExamSecure',
      description: {
        fr: "Plateforme anti-triche pour examens en ligne, avec reconnaissance faciale par webcam et backend PHP/PDO.",
        en: 'Anti-cheating platform for online exams, with webcam facial recognition and a PHP/PDO backend.'
      },
      technos: ['PHP', 'MySQL', 'JavaScript'],
      categorie: 'web',
      image: '', // capture : 'res/projets/examsecure.webp'
      lienCode: '', // encore en local : mettre l'URL GitHub ici une fois publié
      codeBientot: true,
      lienDemo: '',
      statut: 'encours'
    },
    {
      id: 'bot-trading',
      nom: { fr: 'Bot de trading', en: 'Trading bot' },
      description: {
        fr: "Robot de day trading en Python, spécialisé sur l'or (XAUUSD) : détection de figures chartistes et de niveaux de Fibonacci, gestion du risque et backtests.",
        en: 'Python day-trading bot focused on gold (XAUUSD): chart pattern and Fibonacci level detection, risk management and backtesting.'
      },
      technos: ['Python', 'MetaTrader 5'],
      categorie: 'outil',
      image: '', // capture : 'res/projets/bot-trading.webp'
      lienCode: 'https://github.com/gninoue-dev/Bot_trading',
      lienDemo: '',
      statut: 'encours'
    },
    {
      id: 'prad1',
      nom: 'TP PRAD 1',
      description: {
        fr: "Jeu de devinette client-serveur, des sockets TCP en Python jusqu'à un serveur C++ avec un WebSocket écrit à la main.",
        en: 'Client-server guessing game, from Python TCP sockets to a C++ server with a hand-written WebSocket.'
      },
      technos: ['Python', 'C++', 'WebSocket'],
      categorie: 'outil',
      image: '', // capture : 'res/projets/prad1.webp'
      lienCode: '', // encore en local : mettre l'URL GitHub ici une fois publié
      codeBientot: true,
      lienDemo: '',
      statut: 'termine'
    },
    {
      id: 'focusflow',
      nom: 'FocusFlow',
      description: {
        fr: 'Mini-application de gestion du temps et des priorités.',
        en: 'Small time and priority management application.'
      },
      technos: ['Java'],
      categorie: 'outil',
      image: '', // capture : 'res/projets/focusflow.webp'
      lienCode: 'https://github.com/gninoue-dev/FocusFlow',
      lienDemo: '',
      statut: 'encours'
    },
    {
      id: 'gamerpg',
      nom: 'GameRpg',
      description: {
        fr: 'Mini jeu de survie en JavaScript, jouable dans le navigateur.',
        en: 'Small survival game in JavaScript, playable in the browser.'
      },
      technos: ['JavaScript', 'Canvas'],
      categorie: 'jeu',
      image: '', // capture : 'res/projets/gamerpg.webp'
      lienCode: 'https://github.com/gninoue-dev/GameRpg',
      lienDemo: 'https://gninoue-dev.github.io/GameRpg/',
      statut: 'termine'
    },
    {
      id: 'snake',
      nom: 'gameSnake',
      description: {
        fr: 'Le jeu du serpent, réalisé pour le plaisir et pour progresser en JavaScript.',
        en: 'The classic snake game, built for fun and to level up in JavaScript.'
      },
      technos: ['JavaScript'],
      categorie: 'jeu',
      image: '', // capture : 'res/projets/snake.webp'
      lienCode: 'https://github.com/gninoue-dev/gameSnake',
      lienDemo: 'https://gninoue-dev.github.io/gameSnake/',
      statut: 'termine'
    }
  ]
};
