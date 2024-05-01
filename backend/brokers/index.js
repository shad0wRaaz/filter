import { getUserSettings } from "../accounts/settings/index.js";
import { connectRedis, disconnetRedis, redisClient } from "../libs/redis/redisClient.js";
import { decryptData } from "../libs/security/crypt.js";
import { API_URL, clientAuthKey } from "../utils/index.js";

const CACHE_DURATION = 600; 

export const getBrokers = async(username, version) => {
    let returnObject = "";
    try{
        await connectRedis();
        const cachedData = await redisClient.get(`brokers_${version}`);
        if(cachedData){ return JSON.parse(cachedData); }

        let user = "";
        const cachedUserSetting = await redisClient.get(`settings_${username}`);
        if(cachedUserSetting) { 
            user = JSON.parse(cachedUserSetting); 
        }
        else {
            user = await getUserSettings(username);
        }

        await disconnetRedis();
        const fetchURL = `${API_URL}/brokers/?mt_version=${version}`;
        const response = await fetch(fetchURL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(
                    decryptData(user.apiKey), 
                    decryptData(user.secretKey)
                ),
            }
        }).then(res => {
            if(res.ok){
                return res.json()
            }
        });
        if(response.result == "success"){

            await connectRedis();
            await redisClient.set(`brokers_${version}`, JSON.stringify(response.data), { EX: CACHE_DURATION, NX: true });
            await disconnetRedis();
        }
        return response;

    }catch(err){

    }

}

export const getBrokerServers = async(username, brokerId) => {
    let returnObject = "";
    try{
        await connectRedis();
        const cachedData = await redisClient.get(`brokerserver_${brokerId}`);
        if(cachedData){ return JSON.parse(cachedData); }

        let user = "";
        const cachedUserSetting = await redisClient.get(`settings_${username}`);
        if(cachedUserSetting) { 
            user = JSON.parse(cachedUserSetting); 
        }
        else {
            user = await getUserSettings(username);
        }

        await disconnetRedis();
        const fetchURL = `${API_URL}/broker-servers?broker_id=${brokerId}`;
        const response = await fetch(fetchURL, {
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(
                    decryptData(user.apiKey), 
                    decryptData(user.secretKey)
                ),
            }
        }).then(res => {
            if(res.ok){
                return res.json()
            }
        });
        if(response.result == "success"){

            await connectRedis();
            await redisClient.set(`brokerserver_${brokerId}`, JSON.stringify(response.data), { EX: CACHE_DURATION, NX: true });
            await disconnetRedis();
            return response?.data;
        }

    }catch(err){
        return null;
    }

}