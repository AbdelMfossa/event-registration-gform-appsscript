# Event Registration Automation with Google Forms & Apps Script

Automatisez tout le processus d'inscription à un événement avec Google Forms, Sheets et Apps Script : génération de codes d'accès, classement des participants, envoi d'e-mails personnalisés, création de contacts Google et fermeture automatique du formulaire à un seuil défini.

## Fonctionnalités

- Déclenchement automatique à chaque nouvelle réponse de formulaire
- Génération dynamique de **codes d'accès uniques**
- Classification des participants par **niveau d'expérience**
- Envoi d’un **e-mail de confirmation personnalisé**
- Création automatique de **contacts Google** avec l'API People
- Fermeture automatique du formulaire à un **nombre limite d’inscriptions**

## Technologies utilisées

- [Google Apps Script](https://script.google.com/)
- [Google Forms](https://forms.google.com)
- [Google Sheets](https://sheets.google.com)
- [Gmail](https://mail.google.com)
- [Google Contacts API (People API)](https://developers.google.com/people)

## Configuration requise

1. **Créer un Google Form** avec les champs suivants :
   - Prénom
   - Nom
   - Adresse e-mail
   - Campus / Localisation
   - Téléphone
   - Expérience (en années)

2. **Associer une Google Sheet** au formulaire.

3. **Dans la feuille de calcul**, ajouter les colonnes personnalisées :
   - `Code d'accès`
   - `Niveau`
   - `Contact créé`

4. **Créer un brouillon d’e-mail** dans Gmail avec le sujet :  
   `Confirmation de votre réservation - GDGoC`  
   Et le corps contenant les variables `{{PRENOM}}`, `{{CODE}}` et `{{NIVEAU}}`.

5. **Créer le libellé "GDGoC AF"** dans Google Contacts pour y ajouter les participants.

6. **Activer les services avancés** dans Apps Script :
   - People API

7. **Créer un déclencheur** dans Apps Script :
   - Fonction : `onFormSubmit`
   - Type : `Sur envoi de formulaire`

## Exemple de résultat

Lorsqu’un participant soumet le formulaire :
- Un code aléatoire lui est attribué
- Son niveau est détecté automatiquement
- Un e-mail personnalisé est envoyé avec ses infos
- Il est ajouté à vos contacts Google dans le groupe **GDGoC AF**
- Et si le seuil est atteint, le formulaire est automatiquement fermé

## À venir...

Dans un prochain article et dépôt GitHub, nous verrons comment **générer automatiquement des attestations de participation** (PDF) et les **envoyer à tous les participants**, toujours via Apps Script.

## Auteur

**Abdel Aziz MFOSSA**  
🔗 [abdelmfossa.com](https://abdelmfossa.com)  
🐦 [@abdelmfossa](https://x.com/abdelmfossa)

---

⭐ N'hésitez pas à **starrer** ce dépôt si ce projet vous a été utile !
