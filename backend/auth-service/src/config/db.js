import mongoose from 'mongoose';
import dotenv from 'dotenv';
import logger from '../utils/logger.js';

dotenv.config();

const connectDB = async () => {
  const mongoUri = process.env.MONGO_URI;
  
  if (!mongoUri) {
    logger.error('❌ MONGO_URI is missing. Check your .env file.');
    process.exit(1);
  }

  try {
    await mongoose.connect(mongoUri, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    logger.info('✅ MongoDB Connected...');
  } catch (error) {
    logger.error('❌ MongoDB Connection Error:', error);
    process.exit(1);
  }
};

export default connectDB;
