
import { API_URL, authKey } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";

const CACHE_DURATION = 6000; 

export const getAnalysis = async(id, type) => {

    let returnObject = "";
    try{
        // await connectRedis();
        // const cacheData = await redisClient.get(`analysis_${type}_${id}`);
        // if(cacheData) { return JSON.parse(cacheData); }
        // console.log(id,type)

        let fetchURL = "";
        if(type == "normal") { fetchURL = `${API_URL}/analyses/${id}` }
        else if(type == "all") { fetchURL = `${API_URL}/analyses` }
        else if(type == "hours") { fetchURL = `${API_URL}/analyses/${id}/hours` }
        else if(type == "daily") { fetchURL = `${API_URL}/analyses/${id}/dailies` }
        else if(type == "day") { fetchURL = `${API_URL}/analyses/${id}/days` }
        else if(type == "monthly") { fetchURL = `${API_URL}/analyses/${id}/monthlies` }
        else if(type == "monthlysymbol") { fetchURL = `${API_URL}/analyses/${id}/monthly-symbols` }

        const response = await fetch(fetchURL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': authKey,
            }
        });
        returnObject = await response.json();
        //only save non-empty objects
        // if(returnObject.result == "success"){
        //     await redisClient.set(`analysis_${type}_${id}`, JSON.stringify(response), { EX: CACHE_DURATION, NX: true });
        // }

    }catch(err){
        returnObject = err;
    }
    // await disconnetRedis();
    return returnObject;
}