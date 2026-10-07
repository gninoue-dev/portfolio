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
   Réponse : tiktok : 

3. **Ville et pays à afficher (facultatif) ?**
   Format : "Ville, Pays" ou "ne pas afficher".
   → `profil.ville`
   Réponse : Pays : Cote d'ivoire , Ville : Abidjan

4. **Le formulaire de contact passe par FormSubmit vers Devgninoue@gmail.com. As-tu déjà validé l'email d'activation de FormSubmit ?**
   Format : oui / non. (Si non : envoie un premier message depuis le site, puis clique sur le lien reçu.)
   Réponse : non

## 2. Parcours et compétences

5. **Les "2 ans d'expérience" affichés : à partir de quand comptes-tu ?**
   Format : une année (ex. 2024) ou un nombre à afficher.
   → `profil.anneesExperience`
   Réponse : a partie de 2024

6. **Tu utilises Python (EditSensei AI, Bot de trading, TP PRAD 1) et Java (FocusFlow). Faut-il les ajouter aux compétences, et à quel niveau ?**
   Format : "Python : débutant / intermédiaire / expert", "Java : ...", ou "non".
   → tableau `competences`
   Réponse : python : debutant

7. **D'autres compétences à ajouter (Godot, Node.js, Premiere Pro, maintenance PC...) ?**
   Format : liste "nom : niveau".
   Réponse : oui pour l'instant rends ça extensible

8. **Disponibilités pour un stage (dates, durée, sur place ou à distance) ?**
   Format : une phrase.
   Réponse : disponoble pour tout type de stage 

## 3. Projets

9. **ExamSecure : le code est-il public ? Y a-t-il une démo ?**
   Format : URL du dépôt et/ou de la démo, ou "privé".
   → projet `examsecure`
   Réponse : oui

10. **TP PRAD 1 : le code est-il public ?**
    Format : URL ou "privé".
    → projet `prad1`
    Réponse : oui

11. **Bot Ozen MD Panel : sur quelle plateforme tourne le bot (WhatsApp, Discord, Telegram...) et que fait-il ?**
    Format : une ou deux phrases.
    → projet `ozen`
    Réponse : projet a suprimé puisque ozen-md est deja la 

12. **Les statuts "Terminé" / "En cours" de chaque projet sont-ils à jour ?**
    Format : liste des corrections, ou "ok".
    Réponse :

13. **Y a-t-il un projet phare à mettre en avant en premier ?**
    Format : nom du projet.
    Réponse : Projet web fin module

## 4. Thème Style personnel (goûts et personnalité)

14. **Quels sont tes animes et mangas préférés ?**
    Format : 3 titres maximum.
    → `profil.animesFavoris: ['...', '...']`
    Réponse : Anime : attaque des titans , hajime no ippo, rezero, monster, death note , erased.

15. **Quels sont tes jeux vidéo préférés ?**
    Format : 3 titres maximum.
    → `profil.jeuxFavoris: ['...', '...']`
    Réponse : watchdogs, gta sanandreas, god-of-war du 1 au 3

16. **Quelle citation ou devise te représente ?**
    Format : une phrase courte, en français (et en anglais si tu veux, sinon je traduirai).
    → `profil.citation: { fr: '...', en: '...' }`
    Réponse : la vie est comme un mmorpg du coup Massasse plein de skills et tu n'en sera pas deçu.

17. **Comment te décrirais-tu en 3 phrases, sur un ton personnel ?**
    Format : 3 phrases. (Elles pourraient remplacer la bulle "Bienvenue dans mon univers !" et enrichir le chapitre 1.)
    Réponse : Je suis quelqu'un qui aiment apprendre et decouvir de nouvelle chose en bref curieux.

18. **Un surnom ou pseudo de joueur que tu aimerais voir apparaître ?**
    Format : un mot, ou "non".
    Réponse : mon Pseudo en Jeu et En montage video :OZEN et mon Joueur phare c'est Kylian en jeux video(tekken(ya Bob et NinA))

## 5. Thème Gaming

19. **Accepterais-tu que l'univers de ZAOMON (masques, guerrier guéré) apparaisse dans le jeu du portfolio, ou préfères-tu le garder secret jusqu'à sa sortie ?**
    Format : oui / non.
    Réponse : non que tout reste secret

je me permets d'ajouter ceux ci le cv sera ajouter apres ainsi que les photo des projet tout sera mise dans resources donc t'inquietes
---

## Suivi (7 octobre 2026) : réponses intégrées

Intégré au site : ville (Abidjan, Côte d'Ivoire), expérience calculée depuis 2024, Python (débutant), disponibilité pour tout type de stage, Bot Ozen MD Panel retiré, projet web de fin de module en projet phare, animes, jeux, devise, phrase de personnalité, pseudo OZEN, mains Tekken (Bob, Nina), univers de ZAOMON gardé secret (description raccourcie, rien dans le jeu).
Compétences extensibles : ajouter une ligne dans `competences` de `js/donnees.js` suffit (elle apparaît dans les 3 thèmes et ajoute une orbe dans le jeu). Pareil pour les projets (une stèle de plus).

### Encore 4 petites précisions

A. **ExamSecure et TP PRAD 1 : tu dis que le code est public, mais je ne les trouve pas sur github.com/gninoue-dev. Quelles sont les URL ?**
   (Tant que ce n'est pas renseigné, le site affiche "Code privé".)
   Réponse :

B. **TikTok : l'adresse n'a pas été indiquée. Quelle est-elle (ex. `https://www.tiktok.com/@...`) ?**
   Réponse :

C. **LinkedIn : la réponse est vide. "aucun" ?**
   Réponse :

D. **"Mon joueur phare c'est Kylian" : Kylian est-il un joueur professionnel de Tekken que tu admires, ou ton propre pseudo ? Faut-il l'afficher ?**
   (Pour l'instant, seuls tes personnages Bob et Nina sont affichés.)
   Réponse :
