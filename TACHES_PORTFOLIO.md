# Mission : terminer le portfolio de A à Z, au maximum de qualité

Lis d'abord `CLAUDE.md` (règles du projet), puis exécute toutes les tâches ci-dessous dans l'ordre.
Objectif : un portfolio vraiment réussi, qui fait forte impression. Utilise toutes tes connaissances en design, animation, jeu vidéo, accessibilité et performance.

## Mode de travail (important)

- Dev n'est pas là pendant que tu travailles. Ne pose aucune question bloquante.
- Décision ambiguë : choisis la meilleure option et note-la dans `NOTES.md` (décision + raison, une ligne).
- Question personnelle (goûts, anecdotes, infos privées) : n'invente rien. Écris la question dans `QUESTIONS.md`, mets un espace réservé propre dans le site et continue.
- Asset manquant : espace réservé propre, jamais de lien cassé, et ajoute-le dans `RESSOURCES.md`.
- Commit Git après chaque tâche, message en français (ex. `Thème Gaming : niveau 1 jouable`).
- Ne supprime aucun fichier de `res/`. Ne casse rien de ce qui marche déjà.
- À la fin, écris `RAPPORT.md` : ce qui est fait, ce qui reste, les décisions prises.

## Tâche 1 : Audit et contenu réel

- Parcours le projet et liste dans `NOTES.md` ce qui existe déjà (thème Professionnel commencé, i18n, formulaire de contact, particules, bulle WhatsApp, etc.).
- Profil GitHub de Dev : https://github.com/gninoue-dev. Si tu as accès au réseau, consulte-le pour récupérer ses vrais projets (noms, descriptions, langages, liens) et alimenter la section Projets et les compétences. Sinon, utilise ce qui est déjà dans le projet.
- Vérifie que l'arborescence respecte `CLAUDE.md`. Corrige si besoin.

## Tâche 2 : Socle commun

- Header commun : logo "Dev Gninoue", liens (À propos, Compétences, Projets, Me contacter), sélecteur de langue FR/EN, sélecteur de thème (Professionnel / Gaming / Style personnel).
- Thème et langue mémorisés entre les visites (`localStorage` dans un `try/catch`).
- Seuls les fichiers du thème actif sont chargés. Le changement de thème est fluide et sans rechargement.
- Toutes les chaînes visibles passent par l'i18n, en FR et en EN.
- Une source de données unique pour le contenu (projets, compétences, liens) partagée par les 3 thèmes, pour ne jamais dupliquer le contenu.

## Tâche 3 : Améliorer le thème Professionnel

Dev l'a déjà commencé. Améliore-le, ne le refais pas de zéro.

- Garde sa structure, son contenu et ce qui fonctionne. Corrige les défauts, peaufine le design.
- Palette bleu/blanc, couleurs pleines (aucun dégradé), header bleu nuit translucide avec effet verre/flou au scroll.
- Améliore : typographie, espacements, hiérarchie visuelle, micro-animations, cartes de projets, hero, section compétences, responsive, accessibilité, performance.
- Ordre des sections : Header, Présentation, À propos de moi, Mes compétences, Mes projets réalisés, Me contacter, bloc "Essayer un autre thème", Footer.
- Objectif : professionnel, mais qui capte l'attention et impressionne les recruteurs.

## Tâche 4 : Thème Gaming = un vrai jeu jouable

Carte blanche totale. Dev veut un jeu qui reflète sa passion du jeu vidéo.

- Ce n'est pas un simple style visuel : c'est un jeu auquel on joue. Imagine un concept original, jamais vu sur un portfolio, très joli, avec un effet "wouah" dès les premières secondes.
- Le contenu du portfolio (à propos, compétences, projets, contact) doit être intégré au gameplay : on le découvre en jouant (zones, niveaux, objets, PNJ, boss, collectibles, succès, etc.).
- Tu choisis la technique : canvas 2D, three.js, Phaser, shaders, etc., via CDN. Choisis ce qui donne le meilleur résultat.
- Soigne le "game feel" : animations, particules, lumière, screenshake léger, transitions, musique et effets sonores optionnels (coupés par défaut), écran-titre mémorable, feedback à chaque action.
- Obligatoire :
  - bouton visible "Passer le jeu / Mode lecture" qui affiche directement le contenu (un recruteur pressé doit pouvoir tout lire),
  - contrôles souris + clavier + tactile mobile,
  - fluidité (viser 60 fps), chargement paresseux,
  - respect de `prefers-reduced-motion`,
  - bouton pour changer de thème toujours accessible.
- Si un jeu complet est trop gros, livre une version courte mais impeccable et finie (mieux vaut 5 minutes parfaites que 30 minutes bancales). Note dans `NOTES.md` les idées d'extension.
- Univers original, aucun lien avec GSG, aucun personnage ni asset protégé. Les vrais projets de jeu de Dev trouvés dans le projet ou sur GitHub peuvent inspirer l'univers.
- Dessine les graphismes toi-même (SVG, canvas, pixel art généré en code, shaders) ou avec des ressources libres de droits, avec crédits dans le footer ou `NOTES.md`.

## Tâche 5 : Thème Style personnel

Mélange d'otaku, de gaming et de technologie.

- Direction : esthétique manga/anime, pixel art, cyberpunk, interfaces futuristes (HUD, terminal, glitch), typographies japonaises décoratives, effets de page façon planches de manga, etc. Tout doit rester original : aucun personnage, logo ni illustration protégée.
- Utilise toutes les bibliothèques et ressources libres utiles (polices, icônes, animations GSAP, Lottie, shaders, etc.), avec crédits.
- Palette et ambiance clairement différentes des thèmes Professionnel et Gaming. Même contenu, mais mise en page et animations propres.
- Pour les éléments vraiment personnels (animes et jeux préférés, goûts, anecdotes, texte intime), ne pas inventer : écris les questions dans `QUESTIONS.md` avec un espace réservé dans le site. Exemples de questions : quels animes/mangas préfères-tu, quels jeux, quelle citation te représente, comment te décrirais-tu en 3 phrases.
- Explique ta direction créative en 5 lignes dans `NOTES.md`.

## Tâche 6 : Contenu et assets

- Utilise les vraies informations déjà présentes ou trouvées sur GitHub.
- `RESSOURCES.md` : liste précise des assets manquants (CV PDF, images de projets, photo, etc.) avec nom de fichier attendu, dossier, format et taille recommandés.
- `QUESTIONS.md` : toutes les questions personnelles, classées par thème, avec la réponse attendue (format court) pour que Dev n'ait qu'à répondre.

## Tâche 7 : Qualité et vérification

Avant de conclure, vérifie les 3 thèmes dans les 2 langues :

- Aucune erreur dans la console. Serveur local : `python3 -m http.server 8000`, test avec navigateur headless si disponible.
- Responsive : 360 px, 768 px, 1280 px et plus.
- Accessibilité : `alt`, contrastes, navigation clavier, HTML sémantique.
- Performance : pas de fichier inutile, images optimisées, bibliothèques lourdes chargées seulement quand leur thème est actif.
- Aucun émoji comme icône. Code entièrement en français.
- Jeu du thème Gaming : testé du début à la fin, sans blocage possible, mode lecture fonctionnel.

## Livrables attendus

- Portfolio complet avec les 3 thèmes
- `NOTES.md`, `RESSOURCES.md`, `QUESTIONS.md`, `RAPPORT.md`
- Historique Git propre, un commit par tâche
