const { insertQuote, getLatestQuotesByCurrency } = require('../db');
const SOURCES = require('../scrapers'); 
const { POLL_INTERVAL_MS } = require('../config');

async function fetchAllForCurrency(currency) {
  const scrapers = SOURCES[currency];
  if (!scrapers || !scrapers.length) {
    throw new Error(`No scrapers defined for ${currency}`);
  }

  const results = [];

  for (const scrapeFn of scrapers) {
    try {
      const quote = await scrapeFn();

      if (quote && (quote.buy_price || quote.sell_price)) {
        insertQuote({
          source: quote.source,
          currency,
          buy_price: quote.buy_price,
          sell_price: quote.sell_price,
          fetched_at: Date.now(),
        });

        results.push(quote);
      }
    } catch (err) {
      console.warn(`[${currency}] scraper failed: ${err.message}`);
    }
  }

  return results;
}

// Get latest quotes from DB
function getQuotes(currency) {
  try {
    return getLatestQuotesByCurrency(currency);
  } catch (err) {
    console.warn('getQuotes error', err);
    throw err;
  }
}

// Periodic poller (background)
function startPoller() {
  console.log(`⏱️ Poller started. Interval = ${POLL_INTERVAL_MS / 1000}s`);
  setInterval(async () => {
    for (const cur of Object.keys(SOURCES)) {
      try {
        await fetchAllForCurrency(cur);
      } catch (err) {
        console.warn('poller error', err.message);
      }
    }
  }, POLL_INTERVAL_MS);
}

module.exports = { getQuotes, startPoller };
