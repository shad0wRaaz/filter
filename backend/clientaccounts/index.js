import { API_URL, authKey, clientAuthKey } from "../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../libs/redis/redisClient.js";
import { getUserSettings } from "../accounts/settings/index.js";
import { decryptData } from "../libs/security/crypt.js";

const CACHE_DURATION = 3600; //in seconds


export const getClientAccounts = async (email, limit) => {
    let returnObject = {};
    try{
        // await connectRedis();
        const cachedData = await redisClient.get(`clientaccount_${email}`);

        if(cachedData){ return JSON.parse(cachedData); }

        //get user's apikey and secret key

        const user = await getUserSettings(email);

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

                await redisClient.set(`clientaccount_${email}`, JSON.stringify(returnObject) , { EX: CACHE_DURATION, NX : true });
            }
        }
    }catch(err){
        returnObject = err;
    }
    return returnObject;
}

export const saveClientAccount = async(bodyRequest) => {
    try{
        const email = bodyRequest.email;

        let user = "";
        const cachedData = await redisClient.get(`settings${email}`);
        if(cachedData){ user = JSON.parse(cachedData); }
        else{
            user = await getUserSettings(email);
        }
        
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

export const deleteClientAccount = async(email, accountId) => {
    try{
        //get user's apikey and secret key
        const user = await getUserSettings(email);
        const userAPIKey = decryptData(user.apiKey);
        const userSecretKey = decryptData(user.secretKey);

        const response = await fetch(`${API_URL}/accounts/${accountId}`,{
            method: "DELETE",
            headers: {
                "Content-Type": "application/json",
                'Authorization': clientAuthKey(
                    userAPIKey,
                    userSecretKey
                ),
            }
        }).then(res => res.json());
        await redisClient.del(`clientaccount_${email}`);
        console.log(response);
        return response;

    }catch(err){
        console.log(err);
        return new Error("Error in deleting account.");
    }
}