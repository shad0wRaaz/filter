import { connectToDatabase } from '../libs/mongodb/mongoClient.js';
const db = await connectToDatabase();

export const getSessions = async() => {
    let returnObject = "";
    try{
        const collection = db.collection("Sessions");

        const returnObject = await collection.find().toArray();
        return returnObject;
    }catch(err){
        console.log("error", err)
        returnObject = err;
    }
    return returnObject;
}