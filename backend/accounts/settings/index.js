import { connectToDatabase } from "../../libs/mongodb/mongoClient.js";
import { connectRedis, disconnetRedis, redisClient } from "../../libs/redis/redisClient.js";

const SETTINGS_DB_NAME = process.env.NEXT_PUBLIC_SETTINGS_DB_NAME;

export const getUserSettings = async(email) => {
  let returnObject = {};
  try{
    // await connectRedis();
    const cachedData = await redisClient.get(`settings_${email}`);
    if(cachedData) { return JSON.parse(cachedData); }
    
    const db = await connectToDatabase();
    const collection = db.collection(SETTINGS_DB_NAME);
    returnObject = await collection.findOne({ email });
    
    if(returnObject){
      await redisClient.set(`settings_${email}`, JSON.stringify(returnObject));
    }else{
      returnObject = {};
    }
  }catch(err){
    returnObject  = err;
  }
  // await disconnetRedis();
  return returnObject;
}

export const saveUserKeys = async(email, apiKey, secretKey) => {
  let returnObject = {};
  if(!email || !apiKey || !secretKey){
    return returnObject;
  }
  try{
    const db = await connectToDatabase();
    const collection = db.collection(SETTINGS_DB_NAME);
    const existingSetting = await collection.findOne({ email });

    let item = {};
    if(!existingSetting){
      item = await collection.insertOne({
          email, secretKey, apiKey, createdAt: new Date(),
        });

    }else {
      item = await collection.updateOne(
        { email }, 
        {
         $set: {
             secretKey, 
             apiKey
         }
        }
     );
    await redisClient.del(`settings_${email}`);
    }
    
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