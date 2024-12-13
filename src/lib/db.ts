import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI as string;

if (!MONGODB_URI) {
  throw new Error('Please define the MONGODB_URI environment variable inside .env.local');
}
mongoose.set('strictQuery', false);

interface MongooseCache {
  conn: mongoose.Connection | null;
  promise: Promise<mongoose.Connection> | null;
}

// Global cache to avoid multiple connections
declare global {
  var mongoose: MongooseCache;
}

// Ensure the cache is defined globally
global.mongoose = global.mongoose || { conn: null, promise: null };

async function connectToDatabase(): Promise<mongoose.Connection> {
  if (global.mongoose.conn) {
    return global.mongoose.conn;
  }

  if (!global.mongoose.promise) {
    const opts = {
      bufferCommands: false,
    };

    global.mongoose.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose.connection;
    });
  }

  try {
    global.mongoose.conn = await global.mongoose.promise;
  } catch (error) {
    global.mongoose.promise = null; // Reset the promise in case of failure
    throw error;
  }

  return global.mongoose.conn;
}

export default connectToDatabase;
