'use strict';
/**
 * Simple validation helpers.
 */

// PUBLIC_INTERFACE
function validateNotePayload(body, { partial = false } = {}) {
  /**
   * Validates note payload with fields: title (string, 1..255), content (string, 1..)
   * If partial=true, allows missing fields (for PATCH-like updates), but validates present ones.
   * Returns { valid: boolean, errors: string[] }
   */
  const errors = [];

  if (!partial || (partial && Object.prototype.hasOwnProperty.call(body, 'title'))) {
    if (typeof body.title !== 'string' || body.title.trim().length === 0) {
      errors.push('title is required and must be a non-empty string');
    } else if (body.title.length > 255) {
      errors.push('title must be at most 255 characters');
    }
  }

  if (!partial || (partial && Object.prototype.hasOwnProperty.call(body, 'content'))) {
    if (typeof body.content !== 'string' || body.content.trim().length === 0) {
      errors.push('content is required and must be a non-empty string');
    }
  }

  return { valid: errors.length === 0, errors };
}

module.exports = {
  validateNotePayload,
};
