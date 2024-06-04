import { MongoClient } from 'mongodb';

let cachedDb = null;

export const clientPromise = async() => {
  const uri = process.env.NEXT_PUBLIC_MONGODB_URI
  const options = {}

  let client;
  let clientPromise;

  if (process.env.NODE_ENV === 'development') {
    // In development mode, use a global variable so that the value
    // is preserved across module reloads caused by HMR (Hot Module Replacement).
    if (!global._mongoClientPromise) {
      client = new MongoClient(uri, options)
      global._mongoClientPromise = client.connect()
    }
    clientPromise = global._mongoClientPromise
  } else {
    // In production mode, it's best to not use a global variable.
    client = new MongoClient(uri, options)
    clientPromise = client.connect()
  }
}

export const connectToDatabase = async() => {
  if (cachedDb) {
    return cachedDb;
  }

  const client = await MongoClient.connect(process.env.NEXT_PUBLIC_MONGODB_URI);

  const db = client.db(process.env.NEXT_PUBLIC_MONGODB_NAME);

  cachedDb = db;
  return db;
}