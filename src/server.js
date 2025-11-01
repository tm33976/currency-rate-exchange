const express = require('express');
const quotesRouter = require('./routes/quotes');
const app = express();

app.use(express.json());
app.use('/', quotesRouter);

// health
app.get('/health', (req, res) => res.json({ status: 'ok', now: Date.now() }));

module.exports = app;
