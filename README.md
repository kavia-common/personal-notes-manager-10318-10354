# personal-notes-manager-10318-10354

Notes Backend (Express + SQLite by default)

- Framework: Express
- Features: Notes CRUD (create, read, update, delete)
- DB: SQLite by default (via Knex). Supports pg/mysql2 with env configuration.
- API Docs: Swagger UI at /docs, OpenAPI JSON at /openapi.json

Getting started

1) Install dependencies
   - Navigate to notes_backend
   - Install packages
     npm install

2) Configure environment
   - Copy .env.example to .env
     cp .env.example .env
   - Adjust values as needed. Default uses SQLite at ./data/notes.sqlite

3) Run in development
   npm run dev

4) Run in production
   npm start

5) Database migrations
   - Migrations run automatically on startup (DB_RUN_MIGRATIONS=true).
   - You can also trigger manually:
     npm run migrate

Environment variables (in notes_backend/.env)

- PORT, HOST, NODE_ENV
- CORS_ORIGIN, CORS_METHODS, CORS_ALLOWED_HEADERS
- DB_CLIENT (sqlite3|pg|mysql2)
- DB_SQLITE_FILENAME (when sqlite3)
- Alternatively DB_URL or DB_HOST/DB_PORT/DB_USER/DB_PASSWORD/DB_NAME
- DB_RUN_MIGRATIONS (true|false)

API Endpoints

- Health: GET /
- Notes:
  - GET /api/notes?search=&limit=&offset=
  - GET /api/notes/:id
  - POST /api/notes  body: { title: string (<=255), content: string }
  - PUT /api/notes/:id  body: { title: string (<=255), content: string }
  - DELETE /api/notes/:id

Swagger

- UI: /docs
- JSON: /openapi.json

Project Structure

notes_backend/
  src/
    app.js            # Express app, middleware, docs
    server.js         # Entrypoint and graceful shutdown
    config/
      env.js          # Environment configuration
    db/
      knex.js         # Knex initialization and migrations
      migrations/     # Auto-populated initial migration
    controllers/
      health.js
      notes.js
    models/
      note.js
    routes/
      index.js        # Health, openapi.json, and route mounting
      notes.js        # Notes CRUD endpoints
    services/
      health.js
      notes.js
    utils/
      validation.js
  swagger.js
  .env.example

Instructions for advanced DBs

- To use Postgres:
  - npm install pg
  - Set DB_CLIENT=pg and DB_URL=postgres://user:pass@host:5432/db
  - Or set DB_HOST, DB_PORT, DB_USER, DB_PASSWORD, DB_NAME

- To use MySQL:
  - npm install mysql2
  - Set DB_CLIENT=mysql2 and analogous env vars

Security and production notes

- Ensure proper CORS restrictions in production (set CORS_ORIGIN to allowed origins).
- Consider adding request logging (morgan) and security headers (helmet).
- Add authentication/authorization if needed.
- Backup SQLite file or use managed DB in production.