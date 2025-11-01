const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');

async function scrapeDolarHoy() {
  const url = 'https://www.dolarhoy.com';
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

  // dolarhoy exposes a few cards. We'll look for 'Compra' and 'Venta' within the page.
  let buy = null, sell = null;
  // look for CSS classes commonly used
  $('*').each((i, el) => {
    const txt = $(el).text();
    if (!buy && /compra/i.test(txt)) {
      const maybe = $(el).next().text() || $(el).parent().text();
      buy = parseNumber(maybe) || buy;
    }
    if (!sell && /venta/i.test(txt)) {
      const maybe = $(el).next().text() || $(el).parent().text();
      sell = parseNumber(maybe) || sell;
    }
  });

  // fallback: find numeric sequence in the page around "Dólar"
  if (!buy || !sell) {
    const body = $('body').text();
    const matches = body.match(/[\d]{1,3}(?:[.,][\d]{2,3})+/g);
    if (matches && matches.length >= 2) {
      buy = buy || parseNumber(matches[0]);
      sell = sell || parseNumber(matches[1]);
    }
  }

  return { source: url, buy_price: buy, sell_price: sell };
}

module.exports = { scrapeDolarHoy };
