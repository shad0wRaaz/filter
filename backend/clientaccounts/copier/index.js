import { API_URL, clientAuthKey } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";
import { decryptData } from "../../libs/security/crypt.js";
import { getUserSettings } from "../../accounts/settings/index.js";

const CACHE_DURATION = 600; 

export const getCopier = async() => {

}

export const saveCopier = async(username) => {
    const user = await getUserSettings(username);
    const userAPIKey = decryptData(user.apiKey);
    const userSecretKey = decryptData(user.secretKey);

    const response = await fetch(`${API_URL}/copiers/`,{
        method: 'POST',
        body: JSON.stringify({
            "lead_id": 990739,
            "follower_id": 990742,
            "risk_type": "risk_multiplier_by_balance",
            "risk_value": 1
        }),
        headers: {
            "Content-Type": "application/json",
            'Authorization': clientAuthKey(userAPIKey, userSecretKey),
        }
    });
    const result = await response.json()
    console.log(result)
    return result;
}