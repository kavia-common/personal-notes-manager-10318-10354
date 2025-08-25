'use strict';
/**
 * Sets up a Knex instance based on environment configuration.
 * Supports sqlite3 (default), pg, and mysql2 clients.
 */
const fs = require('fs');
const path = require('path');
const knexLib = require('knex');
const config = require('../config/env');

function resolveConnection() {
  const client = config.db.client;
  if (config.db.connectionString) {
    return config.db.connectionString;
  }

  if (client === 'sqlite3') {
    // Ensure data directory exists
    const file = config.db.sqliteFilename;
    const dir = path.dirname(file);
    if (!fs.existsSync(dir)) {
      fs.mkdirSync(dir, { recursive: true });
    }
    return {
      filename: file,
    };
  }

  // Generic connection for pg/mysql2
  return {
    host: config.db.host,
    port: config.db.port,
    user: config.db.user,
    password: config.db.password,
    database: config.db.database,
  };
}

const knex = knexLib({
  client: config.db.client,
  connection: resolveConnection(),
  useNullAsDefault: config.db.client === 'sqlite3',
  pool: {
    min: 1,
    max: 10,
  },
  migrations: {
    tableName: '_migrations',
    directory: path.resolve(__dirname, 'migrations'),
  },
});

// PUBLIC_INTERFACE
async function runMigrationsIfNeeded() {
  /** Runs database migrations at startup if enabled by config. */
  if (!config.db.runMigrationsOnStart) return;
  // Create migrations directory if missing when using programmatic migrations
  const migDir = path.resolve(__dirname, 'migrations');
  if (!fs.existsSync(migDir)) fs.mkdirSync(migDir, { recursive: true });

  // Ensure baseline table exists by creating first migration on the fly if directory empty
  const files = fs.readdirSync(migDir).filter(f => f.endsWith('.js'));
  if (files.length === 0) {
    const baseline = `'use strict';
/**
 * Initial migration to create notes table.
 */
exports.up = async function(knex) {
  const exists = await knex.schema.hasTable('notes');
  if (!exists) {
    await knex.schema.createTable('notes', (table) => {
      table.increments('id').primary();
      table.string('title', 255).notNullable();
      table.text('content').notNullable();
      table.timestamps(true, true); // created_at, updated_at
    });
  }
};

exports.down = async function(knex) {
  await knex.schema.dropTableIfExists('notes');
};
`;
    fs.writeFileSync(path.join(migDir, '0001_init_notes.js'), baseline, 'utf8');
  }

  await knex.migrate.latest();
}

module.exports = {
  knex,
  runMigrationsIfNeeded,
};
