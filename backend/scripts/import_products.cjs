const fs = require('fs');
const Database = require('better-sqlite3');

const dbPath = process.argv[2] || 'backend/data/phis.db';
const db = new Database(dbPath);
const products = JSON.parse(fs.readFileSync('../frontend/src/data/products.json', 'utf8'));

const insert = db.prepare(`
  INSERT OR REPLACE INTO products (id, name, platform, price, ec_data, created_at, updated_at)
  VALUES (?, ?, ?, ?, ?, ?, ?)
`);

const tx = db.transaction((items) => {
  for (const p of items) {
    insert.run(
      String(p.id),
      p.name || '',
      p.platform || '',
      (typeof p.price === 'number') ? p.price : null,
      JSON.stringify(p.ec_data || {}),
      p.created_at || new Date().toISOString(),
      p.updated_at || new Date().toISOString()
    );
  }
});

try {
  tx(products);
  console.log('import complete:', products.length);
} catch (e) {
  console.error('import failed:', e);
  process.exit(1);
}