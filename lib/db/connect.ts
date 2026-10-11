import mongoose from "mongoose";

interface MongooseCache {
  conn: typeof mongoose | null;
  promise: Promise<typeof mongoose> | null;
}

/**
 * Next.js hot-reloads server modules in dev and reuses warm lambdas in
 * production, both of which would open a fresh pool on every module
 * evaluation. Caching the connection (and the in-flight promise) on
 * `globalThis` keeps exactly one pool per process.
 */
const globalWithMongoose = globalThis as typeof globalThis & {
  __mongooseCache?: MongooseCache;
};

const cache: MongooseCache = (globalWithMongoose.__mongooseCache ??= {
  conn: null,
  promise: null,
});

export async function connectToDatabase(): Promise<typeof mongoose> {
  if (cache.conn) return cache.conn;

  const uri = process.env.MONGODB_URI;
  if (!uri) {
    throw new Error(
      "Missing MONGODB_URI. Copy `.env.example` to `.env.local` and fill it in.",
    );
  }

  cache.promise ??= mongoose.connect(uri, {
    dbName: process.env.MONGODB_DB ?? "a_pes_studio",
    // Fail fast instead of queueing operations against a dead connection —
    // a hung request is much harder to debug than an explicit error.
    bufferCommands: false,
  });

  try {
    cache.conn = await cache.promise;
  } catch (error) {
    // Do not keep a rejected promise around, otherwise every later call
    // replays the same failure without ever retrying.
    cache.promise = null;
    throw error;
  }

  return cache.conn;
}
