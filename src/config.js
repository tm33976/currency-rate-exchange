module.exports = {
  POLL_INTERVAL_MS: 55 * 1000, // refresh every 55s (keeps < 60s)
  SQLITE_FILE: process.env.SQLITE_FILE || './data/quotes.db',
  PORT: process.env.PORT || 3000,
  SOURCES: {
    ARS: [
      'https://www.ambito.com/contenidos/dolar.html',
      'https://www.dolarhoy.com',
      'https://www.cronista.com/MercadosOnline/moneda.html?id=ARSB'
    ],
    BRL: [
      'https://wise.com/es/currency-converter/brl-to-usd-rate',
      'https://nubank.com.br/taxas-conversao/',
      'https://www.nomadglobal.com'
    ]
  }
};
