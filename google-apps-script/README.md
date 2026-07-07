# Collecte des formulaires Share Business

Ce dossier contient le script Google Apps Script à connecter au site.

## Installation

1. Créer un Google Sheet nommé par exemple `Share Business - Collecte site`.
2. Dans le Google Sheet, ouvrir `Extensions` > `Apps Script`.
3. Remplacer le contenu du fichier `Code.gs` par le contenu de `google-apps-script/Code.gs`.
4. Cliquer sur `Déployer` > `Nouveau déploiement`.
5. Choisir le type `Application web`.
6. Exécuter en tant que : `Moi`.
7. Qui a accès : `Tout le monde`.
8. Déployer, autoriser le script, puis copier l’URL de l’application web.
9. Dans `index.html`, remplacer la valeur vide :

```js
const GOOGLE_APPS_SCRIPT_URL = "";
```

par l’URL copiée :

```js
const GOOGLE_APPS_SCRIPT_URL = "https://script.google.com/macros/s/XXXXX/exec";
```

## Onglets créés automatiquement

Le script crée et remplit automatiquement trois onglets :

- `Newsletter`
- `Sondage invites`
- `Candidatures invite honneur`
