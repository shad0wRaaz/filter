import { API_URL, authKey, clientAuthKey } from "../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../libs/redis/redisClient.js";

const CACHE_DURATION = 600; //in seconds


export const getAccounts = async (limit, lastId) => {
    let returnObject = "";
    try{
        // await connectRedis();
        const cachedData = await redisClient.get(`accounts_${limit}_${lastId}`);
        if(cachedData){ return JSON.parse(cachedData); }

        const fetchURL = lastId == 0 ? `${API_URL}/accounts?order=asc&limit=${limit}` : `${API_URL}/accounts?limit=${limit}&last_id=${lastId}`;
        const response = await fetch(fetchURL,{
            headers: {
                "Content-Type": "application/json",
                'Authorization': authKey,
            }
        });
        const responseJSON = await response.json();
        // console.log(responseJSON)

        if(responseJSON.result == "success"){
            if(responseJSON?.data.length > 0){
                const clientAccounts = responseJSON?.data?.filter(acc => acc.status == "connection_ok");

                const clientAnalysis = clientAccounts.map(async acc => {
                    //get client analaysis
                    const analysis = fetch(`${API_URL}/analyses/${acc.id}`, {
                        headers:{
                            'Authorization': authKey,
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
                        }else{
                            return res
                        }
                    }).catch(err => console.log(err));
                    return analysis;
                });
                const mergedArray = await Promise.all(clientAnalysis);
                // get start date from deposit date
                const depositTrade = mergedArray.map(async acc => {
                    const fetchURL = `${API_URL}/trades/account_id=${acc.id}?limit=5`;
                    const depositDate = fetch(fetchURL, {
                        headers: {
                            "Content-Type": "application/json",
                            'Authorization': authKey,
                        }
                    }).then(async res => {
                        if(res.ok){
                            const result = await res.json();
                            let tradeData = result?.data;
                            return ({...acc, start_date: tradeData});
                        }
                    });
                    return depositDate;
                });
                
                const mergedArraywithDeposit = await Promise.all(depositTrade);
                
                returnObject = {...responseJSON, data: mergedArraywithDeposit}

                // await redisClient.set(`accounts_${limit}_${lastId}`, JSON.stringify(returnObject) , { EX: CACHE_DURATION, NX : true });
            }
        }

        // await disconnetRedis();
    }catch(err){
        returnObject = err;
        // await disconnetRedis();
    }
    return returnObject;
}