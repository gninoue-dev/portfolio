# Noms exacts des ressources

Pour chaque fichier, il y a deux étapes :
1. Le déposer avec **exactement** ce nom, dans ce dossier.
2. Copier la ligne indiquée dans `js/donnees.js` : chaque emplacement y est déjà prévu en commentaire, il suffit de remplacer `''` par le chemin.

Tant qu'une ligne n'est pas remplie, le site affiche un espace réservé, jamais un lien cassé.

## CV

| Fichier | Dossier | Ligne à écrire dans `js/donnees.js` |
|---|---|---|
| `cv-gninoue-jean-marc.pdf` | `res/` | `cv: 'res/cv-gninoue-jean-marc.pdf',` |

Une fois cette ligne remplie, tous les boutons "Demander mon CV" deviennent "Télécharger mon CV (PDF)" dans les 3 thèmes.

## Captures des projets

Format : WebP (ou JPG en changeant l'extension), 1280 x 720 px, moins de 200 Ko.
Il faut d'abord créer le dossier `res/projets/`.

| Projet | Fichier | Ligne à écrire (champ `image` du projet) |
|---|---|---|
| Projet web de fin de module | `res/projets/projet-web.webp` | `image: 'res/projets/projet-web.webp',` |
| Zaomon | `res/projets/zaomon.webp` | `image: 'res/projets/zaomon.webp',` |
| EditSensei AI | `res/projets/editsensei.webp` | `image: 'res/projets/editsensei.webp',` |
| ExamSecure | `res/projets/examsecure.webp` | `image: 'res/projets/examsecure.webp',` |
| Bot de trading | `res/projets/bot-trading.webp` | `image: 'res/projets/bot-trading.webp',` |
| TP PRAD 1 | `res/projets/prad1.webp` | `image: 'res/projets/prad1.webp',` |
| FocusFlow | `res/projets/focusflow.webp` | `image: 'res/projets/focusflow.webp',` |
| GameRpg | `res/projets/gamerpg.webp` | `image: 'res/projets/gamerpg.webp',` |
| gameSnake | `res/projets/snake.webp` | `image: 'res/projets/snake.webp',` |

## Facultatif

| Fichier | Dossier | Où le brancher |
|---|---|---|
| `og-image.jpg` (1200 x 630 px) | `res/` | dans `index.html`, balise `og:image` : remplacer `res/photo-profil-720.jpg` par `res/og-image.jpg` |

## Liens à compléter plus tard (même fichier `js/donnees.js`)

| Quoi | Ligne à écrire |
|---|---|
| LinkedIn | `linkedin: 'https://www.linkedin.com/in/ton-profil',` |
| TikTok | `tiktok: 'https://www.tiktok.com/@ton-pseudo',` |
| Code d'ExamSecure (une fois sur GitHub) | `lienCode: 'https://github.com/gninoue-dev/...',` puis supprimer la ligne `codeBientot: true,` |
| Code de TP PRAD 1 (une fois sur GitHub) | idem |

Conversion d'une capture au bon format :
`convert capture.png -resize 1280x720^ -gravity center -extent 1280x720 -quality 80 res/projets/zaomon.webp`
