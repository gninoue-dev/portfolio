# Notes de travail (Claude)

## 1. Audit de l'existant (7 octobre 2026)

### Ce qui existait au départ
- `index.html` : header complet (logo `<Dev.Gninoue|/>`, nav 01-04, menus déroulants langue et thème, menu burger mobile), sections du thème Professionnel écrites en dur (accueil, à propos, compétences, projets, contact, bouton "Essayer un autre thème"), footer, bulle WhatsApp.
- `css/commun.css` : variables, header verre/flou au scroll avec liseré lumineux, menus déroulants, boutons, footer, bulle WhatsApp avec anneau pulsé, fond animé à 8 particules CSS.
- `css/theme-professionnel.css` : hero avec photo ronde et badges flottants (compteurs), carte d'identité flottante avec reflet, cartes compétences en verre avec niveau débutant/intermédiaire/expert, cartes projets avec badge de statut, formulaire de contact.
- `js/commun.js` : header au scroll, menu mobile, menus déroulants, événements `changementLangue` et `changementTheme`.
- `js/theme-professionnel.js` : dictionnaire FR/EN, compteurs animés, rendu des compétences (16) et des projets (9), formulaire de contact AJAX via FormSubmit, année du footer.
- Thèmes Gaming et Style personnel : fichiers vides ("à construire").
- `res/photo_Profil.jpg` (2,6 Mo, 2448x3264).

### Défauts relevés
- `index.html` pointait vers `res/photo.jpg`, renommé en `res/photo_Profil.jpg` : photo cassée.
- Images de projets `res/projets/*.jpg` et CV `res/cv-gninoue-jean-marc.pdf` absents : images et lien cassés.
- Liens réseaux sociaux factices (`TON_PROFIL`, `TON_PSEUDO`).
- Les 4 CSS et les 4 JS étaient chargés quel que soit le thème.
- Contenu (projets, compétences) et traductions écrits dans le JS du thème Professionnel : impossible à partager.
- Langue et thème non mémorisés.
- Le texte HTML initial contenait des fautes ("choisir", "actuellment", "créér"...) corrigées seulement par le JS.
- Dégradés présents dans le thème Professionnel (liseré de la carte d'identité, reflets) : contraire à la règle "couleurs pleines".
- Photo de 2,6 Mo affichée en 340 px : très lourd.
- `body { min-height: 200vh }` : page artificiellement allongée.

### GitHub (https://github.com/gninoue-dev, 13 dépôts publics)
Dépôts retenus : ZAOMON, Bot-Ozen-MD-panel, Bot_trading, EditSensei_AI, FocusFlow, GameRpg (GitHub Pages), gameSnake (GitHub Pages), projet_web_fin_module.
Dépôts écartés : `etudiant`, `lasespada`, `projetweb` (pas de description exploitable), `portfolio` (ce site), `gninoue-dev` (README de profil).
Compétences du README de profil : HTML, CSS, JavaScript, PHP, C, C++, After Effects (toutes déjà présentes).
Les projets "ExamSecure" et "TP PRAD 1" ne sont pas publics sur GitHub : conservés sans lien de code (question ajoutée dans `QUESTIONS.md`).

## 2. Décisions

- Le dépôt Git du portfolio est `Portfolio/.git` (indépendant du dépôt parent) : tous les commits y sont faits.
- Copies optimisées de la photo ajoutées dans `res/` (`photo-profil-720.webp` 65 Ko et `.jpg` en secours) ; l'original n'est ni supprimé ni renommé.
- Le fond navy de Dev est conservé pour le thème Professionnel : "bleu/blanc" est lu comme bleu nuit + bleu + texte blanc, ce que Dev avait déjà posé.
