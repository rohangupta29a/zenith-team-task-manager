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
      connectTimeoutMS: 10000, // 10 seconds timeout
    };

    if (!MONGODB_URI) {
      // In production (e.g. Railway), we should NOT use in-memory DB unless explicitly desired.
      // Most 500 errors on hosting platforms come from MongoMemoryServer failing to start.
      if (process.env.NODE_ENV === "production") {
        throw new Error("MONGODB_URI is not defined in production environment!");
      }

      if (!cached.mongod) {
        try {
          const { MongoMemoryServer } = await import("mongodb-memory-server");
          cached.mongod = await MongoMemoryServer.create();
          console.log("MongoMemoryServer started successfully.");
        } catch (err) {
          console.error("Failed to start MongoMemoryServer:", err);
          throw new Error("Could not start in-memory database.");
        }
      }
      MONGODB_URI = cached.mongod.getUri();
      console.warn("=================================================");
      console.warn("Using in-memory MongoDB since MONGODB_URI is not set!");
      console.warn("Data will be lost on server restart.");
      console.warn("=================================================");
    }

    cached.promise = mongoose.connect(MONGODB_URI, opts).then((mongoose) => {
      console.log("Connected to MongoDB successfully.");
      return mongoose;
    }).catch((err) => {
      console.error("MongoDB connection error:", err);
      cached.promise = null;
      throw err;
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
