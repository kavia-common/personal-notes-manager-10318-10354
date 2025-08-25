const path = require('path');
require('dotenv').config({ path: process.env.DOTENV_PATH || path.resolve(__dirname, '../.env') });
const cors = require('cors');
const express = require('express');
const routes = require('./routes');
const swaggerUi = require('swagger-ui-express');
const swaggerSpec = require('../swagger');
const config = require('./config/env');
const { runMigrationsIfNeeded } = require('./db/knex');

// Initialize express app
const app = express();

// Run DB migrations on startup (fire and forget, but log errors)
runMigrationsIfNeeded().catch((e) => {
  // eslint-disable-next-line no-console
  console.error('Database migration failed:', e);
});

// CORS
app.use(cors({
  origin: config.cors.origin.split(',').map(s => s.trim()),
  methods: config.cors.methods.split(',').map(s => s.trim()),
  allowedHeaders: config.cors.allowedHeaders.split(',').map(s => s.trim()),
}));
app.set('trust proxy', true);

// Swagger Docs UI with dynamic server url
app.use('/docs', swaggerUi.serve, (req, res, next) => {
  const host = req.get('host'); // may or may not include port
  let protocol = req.protocol; // http or https

  const actualPort = req.socket.localPort;
  const hasPort = host.includes(':');

  const needsPort =
    !hasPort &&
    ((protocol === 'http' && actualPort !== 80) ||
      (protocol === 'https' && actualPort !== 443));
  const fullHost = needsPort ? `${host}:${actualPort}` : host;
  protocol = req.secure ? 'https' : protocol;

  const dynamicSpec = {
    ...swaggerSpec,
    servers: [
      {
        url: `${protocol}://${fullHost}`,
      },
    ],
    tags: [
      { name: 'Health', description: 'Service health check' },
      { name: 'Notes', description: 'Notes CRUD operations' },
    ],
  };
  swaggerUi.setup(dynamicSpec)(req, res, next);
});

// Body parsers
app.use(express.json({ limit: '1mb' }));
app.use(express.urlencoded({ extended: true }));

// Routes
app.use('/', routes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ status: 'error', message: 'Not Found' });
});

// Error handling middleware
// Note: include status from thrown error when available
// eslint-disable-next-line no-unused-vars
app.use((err, req, res, next) => {
  // eslint-disable-next-line no-console
  console.error(err);
  const status = err.status || 500;
  res.status(status).json({
    status: 'error',
    message: err.message || 'Internal Server Error',
  });
});

module.exports = app;
