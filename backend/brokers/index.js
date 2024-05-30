import { getUserSettings } from "../accounts/settings/index.js";
import { connectRedis, disconnetRedis, redisClient } from "../libs/redis/redisClient.js";
import { decryptData } from "../libs/security/crypt.js";
import { API_URL, clientAuthKey } from "../utils/index.js";

const CACHE_DURATION = 600; 

export const getBrokers = async(email, version) => {
    let returnObject = "";
    try{
        // await connectRedis();
        const cachedData = await redisClient.get(`brokers_${version}`);
        if(cachedData){ return JSON.parse(cachedData); }

        //get user's apikey and secret key

        const user = await getUserSettings(email);

        const userAPIKey = decryptData(user.apiKey);
        const userSecretKey = decryptData(user.secretKey);

        // await disconnetRedis();
        const fetchURL = `${API_URL}/brokers/?mt_version=${version}`;
        const response = await fetch(fetchURL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(
                    userAPIKey, 
                    userSecretKey
                ),
            }
        }).then(res => {
            if(res.ok){
                return res.json()
            }
        });
        if(response.result == "success"){

            // await connectRedis();
            await redisClient.set(`brokers_${version}`, JSON.stringify(response.data));
            // await disconnetRedis();
        }
        return response;

    }catch(err){
        console.log(err);
        return err;
    }

}

export const getBrokerServers = async(email, brokerId) => {
    let returnObject = "";
    try{
        // await connectRedis();
        const cachedData = await redisClient.get(`brokerserver_${brokerId}`);
        if(cachedData){ return JSON.parse(cachedData); }

        //get user's apikey and secret key

        const user = await getUserSettings(email);

        const userAPIKey = decryptData(user.apiKey);
        const userSecretKey = decryptData(user.secretKey);

        // await disconnetRedis();
        const fetchURL = `${API_URL}/broker-servers?broker_id=${brokerId}`;
        const response = await fetch(fetchURL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(
                    userAPIKey, 
                    userSecretKey
                ),
            }
        }).then(res => {
            if(res.ok){
                return res.json()
            }
        });
        if(response.result == "success"){

            // await connectRedis();
            await redisClient.set(`brokerserver_${brokerId}`, JSON.stringify(response.data));
            // await disconnetRedis();
            return response?.data;
        }

    }catch(err){
        return null;
    }

}