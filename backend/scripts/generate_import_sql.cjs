// backend/scripts/generate_import_sql.cjs
const fs = require('fs');
const p = require('../frontend/src/data/products.json');
const esc = s => String(s).replace(/'/g, "''");
const stmts = p.map(i =>
  `INSERT OR REPLACE INTO products (id,name,platform,price,ec_data,created_at,updated_at) VALUES ('${esc(i.id)}','${esc(i.name)}','${esc(i.platform||'')}', ${i.price===undefined? 'NULL' : i.price}, '${esc(JSON.stringify(i.ec_data||{}))}', '${esc(i.created_at||new Date().toISOString())}', '${esc(i.updated_at||new Date().toISOString())}');`
).join('\n');
fs.mkdirSync('./sql', { recursive: true });
fs.writeFileSync('./sql/import_products.sql', stmts, 'utf8');
console.log('wrote ./sql/import_products.sql');