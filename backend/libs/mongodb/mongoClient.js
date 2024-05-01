import { MongoClient } from 'mongodb';

let cachedDb = null;

export const connectToDatabase = async() => {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);

  const db = client.db(process.env.NEXT_PUBLIC_MONGODB_NAME);

  cachedDb = db;
  return db;
}