import express, { Express, Request, Response } from 'express';
import dotenv from 'dotenv';
import swaggerJsdoc from 'swagger-jsdoc';
import swaggerUi from 'swagger-ui-express';

dotenv.config();

const app: Express = express();
const port = process.env.PORT || 3000;

// swagger
const options = {
  definition: {
    openapi: '3.0.0',
    info: {
      title: 'Express API with Swagger',
      version: '0.1.0',
      description:
        'This is the Dental Clinic application made with Express and documented with Swagger',
    },
    servers: [
      {
        url: port,
      },
    ],
  },
  apis: ['./routes/*.ts'],
};

const specs = swaggerJsdoc(options);
app.use(
  '/api-docs',
  swaggerUi.serve,
  swaggerUi.setup(specs, { explorer: true })
);

app.get('/', (req: Request, res: Response) => {
  res.send('Hello, World!');
});

app.listen(port, () => {
  console.log(`⚡️[server]: Server is running at http://localhost:${port}`);
});