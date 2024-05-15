import { API_URL, authKey, clientAuthKey } from "../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../libs/redis/redisClient.js";
import { getUserSettings } from "../accounts/settings/index.js";
import { decryptData } from "../libs/security/crypt.js";

const CACHE_DURATION = 600; //in seconds


export const getClientAccounts = async (username, limit) => {
    let returnObject = "";
    try{
        // await connectRedis();
        const cachedData = await redisClient.get(`clientaccount_${username}_${limit}`);
        if(cachedData){ return JSON.parse(cachedData); }

        //get user's apikey and secret key
        
        const user = await getUserSettings(username);
        const userAPIKey = decryptData(user.apiKey);
        const userSecretKey = decryptData(user.secretKey);

        const fetchURL = `${API_URL}/accounts?limit=${limit}`;

        const response = await fetch(fetchURL,{
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(userAPIKey, userSecretKey),
            }
        });
        const responseJSON = await response.json();
        if(responseJSON.result == "success"){
            if(responseJSON.data.length > 0){
                const clientAccounts = [...responseJSON.data];
                
                const clientAnalysis = clientAccounts.map(async acc => {
                    //get client analaysis
                    const analysis = fetch(`${API_URL}/analyses/${acc.id}`, {
                        headers:{
                            'Authorization': clientAuthKey(userAPIKey, userSecretKey),
                        }
                    })
                    .then(async res => {
                        if(res.ok){
                            const result = await res.json();
                            let analysisData = result?.data;

                            //calculate other parameters
                            analysisData = {
                                ...analysisData,
                                win_ratio: analysisData.total_trades != 0 && analysisData.total_trades_won != 0 ? Number(analysisData.total_trades_won / analysisData.total_trades * 100).toFixed(2) : 0,
                                risk_reward_ratio_avg: analysisData.average_loss != 0 ? Number(analysisData.average_win / Math.abs(analysisData.average_loss)).toFixed(2) : 0,
                                risk_reward_ratio_worst: analysisData.worst_trade != 0 ? Number(analysisData.average_win / Math.abs(analysisData.worst_trade)).toFixed(2) : 0,
                                drawdown: (Number(acc.balance) - Number(acc.equity)) / Number(acc.balance) * 100,
                            }
                            return ({...acc, ...analysisData});
                        }
                    });
                    return analysis;
                });
                const mergedArray = await Promise.all(clientAnalysis);
                
                // get start date from deposit date
                const depositTrade = mergedArray.map(async acc => {
                    const depositDate = fetch(`${API_URL}/trades?account_id=${acc.id}&order=asc&limit=1`, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': clientAuthKey(userAPIKey, userSecretKey),
                        }
                    }).then(async res => {
                        if(res.ok){
                            const result = await res.json();
                            let tradeData = result?.data;
                            return ({...acc, start_date: tradeData[0].open_time});
                        }
                    });
                    
                    return depositDate;
                });
                
                const mergedArraywithDeposit = await Promise.all(depositTrade);

                returnObject = {...responseJSON, data: mergedArraywithDeposit}

                await redisClient.set(`clientaccount_${username}_${limit}`, JSON.stringify(returnObject) , { EX: CACHE_DURATION, NX : true });
            }
        }
        // await disconnetRedis();
    }catch(err){
        returnObject = err;
        // await disconnetRedis();
    }
    return returnObject;
}

export const saveClientAccount = async(bodyRequest) => {
    try{
        const username = bodyRequest.username;

        let user = "";
        const cachedData = await redisClient.get(`settings${username}`);
        if(cachedData){ user = JSON.parse(cachedData); }
        else{
            user = await getUserSettings(username);
        }

        //get user's apikey and secret key
        

        const bodyObject = {
            "account_name": bodyRequest.account_name,
            "mt_version": Number(bodyRequest.mt_version),
            "account_number": Number(bodyRequest.account_number),
            "password": bodyRequest.password,
            "broker_server_id": Number(bodyRequest.broker_server_id),
        }
        

        const response = await fetch(`${API_URL}/accounts`, {
            method: 'POST',
            body: JSON.stringify(bodyObject),
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(decryptData(user.apiKey), decryptData(user.secretKey)),
            }
        });
        return await response.json();
    }catch(err){
        return err
    }
    
}
// export const saveAccount = async(body) => {
//     try{
//         // const bodyObject = {
//         //     "account_name": bodyRequest.account,
//         //     "mt_version": Number(bodyRequest.version),
//         //     "account_number": Number(bodyRequest.number),
//         //     "password": bodyRequest.password,
//         //     "broker_server_id": Number(bodyRequest.server),
//         // }
//         console.log("asdf", body)
//         const response = await fetch(`${API_URL}/accounts`, {
//             method: 'POST',
//             body: JSON.stringify(body),
//             headers: {
//                 "Content-Type": "application/json",
//                 'Authorization': clientAuthKey(userAPIKey, userSecretKey),
//             }
//         }).then(res => res.json())
//             .catch(err => console.log(err));
//         console.log(response)
//         return await response.json();
//     }catch(err){
//         return err
//     }
    
// }