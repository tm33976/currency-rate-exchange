const Database = require('better-sqlite3');
const { SQLITE_FILE } = require('./config');
const fs = require('fs');
const path = require('path');

// Resolve data directory
const dataDir = path.dirname(SQLITE_FILE);

//  Try to create data directory only if allowed
try {
  if (!fs.existsSync(dataDir)) {
    fs.mkdirSync(dataDir, { recursive: true });
    console.log(`[DB] ✅ Created data directory at ${dataDir}`);
  } else {
    console.log(`[DB] 📁 Using existing data directory at ${dataDir}`);
  }
} catch (err) {
  console.warn(
    `[DB]  Could not create directory "${dataDir}". Probably read-only environment. Skipping...`
  );
}

//  Initialize SQLite
const db = new Database(SQLITE_FILE);

//  Create schema if not exists
db.exec(`
  CREATE TABLE IF NOT EXISTS quotes (
    id INTEGER PRIMARY KEY AUTOINCREMENT,
    source TEXT NOT NULL,
    currency TEXT NOT NULL, -- "ARS" or "BRL"
    buy_price REAL,
    sell_price REAL,
    fetched_at INTEGER -- unix epoch ms
  );

  CREATE INDEX IF NOT EXISTS idx_quotes_source ON quotes(source);
  CREATE INDEX IF NOT EXISTS idx_quotes_currency ON quotes(currency);
`);


function insertQuote({ source, currency, buy_price, sell_price, fetched_at }) {
  try {
    const stmt = db.prepare(`
      INSERT INTO quotes (source, currency, buy_price, sell_price, fetched_at)
      VALUES (@source, @currency, @buy_price, @sell_price, @fetched_at)
    `);
    stmt.run({ source, currency, buy_price, sell_price, fetched_at });
  } catch (err) {
    console.error(`[DB]  insertQuote error: ${err.message}`);
  }
}

// ✅ Get latest quotes per source for a currency
function getLatestQuotesByCurrency(currency) {
  try {
    const rows = db
      .prepare(`
        SELECT q1.* FROM quotes q1
        JOIN (
          SELECT source, MAX(fetched_at) AS maxt 
          FROM quotes 
          WHERE currency = ? 
          GROUP BY source
        ) q2
        ON q1.source = q2.source AND q1.fetched_at = q2.maxt
        WHERE q1.currency = ?
      `)
      .all(currency, currency);
    return rows;
  } catch (err) {
    console.error(`[DB]  getLatestQuotesByCurrency error: ${err.message}`);
    return [];
  }
}


function getAllQuotes() {
  try {
    return db
      .prepare(`SELECT * FROM quotes ORDER BY fetched_at DESC`)
      .all();
  } catch (err) {
    console.error(`[DB] ❌ getAllQuotes error: ${err.message}`);
    return [];
  }
}

module.exports = { db, insertQuote, getLatestQuotesByCurrency, getAllQuotes };
