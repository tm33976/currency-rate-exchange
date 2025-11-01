const express = require('express');
const router = express.Router();
const { getQuotes } = require('../services/quoteService');
const { computeAverage, computeSlippage } = require('../services/averageService');

// GET /quotes?currency=ARS or BRL (default ARS)
router.get('/quotes', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  try {
    const quotes = await getQuotes(currency);
    res.json(quotes);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/average', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  try {
    const quotes = await getQuotes(currency);
    const average = computeAverage(quotes);
    res.json(average);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

router.get('/slippage', async (req, res) => {
  const currency = (req.query.currency || 'ARS').toUpperCase();
  try {
    const quotes = await getQuotes(currency);
    const average = computeAverage(quotes);
    const slippage = computeSlippage(quotes, average);
    res.json(slippage);
  } catch (e) {
    res.status(500).json({ error: e.message });
  }
});

module.exports = router;
