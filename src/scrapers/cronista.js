const { fetchHtml, parseNumber, cheerio } = require('./baseScraper');

async function scrapeCronista() {
  const url = 'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB';
  const html = await fetchHtml(url);
  const $ = cheerio.load(html);

 
  let buy = null, sell = null;
  $('*').each((i, el) => {
    const txt = $(el).text();
    if (!buy && /compra/i.test(txt)) {
      buy = buy || parseNumber($(el).next().text());
    }
    if (!sell && /venta/i.test(txt)) {
      sell = sell || parseNumber($(el).next().text());
    }
  });

  // fallback: numbers near the word "Dolar"
  if (!buy || !sell) {
    const body = $('body').text();
    const matches = body.match(/[\d.,]+/g) || [];
    if (matches.length >= 2) {
      buy = buy || parseNumber(matches[0]);
      sell = sell || parseNumber(matches[1]);
    }
  }

  return { source: url, buy_price: buy, sell_price: sell };
}

module.exports = { scrapeCronista };
