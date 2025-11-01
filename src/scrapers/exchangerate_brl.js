const axios = require('axios');

async function scrapeExchangerateHostBRL() {
  const url = 'https://api.exchangerate.host/latest?base=USD&symbols=BRL';
  try {
    const { data } = await axios.get(url);
    const rate = data?.rates?.BRL || null;
    return { source: url, buy_price: rate, sell_price: rate };
  } catch (err) {
    console.warn(`[ExchangerateHost] Failed: ${err.message}`);
    return { source: url, buy_price: null, sell_price: null };
  }
}

module.exports = { scrapeExchangerateHostBRL };
