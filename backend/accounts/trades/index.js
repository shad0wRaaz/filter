import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";
import { API_URL, authKey } from "../../utils/index.js";

const CACHE_DURATION = 6000;

export const getTrades = async(accountId) => {

    let returnObject = "";
    try{
        // await connectRedis();
        const cacheData = await redisClient.get(`trades_${accountId}`);
        if(cacheData) { 
            // await disconnetRedis();
            const parsedData = JSON.parse(cacheData)
            return ({...parsedData, cache: true}); 
        }

        returnObject = await fetch(`${API_URL}/trades?account_id=${accountId}&order=desc`, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': authKey,
            }
        })
        .then(async res => {
            if(res.ok){
                const result = await res.json()
                //only save non-empty objects
                if(result.result == "success" && result.data.length > 0){
                    await redisClient.set(`trades_${accountId}`, JSON.stringify(result), { EX: CACHE_DURATION, NX: true });
                }
                // await disconnetRedis();
                return ({...result, cache: false});
            }
            // await disconnetRedis();
            return null;
        })
        .catch(async err => {
            // await disconnetRedis();
            console.log(err)
        });
        

        
    }catch(err){
        returnObject = err;
        // await disconnetRedis();
    }
    return returnObject;
}