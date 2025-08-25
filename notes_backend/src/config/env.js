'use strict';
/**
 * PUBLIC_INTERFACE
 * getConfig
 * This module centralizes environment variable access and defaults.
 * It loads .env using dotenv (handled at app bootstrap) and exposes typed config values.
 */
const path = require('path');

// Automatically load .env from container root when this module is imported in server/app.
require('dotenv').config({
  path: process.env.DOTENV_PATH || path.resolve(__dirname, '../../.env'),
});

const config = {
  nodeEnv: process.env.NODE_ENV || 'development',
  port: parseInt(process.env.PORT || '3000', 10),
  host: process.env.HOST || '0.0.0.0',

  // Database config
  db: {
    client: (process.env.DB_CLIENT || 'sqlite3').toLowerCase(), // sqlite3 or pg or mysql2
    // For SQLite we use DB_SQLITE_FILENAME; for others, use DB_HOST etc.
    sqliteFilename: process.env.DB_SQLITE_FILENAME || path.resolve(__dirname, '../../data/notes.sqlite'),
    host: process.env.DB_HOST,
    port: process.env.DB_PORT ? parseInt(process.env.DB_PORT, 10) : undefined,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
    // Connection string if preferred
    connectionString: process.env.DB_URL || process.env.DATABASE_URL,
    // Migrations/Seeds
    runMigrationsOnStart: (process.env.DB_RUN_MIGRATIONS || 'true').toLowerCase() === 'true',
  },
  // CORS
  cors: {
    origin: process.env.CORS_ORIGIN || '*',
    methods: process.env.CORS_METHODS || 'GET,POST,PUT,DELETE,PATCH,OPTIONS',
    allowedHeaders: process.env.CORS_ALLOWED_HEADERS || 'Content-Type,Authorization',
  },
};

module.exports = config;
