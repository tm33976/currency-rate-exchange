const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');

async function scrapeNomadBRL() {
  const url = 'https://www.nomadglobal.com';
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);
  const body = $('body').text();

  // Try to find "USD" and numbers nearby
  const m = body.match(/1\s*USD\s*=\s*([\d.,]+)/i) || body.match(/USD.*?([\d.,]+)/i);
  if (m) {
    const v = parseNumber(m[1]);
    if (v) return { source: url, buy_price: v, sell_price: v };
  }

  const nums = body.match(/[\d.,]+/g) || [];
  if (nums.length) {
    const n = parseNumber(nums[0]);
    if (n) return { source: url, buy_price: n, sell_price: n };
  }

  return { source: url, buy_price: null, sell_price: null };
}

module.exports = { scrapeNomadBRL };
