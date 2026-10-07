# Rapport final : portfolio de Dev Gninoue

## Ce qui est fait

### Socle commun
- Header commun (logo, À propos / Compétences / Projets / Me contacter, langue FR/EN, thème), footer commun, bulle WhatsApp.
- Thème et langue mémorisés entre les visites (`localStorage` dans un `try/catch`). Lien direct possible : `index.html?theme=gaming&lang=en`.
- Chargement à la demande : seuls le CSS et le JS du thème actif sont chargés, et le changement de thème se fait sans rechargement, avec un fondu.
- Une seule source de contenu (`js/donnees.js`) et un seul dictionnaire FR/EN (`js/traductions.js`, 221 clés par langue, parité vérifiée).

### Thème Professionnel (amélioré, pas refait)
- Structure, textes, formulaire FormSubmit, i18n, particules et bulle WhatsApp de Dev conservés.
- Hero retravaillé : accroche, deux boutons, photo optimisée avec anneau et orbite, badges compteurs.
- À propos : carte d'identité avec chiffres clés.
- Compétences : catégorie et jauge animée.
- Projets : filtres par catégorie, visuels de remplacement propres, badges de statut, mention "Code privé".
- Contact : coordonnées cliquables.
- Bloc "Essayer un autre thème" avec deux cartes.
- Couleurs pleines uniquement (aucun dégradé), animations à l'apparition, lien du header actif selon la section.

### Thème Gaming : "L'Île des Fragments"
- Un vrai jeu, original : une île de nuit explorée à la lanterne, avec éclairage dynamique, lucioles, particules et un boss.
- Le contenu se découvre en jouant :
  - l'Archiviste raconte l'à propos ;
  - 16 orbes donnent les compétences ;
  - 10 stèles donnent les projets ;
  - le boss garde le phare, qui mène au contact.
- 8 succès, progression sauvegardée, flèche d'objectif pour ne jamais se perdre.
- Contrôles clavier (ZQSD/WASD/flèches), souris (clic pour aller) et tactile (joystick flottant + bouton d'action).
- Bouton "Passer le jeu / Mode lecture" toujours visible, et les liens du header ouvrent le mode lecture à la bonne section.
- Sons et musique générés en code, coupés par défaut.
- `prefers-reduced-motion` respecté : pas de secousse, pas de flash, texte instantané.

### Thème Style personnel : "DEV, le manga"
- Le site devient un volume de manga : couverture, chapitres, trames de points, lignes de vitesse, kanji et onomatopées originaux.
- Pages "nuit" cyberpunk : terminal, néon, glitch.
- Fiche personnage RPG, jauges de puissance, projets en couvertures de volumes inclinables.
- Animations GSAP chargées à la demande, avec un repli sans GSAP.

### Contenu
- Projets réels récupérés sur GitHub (gninoue-dev) : ajout du Bot de trading, descriptions enrichies d'EditSensei AI et de Zaomon.
- Aucune information personnelle inventée : les champs manquants affichent "À débloquer" ou un bouton de repli (CV).

## Vérifications effectuées (navigateur headless Chrome)
- 3 thèmes × 2 langues × 4 largeurs (360, 768, 1280, 1920 px) : 0 erreur ou avertissement console, 0 requête en échec, aucun défilement horizontal.
- Changement de thème et de langue à chaud, puis rechargement : préférences restaurées, une seule feuille de thème active, moteur du jeu détruit en quittant le thème.
- Accessibilité (axe-core, WCAG 2 A/AA) : 0 violation sur les 3 thèmes, mode lecture compris. Lien d'évitement, navigation clavier dans les menus (flèches, Échap) et focus piégé dans les fenêtres du jeu.
- Jeu testé du début à la fin par un script : tous les fragments, le boss, l'écran de fin, la pause, le mode lecture et les contrôles tactiles fonctionnent, sans blocage. Rendu mesuré à environ 5 ms par image en 1920 px sans GPU.
- Aucun émoji, aucun dégradé dans le thème Professionnel, code en français.

## Ce qui reste à faire (par Dev)
- Toutes les réponses de `QUESTIONS.md` sont intégrées.
- Déposer le CV et les captures avec les noms exacts de `NOMS_RESSOURCES.md`, puis remplir les lignes prévues dans `js/donnees.js`.
- Ajouter plus tard les liens LinkedIn et TikTok, ainsi que ceux d'ExamSecure et de TP PRAD 1 une fois publiés : les emplacements sont prévus.
- Déposer les fichiers listés dans `RESSOURCES.md` (CV PDF, captures des projets).
- Activer FormSubmit : le premier message envoyé déclenche un email de confirmation à valider.
- Tester une fois sur un vrai téléphone : le tactile a été vérifié en émulation, pas sur un appareil réel.

## Mise en avant du CV
Un bouton CV apparaît dans les 3 thèmes :
- Professionnel : dans l'accueil, dans une carte dédiée de la section contact, et dans le footer.
- Gaming : sur l'écran-titre, en mode lecture, dans la pause, sur l'écran de fin, et dans le footer.
- Style personnel : sur la couverture, dans le contact, et dans le footer.

Le bouton affiche "Demander mon CV" (email pré-rempli) tant que le PDF n'est pas renseigné, puis "Télécharger mon CV (PDF)" dès que la ligne `cv:` est remplie. Les deux états ont été testés.

## Décisions principales
Le détail se trouve dans `NOTES.md` :
- fond bleu nuit conservé ;
- `donnees.js` et `traductions.js` ajoutés ;
- moteur de jeu maison plutôt que Phaser ;
- ZAOMON non dévoilé ;
- GSAP pour le thème personnel ;
- copies optimisées de la photo.

L'original `res/photo_Profil.jpg` n'a été ni modifié ni supprimé.
