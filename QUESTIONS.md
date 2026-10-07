# Questions pour Dev

Réponds directement sous chaque question (format court indiqué). Rien n'a été inventé : en attendant, le site affiche un espace réservé.
Les réponses se reportent dans `js/donnees.js` (indiqué pour chaque question).

## 1. Liens et contact

1. **Adresse de ton profil LinkedIn ?**
   Format : une URL (`https://www.linkedin.com/in/...`) ou "aucun".
   → `liens.linkedin`
   Réponse :

2. **Veux-tu afficher Facebook, TikTok et Instagram ? Si oui, leurs adresses.**
   Format : une URL par réseau, ou "non".
   → `liens.facebook`, `liens.tiktok`, `liens.instagram`
   Réponse :

3. **Ville et pays à afficher (facultatif) ?**
   Format : "Ville, Pays" ou "ne pas afficher".
   → `profil.ville`
   Réponse :

4. **Le formulaire de contact passe par FormSubmit vers Devgninoue@gmail.com. As-tu déjà validé l'email d'activation de FormSubmit ?**
   Format : oui / non. (Si non : envoie un premier message depuis le site, puis clique sur le lien reçu.)
   Réponse :

## 2. Parcours et compétences

5. **Les "2 ans d'expérience" affichés : à partir de quand comptes-tu ?**
   Format : une année (ex. 2024) ou un nombre à afficher.
   → `profil.anneesExperience`
   Réponse :

6. **Tu utilises Python (EditSensei AI, Bot de trading, TP PRAD 1) et Java (FocusFlow). Faut-il les ajouter aux compétences, et à quel niveau ?**
   Format : "Python : débutant / intermédiaire / expert", "Java : ...", ou "non".
   → tableau `competences`
   Réponse :

7. **D'autres compétences à ajouter (Godot, Node.js, Premiere Pro, maintenance PC...) ?**
   Format : liste "nom : niveau".
   Réponse :

8. **Disponibilités pour un stage (dates, durée, sur place ou à distance) ?**
   Format : une phrase.
   Réponse :

## 3. Projets

9. **ExamSecure : le code est-il public ? Y a-t-il une démo ?**
   Format : URL du dépôt et/ou de la démo, ou "privé".
   → projet `examsecure`
   Réponse :

10. **TP PRAD 1 : le code est-il public ?**
    Format : URL ou "privé".
    → projet `prad1`
    Réponse :

11. **Bot Ozen MD Panel : sur quelle plateforme tourne le bot (WhatsApp, Discord, Telegram...) et que fait-il ?**
    Format : une ou deux phrases.
    → projet `ozen`
    Réponse :

12. **Les statuts "Terminé" / "En cours" de chaque projet sont-ils à jour ?**
    Format : liste des corrections, ou "ok".
    Réponse :

13. **Y a-t-il un projet phare à mettre en avant en premier ?**
    Format : nom du projet.
    Réponse :

## 4. Thème Style personnel (goûts et personnalité)

14. **Quels sont tes animes et mangas préférés ?**
    Format : 3 titres maximum.
    → `profil.animesFavoris: ['...', '...']`
    Réponse :

15. **Quels sont tes jeux vidéo préférés ?**
    Format : 3 titres maximum.
    → `profil.jeuxFavoris: ['...', '...']`
    Réponse :

16. **Quelle citation ou devise te représente ?**
    Format : une phrase courte, en français (et en anglais si tu veux, sinon je traduirai).
    → `profil.citation: { fr: '...', en: '...' }`
    Réponse :

17. **Comment te décrirais-tu en 3 phrases, sur un ton personnel ?**
    Format : 3 phrases. (Elles pourraient remplacer la bulle "Bienvenue dans mon univers !" et enrichir le chapitre 1.)
    Réponse :

18. **Un surnom ou pseudo de joueur que tu aimerais voir apparaître ?**
    Format : un mot, ou "non".
    Réponse :

## 5. Thème Gaming

19. **Accepterais-tu que l'univers de ZAOMON (masques, guerrier guéré) apparaisse dans le jeu du portfolio, ou préfères-tu le garder secret jusqu'à sa sortie ?**
    Format : oui / non.
    Réponse :
