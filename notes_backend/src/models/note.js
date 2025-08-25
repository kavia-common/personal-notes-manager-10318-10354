'use strict';
/**
 * Data access layer for Notes, using Knex.
 */
const { knex } = require('../db/knex');

const TABLE = 'notes';

// PUBLIC_INTERFACE
async function listNotes({ search, limit = 50, offset = 0 } = {}) {
  /** Returns paginated list of notes, optionally filtered by search in title or content. */
  let query = knex(TABLE).select('id', 'title', 'content', 'created_at', 'updated_at').orderBy('id', 'desc');

  if (search && String(search).trim().length > 0) {
    const s = `%${String(search).trim()}%`;
    query = query.where(builder =>
      builder.where('title', 'like', s).orWhere('content', 'like', s)
    );
  }

  if (limit) query.limit(limit);
  if (offset) query.offset(offset);
  return query;
}

// PUBLIC_INTERFACE
async function getNoteById(id) {
  /** Returns a single note by id or null if not found. */
  const note = await knex(TABLE)
    .first('id', 'title', 'content', 'created_at', 'updated_at')
    .where({ id });
  return note || null;
}

// PUBLIC_INTERFACE
async function createNote({ title, content }) {
  /** Creates a note and returns the created record. */
  const [created] = await knex(TABLE)
    .insert({ title, content })
    .returning(['id', 'title', 'content', 'created_at', 'updated_at']);

  // SQLite doesn't support .returning by default; fallback to fetch last inserted row
  if (!created) {
    const [id] = await knex(TABLE).insert({ title, content });
    return getNoteById(id);
  }
  return created;
}

// PUBLIC_INTERFACE
async function updateNote(id, { title, content }) {
  /** Updates a note by id and returns the updated record or null if not found. */
  const exists = await getNoteById(id);
  if (!exists) return null;

  const updatedAt = knex.fn.now();
  const returning = await knex(TABLE)
    .where({ id })
    .update({ title, content, updated_at: updatedAt });

  if (typeof returning === 'number') {
    // SQLite path; fetch the record
    return getNoteById(id);
  }
  // For pg/mysql2 with returning support
  if (Array.isArray(returning) && returning.length > 0) return returning[0];
  return getNoteById(id);
}

// PUBLIC_INTERFACE
async function deleteNote(id) {
  /** Deletes a note by id. Returns true if deleted, false if not found. */
  const deleted = await knex(TABLE).where({ id }).del();
  return deleted > 0;
}

module.exports = {
  listNotes,
  getNoteById,
  createNote,
  updateNote,
  deleteNote,
};
