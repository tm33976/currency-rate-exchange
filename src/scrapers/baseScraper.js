const axios = require('axios');
const cheerio = require('cheerio');

async function fetchHtml(url) {
  const resp = await axios.get(url, {
    headers: {
      'User-Agent': 'Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/124.0 Safari/537.36',
      'Accept': 'text/html,application/xhtml+xml,application/xml;q=0.9,image/webp,*/*;q=0.8',
      'Accept-Language': 'en-US,en;q=0.9',
      'Referer': 'https://www.google.com/',
      'DNT': '1',
      'Connection': 'keep-alive'
    },
    timeout: 15000,
    validateStatus: (status) => status < 500 // 403 won't auto-throw
  });

  if (resp.status >= 400) {
    throw new Error(`HTTP ${resp.status} fetching ${url}`);
  }

  return resp.data;
}

function parseNumber(text) {
  if (!text) return null;

  const cleaned = text.replace(/[^0-9.,-]+/g, '').trim();
  if (!cleaned || cleaned.length < 1) return null;

  let normalized = cleaned;
  if (cleaned.includes(',') && cleaned.includes('.')) {
    const lastDot = cleaned.lastIndexOf('.');
    const lastComma = cleaned.lastIndexOf(',');
    const decimalSep = lastDot > lastComma ? '.' : ',';
    normalized = cleaned
      .replace(new RegExp(decimalSep === '.' ? ',' : '\\.', 'g'), '')
      .replace(decimalSep, '.');
  } else {
    normalized = cleaned.replace(',', '.');
  }

  const n = Number(normalized);
  if (!Number.isFinite(n)) return null;
  if (n <= 0 || n > 10000) return null;

  return n;
}

module.exports = { fetchHtml, parseNumber, cheerio };
