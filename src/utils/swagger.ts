import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';
import { Request, Response } from 'express';

const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Appeal System API',
      version: '1.0.0',
      description: 'API для управления обращениями',
    },
    servers: [
      {
        url: 'http://localhost:3000/api',
        description: 'Local server',
      },
    ],
    components: {
      schemas: {
        Appeal: {
          type: 'object',
          properties: {
            id: {
              type: 'integer',
              example: 1,
            },
            topic: {
              type: 'string',
              example: 'Проблема с доступом',
            },
            text: {
              type: 'string',
              example: 'Не могу войти в систему',
            },
            status: {
              type: 'string',
              enum: ['Новое', 'В работе', 'Завершено', 'Отменено'],
              example: 'Новое',
            },
            resolution: {
              type: 'string',
              example: 'Проблема решена',
            },
            cancellationReason: {
              type: 'string',
              example: 'Обращение дублируется',
            },
            createdAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z',
            },
            updatedAt: {
              type: 'string',
              format: 'date-time',
              example: '2023-10-01T12:00:00Z',
            },
          },
        },
      },
    },
  },
  apis: ['./src/routes/*.ts'], 
};

const specs = swaggerJsdoc(options);

export const swaggerSetup = (app: any) => {
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(specs));
  app.get('/api-docs.json', (req: Request, res: Response) => {
    res.setHeader('Content-Type', 'application/json');
    res.send(specs);
  });
};