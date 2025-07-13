const fs = require('fs');
const path = require('path');

const dir = path.join(__dirname, '../src/pages/[lang]');
const out = path.join(__dirname, '../src/config/langPages.json');
const pages = fs.readdirSync(dir)
  .filter(f => f.endsWith('.tsx'))
  .map(f => f.replace('.tsx', ''));

fs.writeFileSync(out, JSON.stringify(pages, null, 2));
console.log('Generated:', out, pages);