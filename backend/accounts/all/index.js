import { API_URL, authKey, clientAuthKey, processPromisesInBatchesWithDelay } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";
import { getUserSettings } from "../settings/index.js";
import { decryptData } from "../../libs/security/crypt.js";


export const getAllAccounts = async (lastId) => {
    let returnObject = "";

    try{
        await connectRedis();
        const cacheAnalysis = await redisClient.get("accounts_all_with_analysis");

        // const depositTrade = cacheAnalysis.map(async acc => {
        //     const fetchURL = `${API_URL}/trades?account_id=${acc.id}&order=asc&limit=2`;
        //     const depositDate = fetch(fetchURL, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             'Authorization': authKey,
        //         }
        //     }).then(async res => {
        //         if(res.ok){
        //             const result = await res.json();
        //             console.log(result);
        //             let tradeData = result?.data;
        //             //look out for deposit object
        //             // tradeData = tradeData.map(trade => trade.type == "deposit")
        //             return ({...acc, start_date: tradeData});
        //         }
        //     });
        //     return depositDate;
        // });
        
        // const mergedArraywithDeposit = await processPromisesInBatchesWithDelay(depositTrade, 1000, 1000);
        // console.log(mergedArraywithDeposit)
        // return mergedArraywithDeposit;



        if(cacheAnalysis) { return JSON.parse(cacheAnalysis); }
        // const cachedData = await redisClient.get(`accounts_all`);
        // if(cachedData){ return JSON.parse(cachedData); }
        let accounts = [];
        const cachedData = await redisClient.get("accounts_raw");
        if(!cachedData){
            while(lastId != null){
                const fetchURL = lastId == 0 ? `${API_URL}/accounts?` : `${API_URL}/accounts?&last_id=${lastId}`;
                const response = await fetch(fetchURL,{
                    headers: {
                        "Content-Type": "application/json",
                        'Authorization': authKey,
                    }
                });
                const responseJSON = await response.json();
                if(responseJSON.result == "success" && responseJSON.data.length > 0){
                    accounts = [...accounts, ...responseJSON.data]
                    console.log("Fetching after Id ", responseJSON.meta.last_id);
                    lastId = responseJSON.meta.last_id;
                }else{
                    lastId = null;
                }
            }
            // await redisClient.set(`accounts_raw`, JSON.stringify(accounts));

        }else{
            accounts = JSON.parse(cachedData);
        }
        accounts = accounts.filter(acc => acc.status == "connection_ok");
        accounts = accounts.filter(acc => acc.trade_mode == "real");
        accounts = accounts.filter(acc => acc.total_profit > 0);

        // accounts = accounts.filter(acc => acc.id < 5000)


        // accounts = accounts.filter(acc => acc.total_lots > 0);
        // accounts = accounts.filter(acc => acc.total_longs == 0 && acc.total_shorts == 0); //deleting no connection and demo and useless accounts
        console.log("total accounts", accounts);

        // const user = await getUserSettings("admin");
        // 'Authorization': clientAuthKey(decryptData(user.apiKey), decryptData(user.secretKey)),

        //find analysis of all accounts
        const clientAnalysis = accounts.map(async acc => {
            const analysis = fetch(`${API_URL}/analyses/${acc.id}`, {
                headers:{
                    'Authorization': authKey,
                }
            })
            .then(async res => {
                if(res.ok){
                    const result = await res.json();
                    let analysisData = result?.data;

                    analysisData = {
                        ...analysisData,
                        win_ratio: analysisData.total_trades != 0 && analysisData.total_trades_won != 0 ? Number(analysisData.total_trades_won / analysisData.total_trades * 100).toFixed(2) : 0,
                        risk_reward_ratio_avg: analysisData.average_loss != 0 ? Number(analysisData.average_win / Math.abs(analysisData.average_loss)).toFixed(2) : 0,
                        risk_reward_ratio_worst: analysisData.worst_trade != 0 ? Number(analysisData.average_win / Math.abs(analysisData.worst_trade)).toFixed(2) : 0,
                        drawdown: (Number(acc.balance) - Number(acc.equity)) / Number(acc.balance) * 100,
                    }
                    return ({...acc, ...analysisData});
                }else{
                    return res;
                }
            }).catch(err => console.log(err));
            return analysis;
        });
        console.log("analusis total", clientAnalysis.length);
        let accountsWithAnalysis = await Promise.all(clientAnalysis);
        accountsWithAnalysis = accountsWithAnalysis.filter(acc => acc);

        console.log(accountsWithAnalysis.length)
        
        returnObject = accountsWithAnalysis;
        await redisClient.set(`accounts_all_with_analysis`, JSON.stringify(returnObject));

        //find start date of all accounts
        // const depositTrade = accounts.filter(acc => acc.id == 933534).map(async acc => {
        //     const fetchURL = `${API_URL}/trades?account_id=${acc.id}`;
        //     console.log(fetchURL);
        //     const depositDate = fetch(fetchURL, {
        //         headers: {
        //             "Content-Type": "application/json",
        //             'Authorization': authKey,
        //         }
        //     }).then(async res => {
        //         if(res.ok){
        //             const result = await res.json();
        //             console.log(result);
        //             let tradeData = result?.data;
        //             return ({...acc, start_date: tradeData});
        //         }
        //     });
        //     return depositDate;
        // });
        // const resolved = await Promise.all(depositTrade)
        // console.log("deposittrade", resolved);

        
        // await redisClient.set(`accounts_all`, JSON.stringify(filteredAccounts));

        // console.log(responseJSON)

        // if(responseJSON.result == "success"){
        //     if(responseJSON?.data.length > 0){
        //         const clientAccounts = responseJSON?.data?.filter(acc => acc.status == "connection_ok");

        //         const clientAnalysis = clientAccounts.map(async acc => {
        //             //get client analaysis
        //             const analysis = fetch(`${API_URL}/analyses/${acc.id}`, {
        //                 headers:{
        //                     'Authorization': authKey,
        //                 }
        //             })
        //             .then(async res => {
        //                 if(res.ok){
        //                     const result = await res.json();
        //                     let analysisData = result?.data;

        //                     //calculate other parameters
        //                     analysisData = {
        //                         ...analysisData,
        //                         win_ratio: analysisData.total_trades != 0 && analysisData.total_trades_won != 0 ? Number(analysisData.total_trades_won / analysisData.total_trades * 100).toFixed(2) : 0,
        //                         risk_reward_ratio_avg: analysisData.average_loss != 0 ? Number(analysisData.average_win / Math.abs(analysisData.average_loss)).toFixed(2) : 0,
        //                         risk_reward_ratio_worst: analysisData.worst_trade != 0 ? Number(analysisData.average_win / Math.abs(analysisData.worst_trade)).toFixed(2) : 0,
        //                         drawdown: (Number(acc.balance) - Number(acc.equity)) / Number(acc.balance) * 100,
        //                     }
        //                     return ({...acc, ...analysisData});
        //                 }else{
        //                     return res
        //                 }
        //             }).catch(err => console.log(err));
        //             return analysis;
        //         });
        //         const mergedArray = await Promise.all(clientAnalysis);
        //         console.log("merged",mergedArray)
        //         // get start date from deposit date
        //         const depositTrade = mergedArray.map(async acc => {
        //             const fetchURL = `${API_URL}/trades?limit=5`;
        //             const depositDate = fetch(fetchURL, {
        //                 headers: {
        //                     "Content-Type": "application/json",
        //                     'Authorization': authKey,
        //                 }
        //             }).then(async res => {
        //                 if(res.ok){
        //                     const result = await res.json();
        //                     console.log(result);
        //                     let tradeData = result?.data;
        //                     return ({...acc, start_date: tradeData});
        //                 }
        //             });
        //             return depositDate;
        //         });
                
        //         const mergedArraywithDeposit = await Promise.all(depositTrade);
        //         console.log("deposit", mergedArraywithDeposit)
                
        //         returnObject = {...responseJSON, data: mergedArraywithDeposit}

                // await redisClient.set(`accounts_all_with_analysis`, JSON.stringify(returnObject));
                // await redisClient.set(`accounts_all`, JSON.stringify(accounts));
                console.log('saved');
        //     }
        // }

        await disconnetRedis();
    }catch(err){
        returnObject = err;
        await disconnetRedis();
    }
    return returnObject;
}