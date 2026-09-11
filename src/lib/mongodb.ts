import mongoose from 'mongoose';

const MONGODB_URI = process.env.MONGODB_URI;

type DatabaseConnection = {
  readyState: number;
  name?: string;
};

const globalWithDatabase = global as typeof globalThis & {
  __wcsDbConnection?: Promise<typeof mongoose> | null;
};

let cachedConnection = globalWithDatabase.__wcsDbConnection ?? null;

export async function connectToDatabase(): Promise<DatabaseConnection | null> {
  if (!MONGODB_URI) {
    return null;
  }

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(MONGODB_URI, {
      dbName: 'wcs_inventory',
    });
    globalWithDatabase.__wcsDbConnection = cachedConnection;
  }

  await cachedConnection;

  return {
    readyState: mongoose.connection.readyState,
    name: mongoose.connection.name,
  };
}

export default connectToDatabase;
