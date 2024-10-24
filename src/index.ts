import dotenv from 'dotenv';
import { app } from './app';
import connectDB from './config/db';

dotenv.config({
  path: './.env',
});

const port = process.env.PORT || 8000; 

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🌐 Server is running at Port: ${port}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed !!!', err);
    process.exit(1);
  });
