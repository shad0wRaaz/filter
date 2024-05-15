import { connectToDatabase } from "../../libs/mongodb/mongoClient.js";
import { connectRedis, disconnetRedis, redisClient } from "../../libs/redis/redisClient.js";

const SETTINGS_DB_NAME = process.env.NEXT_PUBLIC_SETTINGS_DB_NAME;

export const getUserSettings = async(username) => {
  let returnObject = "";
  try{
    // await connectRedis();
    const cachedData = await redisClient.get(`settings_${username}`);
    if(cachedData) { return JSON.parse(cachedData); }

    const db = await connectToDatabase();
    const collection = db.collection(SETTINGS_DB_NAME);
    returnObject = await collection.findOne({ username });

    await redisClient.set(`settings_${username}`, JSON.stringify(returnObject));
  }catch(err){
    returnObject  = err;
  }
  // await disconnetRedis();
  return returnObject;
}

export const saveUserKeys = async(username, apiKey, secretKey) => {
  let returnObject = "";
  try{
    const db = await connectToDatabase();
    const collection = db.collection(SETTINGS_DB_NAME);
    
    const item = await collection.insertOne({
        username, secretKey, apiKey, createdAt: new Date(),
    });
    returnObject = item;
  // console.log(item)
  //   if(item.acknowledged == true){
  //       if(item.modifiedCount == 1){
  //       }else{
  //           throw new Error("Unable to save");
  //       }
  //   }
  }catch(err){
    returnObject = err;
  }
  return returnObject;
}