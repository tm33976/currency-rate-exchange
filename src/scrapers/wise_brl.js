const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');

async function scrapeWiseBRL() {
  const url = 'https://wise.com/es/currency-converter/brl-to-usd-rate';
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  let buy = null, sell = null;
 

  const body = $('body').text();
  const rateMatch = body.match(/1\s*BRL\s*=\s*([\d.,]+)/i) || body.match(/BRL to USD.*?([\d.,]+)/i);
  if (rateMatch) {
    const brlToUsd = parseNumber(rateMatch[1]);
    if (brlToUsd) {
      const usdToBrl = 1 / brlToUsd;
  
      buy = sell = Number(usdToBrl.toFixed(6));
    }
  }

 
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
