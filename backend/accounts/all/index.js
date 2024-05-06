import { API_URL, authKey } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";
import { getAllCopiers } from "../copiers/index.js";


export const getAllAccounts = async (lastId) => {
    let returnObject = "";
    
    try{
        await connectRedis();
        const cachedDataWithAnalysisCopier = await redisClient.get("accounts_with_analysis_copier");

        if(cachedDataWithAnalysisCopier) { return JSON.parse(cachedDataWithAnalysisCopier); }
        
        const cacheAnalysis = await redisClient.get("accounts_all_with_analysis");
        const parsedCache = JSON.parse(cacheAnalysis);

        console.log("no data with copier flag")
        const copiers = await getAllCopiers();
        const accountsWithLF = parsedCache.map(acc => {
            if(copiers.some(copyObj => copyObj.lead_id == acc.id)){
                return ({...acc, copierStatus: "Lead"});
            }else if(copiers.some(copyObj => copyObj.follower_id == acc.id)){
                return ({...acc, copierStatus: "Follower"});
            }else{
                return ({...acc, copierStatus: "Standalone"});
            }
        });

        await redisClient.set("accounts_with_analysis_copier", JSON.stringify(accountsWithLF), { EX: 6000, NX: true});
        disconnetRedis();
        return accountsWithLF;

        if(cacheAnalysis) { return parsedCache; }

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

export const getAccount = async(accountId) => {
    try{
        await connectRedis();
        const cachedData = await redisClient.get("accounts_with_analysis_copier");
        if(cachedData) {
            //find the account from the cached data
            const allAccounts = JSON.parse(cachedData);
            // console.log(allAccounts)
            let requiredAccount = [];
            requiredAccount = allAccounts.filter(acc => acc.id == accountId);
            await disconnetRedis();
            return requiredAccount.length > 0 ? requiredAccount[0] : '';
        }else{
            await disconnetRedis();
            return null;
        }
    }catch(err){
        await disconnetRedis();
    }
}
export const getLead = async(accountId) => {
    try{
        await connectRedis();
        const cachedFollowers = await redisClient.get("followers");
        if(cachedFollowers){ return JSON.parse(cachedFollowers); }

        const cachedData = await redisClient.get("accounts_all_copiers");
        if(!cachedData) return [];

        const parsedCacheData = JSON.parse(cachedData);

        const copier = parsedCacheData.filter(acc => acc.follower_id == accountId);
        return copier;
    }catch(err){
        await disconnetRedis();
    }

}

export const getFollowers = async(accountId) => {
    try{
        await connectRedis();
        const cachedFollowers = await redisClient.get("followers");
        if(cachedFollowers){ return JSON.parse(cachedFollowers); }

        const cachedData = await redisClient.get("accounts_all_copiers");
        if(!cachedData) return [];

        const parsedCacheData = JSON.parse(cachedData);

        const followers = parsedCacheData.filter(acc => acc.lead_id == accountId);
        return followers;
    }catch(err){
        await disconnetRedis();
    }

}