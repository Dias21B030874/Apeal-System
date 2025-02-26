import express from 'express';
import cors from 'cors';
import bodyParser from 'body-parser';
import sequelize from './utils/database';
import appealRoutes from './routes/appealRoutes';
import { errorHandler } from './middlware/errorHandler';
import { swaggerSetup } from './utils/swagger';

const app = express();
const PORT = process.env.PORT

swaggerSetup(app);

app.use(cors());
app.use(bodyParser.json());

app.use('/api', appealRoutes);
app.use(errorHandler);


sequelize
  .authenticate() 
  .then(() => {
    console.log('Database connection established');
    return sequelize.sync({ alter: true }); 
  })
  .then(() => {
    console.log('Database synced');
    app.listen(PORT, () => {
      console.log(`Server is running on port ${PORT}`);
    });
  })
  .catch((err) => {
    console.error('Unable to connect to the database:', err);
  });