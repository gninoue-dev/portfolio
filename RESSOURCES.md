# Ressources à fournir

Liste courte des noms exacts à utiliser : voir `NOMS_RESSOURCES.md`.

Tant qu'un fichier manque, le site affiche un espace réservé propre (jamais de lien cassé).
Après avoir déposé un fichier, renseigner le chemin indiqué dans `js/donnees.js`.

## Priorité haute

| Ressource | Fichier attendu | Dossier | Format | Taille recommandée | À renseigner dans `js/donnees.js` |
|---|---|---|---|---|---|
| CV | `cv-gninoue-jean-marc.pdf` | `res/` | PDF | moins de 1 Mo, A4 | `liens.cv: 'res/cv-gninoue-jean-marc.pdf'` |
| Capture Zaomon | `zaomon.webp` | `res/projets/` | WebP (ou JPG) | 1280 x 720 px (16:9), moins de 200 Ko | `image: 'res/projets/zaomon.webp'` du projet `zaomon` |
| Capture EditSensei AI | `editsensei.webp` | `res/projets/` | WebP | 1280 x 720 px, moins de 200 Ko | projet `editsensei` |
| Capture ExamSecure | `examsecure.webp` | `res/projets/` | WebP | 1280 x 720 px, moins de 200 Ko | projet `examsecure` |
| Capture Bot de trading | `bot-trading.webp` | `res/projets/` | WebP | 1280 x 720 px (graphique de backtest par exemple) | projet `bot-trading` |
| Capture GameRpg | `gamerpg.webp` | `res/projets/` | WebP | 1280 x 720 px | projet `gamerpg` |
| Capture gameSnake | `snake.webp` | `res/projets/` | WebP | 1280 x 720 px | projet `snake` |

## Priorité moyenne

| Ressource | Fichier attendu | Dossier | Format | Taille recommandée | Remarque |
|---|---|---|---|---|---|
| Capture TP PRAD 1 | `prad1.webp` | `res/projets/` | WebP | 1280 x 720 px | projet `prad1` |
| Capture FocusFlow | `focusflow.webp` | `res/projets/` | WebP | 1280 x 720 px | projet `focusflow` |
| Capture projet web de fin de module | `projet-web.webp` | `res/projets/` | WebP | 1280 x 720 px | projet `projet-web` |
| Image de partage (réseaux sociaux) | `og-image.jpg` | `res/` | JPG | 1200 x 630 px, moins de 300 Ko | remplacer `res/photo-profil-720.jpg` dans la balise `og:image` de `index.html` |

## Déjà présent

- `res/photo_Profil.jpg` : photo originale (2448 x 3264, 2,6 Mo), conservée telle quelle.
- `res/photo-profil-720.webp` (65 Ko) et `res/photo-profil-720.jpg` (82 Ko) : copies carrées optimisées, utilisées par les 3 thèmes.

## Conseils

- Conversion rapide en WebP : `convert capture.png -resize 1280x720^ -gravity center -extent 1280x720 -quality 80 res/projets/nom.webp`
- Les captures sont affichées en 16:9 (thème Professionnel). Les thèmes Gaming et Style personnel n'en ont pas besoin (visuels dessinés en code).
