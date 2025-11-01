const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');
const puppeteer = require('puppeteer');

let lastCached = { buy: null, sell: null, fetched_at: null };

async function scrapeAmbito() {
  const url = 'https://www.ambito.com/contenidos/dolar.html';
  let html;

  try {
   
    try {
      html = await fetchHtml(url);
    } catch (err) {
      if (/403/.test(err.message)) {
        console.warn('[Ambito] 403 detected — switching to Puppeteer...');
        html = await scrapeWithPuppeteer(url);
      } else {
        throw err;
      }
    }


    const $ = cheerio.load(html);
    let buy = null, sell = null;

    const textBody = $('body').text();
    const ratePattern = textBody.match(/[\d]{1,3}(?:[.,]\d{2,3})+/g);

    if (ratePattern && ratePattern.length >= 2) {
      buy = parseNumber(ratePattern[0]);
      sell = parseNumber(ratePattern[1]);
    }

   
    if (!buy || !sell) {
      $('*').each((i, el) => {
        const text = $(el).text().trim();
        if (!buy && /compra/i.test(text)) {
          const maybe =
            $(el).next().text() || $(el).parent().find('.value, [data-value]').first().text();
          buy = parseNumber(maybe) || buy;
        }
        if (!sell && /venta/i.test(text)) {
          const maybe =
            $(el).next().text() || $(el).parent().find('.value, [data-value]').first().text();
          sell = parseNumber(maybe) || sell;
        }
      });
    }

    // Final fallback
    if ((!buy || !sell) && ratePattern && ratePattern.length >= 2) {
      buy = buy || parseNumber(ratePattern[0]);
      sell = sell || parseNumber(ratePattern[1]);
    }

   
    if (buy && sell) {
      lastCached = { buy, sell, fetched_at: Date.now() };
      console.log(`[Ambito]  Scraped successfully: buy=${buy}, sell=${sell}`);
    } else if (lastCached.buy && lastCached.sell) {
      console.warn('[Ambito]  Using cached values (scrape failed)');
      buy = lastCached.buy;
      sell = lastCached.sell;
    } else {
      console.warn('[Ambito]  Could not extract valid data (no cache yet)');
    }

    return { source: url, buy_price: buy, sell_price: sell };
  } catch (err) {
    console.warn(`[Ambito]  Fatal error: ${err.message}`);
    if (lastCached.buy && lastCached.sell) {
      console.warn('[Ambito]  Returning cached values after error');
      return {
        source: url,
        buy_price: lastCached.buy,
        sell_price: lastCached.sell,
      };
    }
    return { source: url, buy_price: null, sell_price: null };
  }
}


async function scrapeWithPuppeteer(url) {
  const browser = await puppeteer.launch({
    headless: true,
    args: [
      '--no-sandbox',
      '--disable-setuid-sandbox',
      '--disable-gpu',
      '--disable-dev-shm-usage',
      '--disable-blink-features=AutomationControlled',
    ],
  });

  try {
    const page = await browser.newPage();
    await page.setUserAgent(
      'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/126.0 Safari/537.36'
    );

    await page.goto(url, { waitUntil: 'domcontentloaded', timeout: 20000 });

  
    await new Promise((resolve) => setTimeout(resolve, 3000));

    const pageText = await page.evaluate(() => document.body.innerText);
    const matches = pageText.match(/[\d]{1,3}(?:[.,]\d{2,3})+/g);

    if (matches && matches.length >= 2) {
      console.log(`[Ambito Puppeteer]  Extracted: ${matches[0]} / ${matches[1]}`);
    }

    return pageText;
  } catch (err) {
    console.warn(`[Ambito Puppeteer]  Failed: ${err.message}`);
    return '';
  } finally {
    await browser.close();
  }
}

module.exports = { scrapeAmbito };
