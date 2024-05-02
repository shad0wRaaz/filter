import { API_URL, authKey } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";
import { decryptData } from "../../libs/security/crypt.js";
import { getUserSettings } from "../../accounts/settings/index.js";

const CACHE_DURATION = 600; 

export const getLeadFollowerArray = async() => {
    // let lastId = 0;
    // let copiers = [];
    // while(lastId != null){
    //     const fetchURL = lastId == 0 ? `${API_URL}/copiers` : `${API_URL}/copiers?&last_id=${lastId}`;
    //     const response = await fetch(`${API_URL}/copiers/`,{
    //         method: 'GET',
    //         headers: {
    //             "Content-Type": "application/json",
    //             'Authorization': authKey,
    //         }
    //     })
    //     const responseJSON = await response.json();
    //     if(responseJSON.result == "success" && responseJSON.data.length > 0){
    //         copiers = [...copiers, ...responseJSON.data]
    //         console.log("Fetching after Id ", responseJSON.meta.last_id);
    //         lastId = responseJSON.meta.last_id;
    //     }else{
    //         lastId = null;
    //     }
    // }
    // return copiers;
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