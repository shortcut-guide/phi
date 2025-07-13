const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/pages/[lang]');
const out = path.join(__dirname, '../src/config/langPages.json');

const files = fs.readdirSync(dir)
  .filter(f => f.endsWith('.tsx') && !f.startsWith('['))
  .map(f => f.replace('.tsx', ''));

fs.writeFileSync(out, JSON.stringify(files, null, 2));
console.log('Generated:', out, files);