const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');

async function scrapeWiseBRL() {
  const url = 'https://wise.com/es/currency-converter/brl-to-usd-rate';
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // Wise typically shows "1 BRL = 0.19 USD" style or has an element with rate
  let buy = null, sell = null;
  // We need USD per BRL, but the assignment expects USD quotes -> we want USD price in BRL (i.e., how many BRL per 1 USD)
  // We'll attempt to invert the BRL->USD rate if needed. Try to find the rate number first.
  const body = $('body').text();
  const rateMatch = body.match(/1\s*BRL\s*=\s*([\d.,]+)/i) || body.match(/BRL to USD.*?([\d.,]+)/i);
  if (rateMatch) {
    const brlToUsd = parseNumber(rateMatch[1]);
    if (brlToUsd) {
      const usdToBrl = 1 / brlToUsd;
      // vantage: use same for buy and sell (no spread available)
      buy = sell = Number(usdToBrl.toFixed(6));
    }
  }

  // fallback: find any number and invert
  if (!buy) {
    const nums = body.match(/[\d.,]+/g) || [];
    if (nums.length) {
      const n = parseNumber(nums[0]);
      if (n && n > 0) {
        buy = sell = Number((1 / n).toFixed(6));
      }
    }
  }

  return { source: url, buy_price: buy, sell_price: sell };
}

module.exports = { scrapeWiseBRL };
