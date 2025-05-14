// Constantes utilisées dans le script
const LIMITE_INSCRIPTIONS = 10;
const NOM_FEUILLE = "Réponses au formulaire 1";
const NOM_LABEL_CONTACT = "GDGoC AF";

// Génère un code d'accès à 6 chiffres aléatoire
function genererCodeAcces() {
  return Math.floor(100000 + Math.random() * 900000);
}

// Crée un contact Google avec nom, téléphone et email, puis l'ajoute au groupe "GDGoC AF"
function creerContact(nomComplet, tel, email) {
  const contact = People.People.createContact({
    names: [{ displayName: nomComplet, givenName: nomComplet }],
    phoneNumbers: [{ value: tel, type: "mobile" }],
    emailAddresses: [{ value: email }]
  });

  // Recherche le groupe de contacts existant nommé "GDGoC AF"
  const groupe = People.ContactGroups.list({ pageSize: 200 }).contactGroups
                  .find(g => g.formattedName === NOM_LABEL_CONTACT);

  // Ajoute le contact au groupe s’il existe
  if (groupe) {
    People.ContactGroups.Members.modify({
      resourceNamesToAdd: [contact.resourceName]
    }, groupe.resourceName);
  }

  console.log("Contact créé :", contact.resourceName);
}

// Envoie un e-mail personnalisé de confirmation à partir d’un brouillon Gmail existant
function envoyerConfirmation(email, prenom, code, niveau) {
  const brouillons = GmailApp.getDrafts();

  // Recherche le brouillon avec un objet spécifique
  const brouillon = brouillons.find(d => d.getMessage().getSubject().includes("Confirmation de votre réservation - GDGoC"));
  if (!brouillon) return;

  const messageOriginal = brouillon.getMessage();

  // Personnalise le corps du message avec le prénom, code et niveau
  const corps = messageOriginal.getBody()
    .replace("{{PRENOM}}", prenom)
    .replace("{{CODE}}", code)
    .replace("{{NIVEAU}}", niveau);

  const sujet = messageOriginal.getSubject();
  const copies = messageOriginal.getCc();

  // Envoie de l’e-mail avec pièce(s) jointe(s) si présentes
  GmailApp.sendEmail(email, sujet, "", {
    htmlBody: corps,
    attachments: messageOriginal.getAttachments(),
    cc: copies,
    name: "Abdel from GDGoC",
  });
}

// Ferme automatiquement le formulaire si la limite d’inscriptions est atteinte
function fermerFormulaireSiLimiteAtteinte() {
  const form = FormApp.openByUrl(SpreadsheetApp.getActiveSpreadsheet().getFormUrl());
  const nbReponses = form.getResponses().length;

  if (nbReponses >= 4) {
    form.setAcceptingResponses(false);
    MailApp.sendEmail(
      "abdelemfossa@gmail.com",
      "Inscriptions complètes - Apps Script GDGoC AF",
      "Le formulaire a été automatiquement fermé après " + nbReponses + " inscriptions."
    );
  }
}


// Fonction principale déclenchée à chaque soumission du formulaire
function onFormSubmit(e) {
  const sheet = SpreadsheetApp.getActiveSpreadsheet().getSheetByName(NOM_FEUILLE);
  const data = e.values;

  // Extraction des champs du formulaire
  const horodatage = data[0];
  const prenom = data[1];
  const nom = data[2];
  const email = data[3];
  const campus = data[4];
  const telephone = data[5];
  const experience = parseInt(data[6], 10);

  // Détermine la ligne où écrire les données supplémentaires
  const ligne = sheet.getLastRow();

  // Génère un code d’accès et déduit le niveau en fonction de l’expérience
  const codeAcces = genererCodeAcces();
  const niveau = experience >= 4 ? "Avancé" : experience >= 2 ? "Intermédiaire" : "Débutant";

  // Écrit le code d’accès et le niveau dans les colonnes H et I
  sheet.getRange(ligne, 8).setValue(codeAcces); // Colonne H
  sheet.getRange(ligne, 9).setValue(niveau);    // Colonne I

  // Si le téléphone est renseigné, crée le contact et indique "OUI" en colonne J
  if (telephone) {
    creerContact(nom, telephone, email);
    sheet.getRange(ligne, 10).setValue("OUI");  // Colonne J
  } else {
    sheet.getRange(ligne, 10).setValue("NON");
  }

  // Envoie un e-mail personnalisé à l’utilisateur
  envoyerConfirmation(email, prenom, codeAcces, niveau);

  // Vérifie si la limite est atteinte et ferme le formulaire si nécessaire
  fermerFormulaireSiLimiteAtteinte();
}
