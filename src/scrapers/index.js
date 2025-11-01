const { scrapeAmbito } = require('./ambito');
const { scrapeCronista } = require('./cronista');
const { scrapeDolarHoy } = require('./dolarhoy');

// BRL Scrapers
const { scrapeWiseBRL } = require('./wise_brl');
const { scrapeExchangerateHostBRL } = require('./exchangerate_brl');

// Export sources for both currencies
const SOURCES = {
  ARS: [scrapeAmbito, scrapeCronista, scrapeDolarHoy],
  BRL: [scrapeWiseBRL, scrapeExchangerateHostBRL]
};

module.exports = SOURCES;
