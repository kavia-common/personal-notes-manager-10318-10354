const express = require('express');
const healthController = require('../controllers/health');
const swaggerSpec = require('../../swagger');
const notesRoutes = require('./notes');

const router = express.Router();

// Health endpoint
/**
 * @swagger
 * tags:
 *   - name: Health
 *     description: Service health check
 */

/**
 * @swagger
 * /:
 *   get:
 *     tags: [Health]
 *     summary: Health endpoint
 *     responses:
 *       200:
 *         description: Service health check passed
 *         content:
 *           application/json:
 *             schema:
 *               type: object
 *               properties:
 *                 status:
 *                   type: string
 *                   example: ok
 *                 message:
 *                   type: string
 *                   example: Service is healthy
 *                 timestamp:
 *                   type: string
 *                   format: date-time
 *                 environment:
 *                   type: string
 *                   example: development
 */
router.get('/', healthController.check.bind(healthController));

// OpenAPI JSON endpoint
router.get('/openapi.json', (req, res) => {
  res.setHeader('Content-Type', 'application/json');
  res.send(swaggerSpec);
});

// Notes routes
router.use('/api/notes', notesRoutes);

module.exports = router;
