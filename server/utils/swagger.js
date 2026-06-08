const swaggerJsDoc = require('swagger-jsdoc');
const swaggerUi = require('swagger-ui-express');

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Shree Ram Dairy API Documentation',
      version: '1.0.0',
      description: 'MERN stack API endpoints for Shree Ram Dairy Sweet Shop. Authenticated via double JWT token cookies.',
      contact: {
        name: 'Developer Support',
        email: 'support@shreeramdairy.com'
      }
    },
    servers: [
      {
        url: 'http://localhost:8000',
        description: 'Development Server'
      }
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT'
        }
      }
    }
  },
  apis: ['./routes/*.js', './server.js'] // files containing annotations
};

const swaggerSpec = swaggerJsDoc(options);

const serveSwagger = (app) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(swaggerSpec));
  console.log('Swagger API documentation ready at http://localhost:8000/api-docs');
};

module.exports = serveSwagger;
