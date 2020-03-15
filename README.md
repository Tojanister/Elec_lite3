# Elec_lite3
npm init
npm install --save-dev electron
npm install --save sqlite3

npm install --save-dev electron-rebuild

ADDING package.json:
  "scripts": {
    .
    .
    .
    "rebuild": "electron-rebuild -f -w sqlite3"
  }

npm run rebuild