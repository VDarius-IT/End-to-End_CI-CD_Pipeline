const express = require('express');

const app = express();
const port = process.env.PORT || 3000;

app.use(express.json());

// Basic root route
app.get('/', (req, res) => {
  res.json({ ok: true, message: 'Backend is running' });
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({
    status: 'ok',
    uptimeSeconds: Math.round(process.uptime()),
    timestamp: Date.now(),
  });
});

const server = app.listen(port, () => {
  // eslint-disable-next-line no-console
  console.log(`Backend listening at http://localhost:${port}`);
});

module.exports = server;