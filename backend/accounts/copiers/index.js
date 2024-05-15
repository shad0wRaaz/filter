import { API_URL, authKey } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";

const CACHE_DURATION = 600; 

export const getAllCopiers = async() => {

    try{
        // await connectRedis();
        //feed from cache if present
        const cachedCopiers = await redisClient.get("accounts_all_copiers");
        if(cachedCopiers) { return JSON.parse(cachedCopiers); }
        
        const cachedAccounts = JSON.parse(await redisClient.get("accounts_all_with_analysis"));
        if(!cachedAccounts) return [];

        let copiers = [];
        let last_id = 0;
        while(last_id != null){
            const fetchURL = last_id == 0 ? `${API_URL}/copiers` : `${API_URL}/copiers?last_id=${last_id}`;
            const partialCopiers = await fetch(fetchURL, {
                headers: {
                    'Content-Type': 'application/json',
                    'Authorization': authKey,
                }
            }).then(res => res.json());
            
            copiers = [...copiers, ...partialCopiers.data]
            
            last_id = partialCopiers.meta.last_id;
            
            console.log("fetching from: ", partialCopiers.meta.last_id);
        }
        // await connectRedis();
        await redisClient.set("accounts_all_copiers", JSON.stringify(copiers));
        // await disconnetRedis();
        return copiers;
    }catch(err){
        // await disconnetRedis();
        return [];
    }
}

export const saveCopier = async(username) => {
    // const user = await getUserSettings(username);
    // const userAPIKey = decryptData(user.apiKey);
    // const userSecretKey = decryptData(user.secretKey);

    // const response = await fetch(`${API_URL}/copiers/`,{
    //     method: 'POST',
    //     body: JSON.stringify({
    //         "lead_id": 990739,
    //         "follower_id": 990742,
    //         "risk_type": "risk_multiplier_by_balance",
    //         "risk_value": 1
    //     }),
    //     headers: {
    //         "Content-Type": "application/json",
    //         'Authorization': clientAuthKey(userAPIKey, userSecretKey),
    //     }
    // });
    // const result = await response.json()
    // console.log(result)
    // return result;
}