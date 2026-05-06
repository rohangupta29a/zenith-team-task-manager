import mongoose from "mongoose";

let MONGODB_URI = process.env.MONGODB_URI;

/**
 * Global cache for the MongoDB connection to prevent
 * multiple connections in development (hot reload).
 */
let cached = global.mongoose;

if (!cached) {
  cached = global.mongoose = { conn: null, promise: null, mongod: null };
}

async function dbConnect() {
  if (cached.conn) {
    return cached.conn;
  }

  if (!cached.promise) {
    const opts = {
      bufferCommands: false,
    };

    if (!MONGODB_URI) {
      if (!cached.mongod) {
        const { MongoMemoryServer } = await import("mongodb-memory-server");
        cached.mongod = await MongoMemoryServer.create();
      }
      MONGODB_URI = cached.mongod.getUri();
      console.warn("=================================================");
      console.warn("Using in-memory MongoDB since MONGODB_URI is not set!");
      console.warn("Data will be lost on server restart.");
      console.warn("=================================================");
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      return mongoose;
    });
  }

  try {
    cached.conn = await cached.promise;
  } catch (e) {
    cached.promise = null;
    throw e;
  }

  return cached.conn;
}

export default dbConnect;
