const swaggerJSDoc = require('swagger-jsdoc');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Notes API',
      version: '1.0.0',
      description: 'Production-ready Express API for managing personal notes.',
      contact: {
        name: 'Notes API',
      },
    },
    components: {
      schemas: {
        Note: {
          type: 'object',
          properties: {
            id: { type: 'integer' },
            title: { type: 'string', maxLength: 255 },
            content: { type: 'string' },
            created_at: { type: 'string', format: 'date-time' },
            updated_at: { type: 'string', format: 'date-time' },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.js'], // Path to the API docs
};

const swaggerSpec = swaggerJSDoc(options);
module.exports = swaggerSpec;
