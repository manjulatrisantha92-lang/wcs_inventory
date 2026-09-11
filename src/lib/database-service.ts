export type CollectionName =
  | 'tenants'
  | 'users'
  | 'customers'
  | 'products'
  | 'invoices'
  | 'workshop'
  | 'backups';

export type ServiceResult<T> = {
  success: boolean;
  data?: T;
  error?: string;
};

type MongoDbLike = {
  close?: () => Promise<void>;
  collection: (name: string) => Record<string, unknown>;
};

type MongooseModule = {
  connect: (uri: string, options?: Record<string, unknown>) => Promise<unknown>;
  connection: { readyState: number; db?: MongoDbLike };
};

export interface DatabaseService {
  connect(): Promise<boolean>;
  disconnect(): Promise<void>;
  findMany<T>(collection: CollectionName, filter?: Record<string, unknown>): Promise<T[]>;
  findOne<T>(collection: CollectionName, filter: Record<string, unknown>): Promise<T | null>;
  createOne<T>(collection: CollectionName, document: T): Promise<T>;
  updateOne<T>(collection: CollectionName, filter: Record<string, unknown>, update: Partial<T>): Promise<T | null>;
  deleteOne(collection: CollectionName, filter: Record<string, unknown>): Promise<boolean>;
}

function getMongoose(): MongooseModule | null {
  try {
    const loaded = require('mongoose') as MongooseModule;
    return loaded ?? null;
  } catch {
    return null;
  }
}

export async function createDatabaseService(): Promise<DatabaseService> {
  const uri = process.env.MONGODB_URI;
  const mongoose = getMongoose();

  if (!uri || !mongoose) {
    return {
      async connect() {
        return false;
      },
      async disconnect() {
        return;
      },
      async findMany<T>() {
        return [] as T[];
      },
      async findOne<T>() {
        return null as T | null;
      },
      async createOne<T>(_: CollectionName, document: T): Promise<T> {
        return document;
      },
      async updateOne<T>(_: CollectionName, __: Record<string, unknown>, update: Partial<T>): Promise<T | null> {
        return (update as unknown) as T;
      },
      async deleteOne() {
        return true;
      },
    };
  }

  await mongoose.connect(uri, {
    dbName: 'wcs_inventory',
  });

  return {
    async connect() {
      return mongoose.connection.readyState === 1;
    },
    async disconnect() {
      if (mongoose.connection.readyState !== 0) {
        const db = mongoose.connection.db as MongoDbLike | undefined;
        await db?.close?.();
      }
    },
    async findMany(collection) {
      if (!mongoose.connection.db) {
        return [];
      }

      return (await (mongoose.connection.db as any)
        .collection(collection)
        .find({})
        .toArray()) as unknown[] as any[];
    },
    async findOne(collection, filter) {
      if (!mongoose.connection.db) {
        return null;
      }

      return (await (mongoose.connection.db as any)
        .collection(collection)
        .findOne(filter)) as any;
    },
    async createOne(collection, document) {
      if (!mongoose.connection.db) {
        return document;
      }

      await (mongoose.connection.db as any).collection(collection).insertOne(document as any);
      return document;
    },
    async updateOne(collection, filter, update) {
      if (!mongoose.connection.db) {
        return null;
      }

      const result = await (mongoose.connection.db as any)
        .collection(collection)
        .findOneAndUpdate(filter, { $set: update }, { returnDocument: 'after' });

      return (result?.value ?? null) as any;
    },
    async deleteOne(collection, filter) {
      if (!mongoose.connection.db) {
        return false;
      }

      const result = await (mongoose.connection.db as any).collection(collection).deleteOne(filter);
      return result.deletedCount > 0;
    },
  };
}
