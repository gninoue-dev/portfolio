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
- Socle : `js/donnees.js` (source unique : profil, liens, compétences, projets) et `js/traductions.js` (toutes les chaînes FR/EN) ont été ajoutés à côté de `commun.js`, qui garde le système de traduction (`t()`, `tr()`, attributs `data-i18n*`). Raison : un seul endroit pour le contenu, partagé par les 3 thèmes.
- Chaque thème s'enregistre via `enregistrerTheme(nom, { monter, demonter, changerLangue, allerA })` ; `commun.js` charge son CSS et son JS à la demande et désactive la feuille des autres thèmes.
- Paramètres d'URL `?theme=gaming&lang=en` acceptés (pratique pour partager un thème précis à un recruteur).
- Projets sans capture : visuel de remplacement dessiné (initiales + icône de catégorie) au lieu d'une image cassée. Projets sans dépôt public : mention "Code privé".
- Bouton CV : "Demander mon CV" (email pré-rempli) tant que `res/cv-gninoue-jean-marc.pdf` n'existe pas ; il suffit de renseigner `donnees.liens.cv`.
- Réseaux sociaux : seuls ceux dont l'URL est connue s'affichent (GitHub, email) ; les autres attendent une réponse dans `QUESTIONS.md`.
- Formulaire : FormSubmit conservé, avec champ piège `_honey` anti-spam et sujet pré-rempli.

## 3. Thème Gaming : "L'Île des Fragments"

Concept : une île plongée dans la nuit, explorée à la lanterne. Quatre fragments du portfolio rallument l'île peu à peu (l'obscurité diminue à chaque fragment) :
- Village des Mémoires (À propos) : l'Archiviste raconte l'histoire de Dev en dialogue.
- Forêt des Savoirs (Compétences) : 16 orbes lumineuses, une par compétence (nom + niveau).
- Ruines des Œuvres (Projets) : 10 stèles en cercle, chacune ouvre la fiche d'un projet avec ses liens.
- Cap du Phare (Contact) : un dôme de glitchs s'ouvre après 3 fragments ; le Grand Bug (boss) est vaincu en rechargeant 3 pylônes ; le phare s'allume, l'île s'éclaire, l'écran de fin propose de contacter Dev.

Technique : canvas 2D maison (pas de Phaser : plus léger et contrôle total), rendu en basse résolution agrandi en pixels nets, éclairage dynamique par calque d'obscurité découpé en `destination-out`, lumières colorées additives, particules, lucioles, secousses légères. Monde généré avec une graine fixe (même île à chaque visite), obstacles placés en damier pour garantir qu'aucun passage n'est jamais bloqué. Mesure : environ 5 ms par image en 1920 px sans GPU.
Graphismes et sons entièrement générés en code (aucun asset externe). Musique générative Web Audio, coupée par défaut.
Accessibilité : bouton "Passer le jeu / Mode lecture" toujours visible, liens du header qui ouvrent le mode lecture à la bonne section, contrôles clavier/souris/tactile, `prefers-reduced-motion` (pas de secousse, pas de flash, texte instantané), pause automatique quand l'onglet est masqué, progression sauvegardée.
Fichiers : `js/theme-gaming.js` (interface) + `js/gaming/` (graphismes, monde, audio, moteur), chargés uniquement quand le thème est actif.
Choix : le guerrier masqué de ZAOMON n'est pas repris pour éviter de dévoiler le jeu de Dev avant sa sortie ; l'île garde l'idée des fragments à retrouver.

Idées d'extension :
- Mini-jeux dans les stèles (jouer à gameSnake ou GameRpg directement sur l'île).
- Cycle jour/nuit et météo (pluie, brouillard).
- Personnages supplémentaires pour les études et les objectifs de Dev.
- Tableau des meilleurs temps (nécessite un petit backend).
- Manette (Gamepad API).

## 4. Thème Style personnel : "DEV, le manga"

Direction créative (5 lignes) :
1. Le portfolio devient un volume de manga dont Dev est le héros : couverture, chapitres numérotés, "À suivre..." en dernière page.
2. Deux matières qui alternent : planches papier (crème, encre noire, rouge, trames de points, lignes de vitesse) et pages "nuit" cyberpunk (terminal, néon jaune acide et cyan, grille).
3. Typographies japonaises décoratives (Dela Gothic One) avec kanji et onomatopées originaux (開発者, 物語, 技術, 作品, 連絡, ドン, ゴゴゴ, キラッ), jamais de personnage ni de logo existant.
4. Le contenu garde sa forme propre : fiche personnage RPG, jauges de puissance façon jeu de combat, projets en couvertures de volumes inclinables.
5. Animations GSAP (entrée "coup de poing", parallaxe des kanji), glitch RGB sur le titre ; tout se coupe avec `prefers-reduced-motion` et un repli sans GSAP existe.

Décisions :
- GSAP 3.12.5 + ScrollTrigger depuis cdnjs, chargés seulement quand ce thème est actif ; si le CDN échoue, IntersectionObserver prend le relais.
- Les champs intimes de la fiche personnage (animes et mangas, jeux préférés, devise) affichent "À débloquer" tant que Dev n'a pas répondu dans `QUESTIONS.md` ; il suffit de remplir `donnees.profil`.
- La photo est passée en noir et blanc contrasté avec une trame rouge (CSS uniquement, l'image n'est pas modifiée).
