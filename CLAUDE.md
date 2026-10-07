# Portfolio de Dev Gninoue

Portfolio personnel multi-thèmes. Il représente Dev Gninoue personnellement (développeur full stack, créateur de jeux, monteur vidéo, entrepreneur).
Site statique en HTML/CSS/JS, sans framework applicatif ni étape de build.
Profil GitHub : https://github.com/gninoue-dev

## Règles impératives

- Tout le code est en français : noms de classes, ids, variables, fonctions, commentaires.
- Jamais d'émojis comme icônes. Utiliser Font Awesome ou une autre bibliothèque d'icônes (CDN).
- Pas de dégradés dans le thème Professionnel : couleurs pleines uniquement.
- Les bibliothèques sont autorisées via CDN quand elles apportent une vraie valeur (three.js, Phaser, GSAP, Howler.js, Lottie, particles, etc.). Pas de bundler, pas de `npm run build`.
- Ne jamais mélanger le code de plusieurs thèmes dans le même fichier.
- Aucun lien avec l'identité de GSG (Gninoue Studio Games) : ce portfolio représente Dev personnellement.
- Aucun personnage, logo ni asset protégé par droit d'auteur (anime, jeux, marques). S'inspirer des esthétiques, créer des éléments originaux.
- Si une information personnelle manque, ne jamais l'inventer : mettre un espace réservé et ajouter la question dans `QUESTIONS.md`.

## Structure

```
index.html          # Point d'entrée unique
css/
  commun.css        # Header, footer, variables partagées, utilitaires
  theme-professionnel.css
  theme-gaming.css
  theme-personnel.css
js/
  commun.js         # Header, sélecteur de thème, sélecteur de langue (FR/EN), i18n
  theme-professionnel.js
  theme-gaming.js
  theme-personnel.js
res/                # Images, CV PDF, assets
RESSOURCES.md       # Assets manquants à fournir
QUESTIONS.md        # Questions personnelles pour Dev
NOTES.md            # Décisions prises par Claude
RAPPORT.md          # Bilan final
```

Le thème Gaming peut ajouter des sous-dossiers (`js/gaming/`, `res/gaming/`) si le jeu devient gros, tant qu'ils restent propres au thème.

## Architecture des thèmes

- Le header (logo "Dev Gninoue", liens À propos / Compétences / Projets / Me contacter, sélecteur de langue, sélecteur de thème) est la base commune.
- Chaque thème redéfinit le style, et si besoin la structure, du reste du site.
- Thème par défaut : Professionnel.
- Le changement de thème charge uniquement les fichiers du thème choisi.
- Une modification d'un thème ne doit jamais casser les deux autres : tester les trois avant de conclure.

## Thèmes

### Professionnel (défaut)
- Dev l'a déjà commencé : l'améliorer, ne pas le refaire de zéro. Garder son contenu, sa structure et ce qui fonctionne (formulaire de contact, i18n, particules, bulle WhatsApp).
- Palette bleu/blanc, couleurs pleines, header bleu nuit translucide avec effet verre/flou au scroll.
- Ordre des sections : Header, Présentation (hero avec photo/avatar + badges), À propos de moi, Mes compétences, Mes projets réalisés, Me contacter, bloc "Essayer un autre thème", Footer.
- Objectif : professionnel, accrocheur, impressionnant pour les recruteurs.

### Gaming
- Carte blanche totale : ce thème est un vrai jeu jouable qui reflète la passion de Dev pour le jeu vidéo.
- Il doit être vraiment nouveau, très joli, avec un effet "wouah" dès les premières secondes.
- Le contenu du portfolio (à propos, compétences, projets, contact) est intégré dans le gameplay.
- Obligatoire : un bouton "Passer le jeu / Mode lecture" pour accéder directement au contenu, jouable souris + clavier + tactile mobile, fluide (60 fps visés), respect de `prefers-reduced-motion`, sons coupés par défaut.
- Les anciennes pistes (HUD, écran de sélection de personnage, emblèmes 3D, vert phosphore) sont de l'inspiration, pas une contrainte.

### Style personnel
- Mélange d'otaku, de gaming et de technologie : esthétique manga/anime, pixel art, cyberpunk, interfaces futuristes, kanji décoratifs, etc. Tout doit rester original.
- Claude peut utiliser les bibliothèques et ressources libres de son choix (polices, icônes, animations, shaders).
- Pour tout ce qui est vraiment personnel (animes préférés, goûts, anecdotes, texte "à propos" intime), ne pas inventer : écrire la question dans `QUESTIONS.md` et mettre un espace réservé.

## Langues (i18n)

- FR (par défaut) et EN.
- Aucun texte visible en dur dans le HTML ou le JS des thèmes : tout passe par le système de traduction dans `commun.js`.
- Toute nouvelle chaîne existe en FR et en EN.

## Conventions de code

- Indentation : 2 espaces.
- Classes CSS en kebab-case français (`carte-projet`, `barre-competence`).
- Variables et fonctions JS en camelCase français (`changerTheme`, `listeProjets`).
- Variables CSS pour les couleurs et espacements, en tête de chaque fichier de thème.
- Responsive : tester 360 px, 768 px, 1280 px et plus.
- HTML sémantique, `alt` sur les images, bon contraste.
- Performance : charger paresseusement ce qui est lourd (three.js, Phaser, sons) uniquement quand le thème concerné est actif.

## Travailler sur le projet

- Pas de build. Serveur local : `python3 -m http.server 8000`.
- Aucune erreur dans la console avant de conclure.
- Git : un commit par changement logique, messages en français. Commit avant toute grosse modification.
- Ne jamais supprimer ni renommer un fichier de `res/`.

## Façon de travailler

- Dev n'est pas disponible pendant l'exécution : ne pas poser de questions bloquantes.
- Décision ambiguë : choisir la meilleure option et la noter dans `NOTES.md`.
- Question personnelle : l'écrire dans `QUESTIONS.md`, continuer avec un espace réservé.
- Asset manquant : espace réservé propre et ajout dans `RESSOURCES.md`.
- Viser le maximum de qualité : utiliser toutes les connaissances disponibles en design, animation, jeu vidéo, accessibilité et performance.
