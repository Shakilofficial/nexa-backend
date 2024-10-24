import dotenv from 'dotenv';
import { app } from './app';
import connectDB from './config/db';

dotenv.config({
  path: './.env',
});

connectDB()
  .then(() => {
    app.listen(process.env.PORT || 8000, () => {
      console.log(`🌐 Server is running at Port: ${process.env.PORT}`);
    });
  })
  .catch((err) => {
    console.log('MongoDB connection failed !!!', err);
    process.exit(1); // Exit on MongoDB failure
  });
