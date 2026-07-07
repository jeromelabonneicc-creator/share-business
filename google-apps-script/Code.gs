const SHEETS = {
  newsletter: "Newsletter",
  survey: "Sondage invites",
  honor: "Candidatures invite honneur"
};

function doPost(e) {
  const lock = LockService.getScriptLock();
  lock.waitLock(10000);

  try {
    const data = e.parameter || {};
    const formName = data.formulaire || "Formulaire";
    const sheet = getTargetSheet_(formName);
    const headers = getHeadersForForm_(formName);
    ensureHeaders_(sheet, headers);
    sheet.appendRow(headers.map((header) => getValueForHeader_(header, data)));

    return ContentService
      .createTextOutput(JSON.stringify({ ok: true }))
      .setMimeType(ContentService.MimeType.JSON);
  } catch (error) {
    return ContentService
      .createTextOutput(JSON.stringify({ ok: false, error: error.message }))
      .setMimeType(ContentService.MimeType.JSON);
  } finally {
    lock.releaseLock();
  }
}

function getTargetSheet_(formName) {
  const spreadsheet = SpreadsheetApp.getActiveSpreadsheet();
  const normalizedName = normalize_(formName);

  if (normalizedName.includes("newsletter")) {
    return getOrCreateSheet_(spreadsheet, SHEETS.newsletter);
  }

  if (normalizedName.includes("sondage")) {
    return getOrCreateSheet_(spreadsheet, SHEETS.survey);
  }

  return getOrCreateSheet_(spreadsheet, SHEETS.honor);
}

function getHeadersForForm_(formName) {
  const normalizedName = normalize_(formName);

  if (normalizedName.includes("newsletter")) {
    return ["Date", "Email", "Page", "Langue"];
  }

  if (normalizedName.includes("sondage")) {
    return ["Date", "Invite souhaite", "Page", "Langue"];
  }

  return [
    "Date",
    "Nom",
    "Prenom",
    "Email",
    "Telephone",
    "Entreprise",
    "Fonction",
    "Motivation",
    "Lien",
    "Page",
    "Langue"
  ];
}

function getValueForHeader_(header, data) {
  const values = {
    "Date": new Date(),
    "Email": data.email || "",
    "Invite souhaite": data.invite_souhaite || "",
    "Nom": data.nom || "",
    "Prenom": data.prenom || "",
    "Telephone": data.telephone || "",
    "Entreprise": data.entreprise || "",
    "Fonction": data.fonction || "",
    "Motivation": data.motivation || "",
    "Lien": data.lien || "",
    "Page": data.page || "",
    "Langue": data.langue || ""
  };

  return values[header] || "";
}

function getOrCreateSheet_(spreadsheet, name) {
  return spreadsheet.getSheetByName(name) || spreadsheet.insertSheet(name);
}

function ensureHeaders_(sheet, headers) {
  const range = sheet.getRange(1, 1, 1, headers.length);
  const currentHeaders = range.getValues()[0];
  const hasHeaders = currentHeaders.some((value) => value);

  if (!hasHeaders) {
    range.setValues([headers]);
    range.setFontWeight("bold");
    sheet.setFrozenRows(1);
  }
}

function normalize_(value) {
  return String(value || "")
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "");
}
