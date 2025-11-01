const app = require('./server');
const { startPoller } = require('./services/quoteService');
const { PORT } = require('./config');

startPoller();

app.listen(PORT, () => {
  const host = process.env.RENDER_EXTERNAL_URL || `http://localhost:${PORT}`;
  console.log(`✅ Backend-exchange running at: ${host}`);
});
