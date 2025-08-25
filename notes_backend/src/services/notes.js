'use strict';
/**
 * Notes Service encapsulating business logic between controllers and models.
 */
const notesModel = require('../models/note');
const { validateNotePayload } = require('../utils/validation');

// PUBLIC_INTERFACE
async function list(query) {
  /** Returns paginated, optionally filtered notes list. */
  const limit = Math.min(parseInt(query.limit || '50', 10), 100);
  const offset = Math.max(parseInt(query.offset || '0', 10), 0);
  const search = query.search;
  const items = await notesModel.listNotes({ search, limit, offset });
  return { items, limit, offset };
}

// PUBLIC_INTERFACE
async function get(id) {
  /** Returns one note by id, throws if invalid id. */
  const nid = parseInt(id, 10);
  if (Number.isNaN(nid) || nid <= 0) {
    const err = new Error('Invalid note id');
    err.status = 400;
    throw err;
  }
  const note = await notesModel.getNoteById(nid);
  if (!note) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  return note;
}

// PUBLIC_INTERFACE
async function create(body) {
  /** Creates a note from payload after validation. */
  const { valid, errors } = validateNotePayload(body);
  if (!valid) {
    const err = new Error(`Validation error: ${errors.join(', ')}`);
    err.status = 400;
    throw err;
  }
  const note = await notesModel.createNote({
    title: body.title.trim(),
    content: body.content.trim(),
  });
  return note;
}

// PUBLIC_INTERFACE
async function update(id, body) {
  /** Updates a note by id after validation. */
  const nid = parseInt(id, 10);
  if (Number.isNaN(nid) || nid <= 0) {
    const err = new Error('Invalid note id');
    err.status = 400;
    throw err;
  }

  const { valid, errors } = validateNotePayload(body, { partial: false });
  if (!valid) {
    const err = new Error(`Validation error: ${errors.join(', ')}`);
    err.status = 400;
    throw err;
  }

  const updated = await notesModel.updateNote(nid, {
    title: body.title.trim(),
    content: body.content.trim(),
  });
  if (!updated) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  return updated;
}

// PUBLIC_INTERFACE
async function remove(id) {
  /** Deletes a note by id. */
  const nid = parseInt(id, 10);
  if (Number.isNaN(nid) || nid <= 0) {
    const err = new Error('Invalid note id');
    err.status = 400;
    throw err;
  }
  const ok = await notesModel.deleteNote(nid);
  if (!ok) {
    const err = new Error('Note not found');
    err.status = 404;
    throw err;
  }
  return true;
}

module.exports = {
  list,
  get,
  create,
  update,
  remove,
};
