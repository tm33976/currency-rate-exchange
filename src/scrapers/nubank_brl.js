const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');
const puppeteer = require('puppeteer');

// We'll keep a cached rate in case the live scrape fails
let lastNubankRate = null;

async function scrapeNubankBRL() {
  const url = 'https://nubank.com.br/taxas-conversao/';

  try {
   
    const html = await fetchHtml(url);
    const $ = cheerio.load(html);
    const body = $('body').text();

    // Attempt to find a pattern like "1 USD = X BRL"
    const match = body.match(/1\s*USD\s*=\s*([\d.,]+)/i) || body.match(/USD.*?([\d.,]+)\s*BRL/i);
    if (match) {
      const rate = parseNumber(match[1]);
      if (rate) {
        lastNubankRate = rate;
        return { source: url, buy_price: rate, sell_price: rate };
      }
    }

    console.warn('[Nubank] Switching to Puppeteer...');
    const browser = await puppeteer.launch({ headless: true, args: ['--no-sandbox'] });
    const page = await browser.newPage();
    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });
    await page.waitForTimeout(2500); // wait for React content to render
    const pageText = await page.evaluate(() => document.body.innerText);
    await browser.close();

    const pmatch = pageText.match(/1\s*USD\s*=\s*([\d.,]+)/i) || pageText.match(/USD.*?([\d.,]+)\s*BRL/i);
    if (pmatch) {
      const rate = parseNumber(pmatch[1]);
      if (rate) {
        lastNubankRate = rate;
        return { source: url, buy_price: rate, sell_price: rate };
      }
    }

    if (lastNubankRate) {
      console.warn('[Nubank] Using cached rate (page data unavailable)');
      return { source: url, buy_price: lastNubankRate, sell_price: lastNubankRate };
    }

   
    return { source: url, buy_price: null, sell_price: null };
  } catch (err) {
    console.warn(`[Nubank] Failed: ${err.message}`);
    // Return cached rate if possible
    if (lastNubankRate) {
      return { source: url, buy_price: lastNubankRate, sell_price: lastNubankRate };
    }
    return { source: url, buy_price: null, sell_price: null };
  }
}

module.exports = { scrapeNubankBRL };
