'use strict';
/**
 * NotesController - Express route handlers for Notes.
 */
const notesService = require('../services/notes');

class NotesController {
  // PUBLIC_INTERFACE
  async list(req, res, next) {
    /** Lists notes with pagination and optional search. */
    try {
      const result = await notesService.list(req.query);
      return res.status(200).json({
        status: 'ok',
        data: result.items,
        meta: { limit: result.limit, offset: result.offset },
      });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async get(req, res, next) {
    /** Gets a note by ID. */
    try {
      const note = await notesService.get(req.params.id);
      return res.status(200).json({ status: 'ok', data: note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async create(req, res, next) {
    /** Creates a new note. */
    try {
      const note = await notesService.create(req.body);
      return res.status(201).json({ status: 'ok', data: note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async update(req, res, next) {
    /** Updates an existing note. */
    try {
      const note = await notesService.update(req.params.id, req.body);
      return res.status(200).json({ status: 'ok', data: note });
    } catch (err) {
      return next(err);
    }
  }

  // PUBLIC_INTERFACE
  async remove(req, res, next) {
    /** Deletes a note by ID. */
    try {
      await notesService.remove(req.params.id);
      return res.status(204).send();
    } catch (err) {
      return next(err);
    }
  }
}

module.exports = new NotesController();
