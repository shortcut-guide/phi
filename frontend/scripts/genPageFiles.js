// scripts/genPageFiles.js
const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/pages');
const out = path.join(__dirname, '../src/config/pageFiles.json');

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.tsx') && !f.startsWith('[') && f !== '_app.tsx' && f !== '_document.tsx')
  .map(f => f.replace('.tsx', ''));

fs.writeFileSync(out, JSON.stringify(files, null, 2));
console.log('Generated:', out, files);