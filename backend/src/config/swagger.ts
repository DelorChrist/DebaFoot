import swaggerJsDoc from 'swagger-jsdoc';

const options: swaggerJsDoc.Options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'DebaFoot API',
      version: '1.0.0',
      description: 'API REST pour le réseau social de débats footballistiques DebaFoot',
    },
    servers: [
      { url: 'http://localhost:5000', description: 'Serveur de développement' },
    ],
    components: {
      securitySchemes: {
        bearerAuth: {
          type: 'http',
          scheme: 'bearer',
          bearerFormat: 'JWT',
        },
      },
    },
    security: [{ bearerAuth: [] }],
  },
  apis: ['./src/features/**/*.routes.ts'],
};

export const swaggerSpec = swaggerJsDoc(options);
