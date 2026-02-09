import { API_URL, authKey } from "../../utils/index.js";
import { redisClient, connectRedis, disconnetRedis } from "../../libs/redis/redisClient.js";
import { getAllCopiers } from "../copiers/index.js";


export const getAllAccounts = async (lastId) => {
    let returnObject = "";
    try{
        // await connectRedis();
        const cachedDataWithAnalysisCopier = await redisClient.get("accounts_with_analysis_copier");
        const parsedCachedDataWithAnalysisCopier = JSON.parse(cachedDataWithAnalysisCopier);

        if(parsedCachedDataWithAnalysisCopier && parsedCachedDataWithAnalysisCopier?.length > 0) 
            { return parsedCachedDataWithAnalysisCopier; }

        let accounts = [];
        const cachedData = await redisClient.get("accounts_raw");
        const parsedCachedData = JSON.parse(cachedData);

        if(!parsedCachedData || parsedCachedData?.length == 0){
            console.log("Fetching all Accounts");
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
                    console.log("Fetching Accounts after Id ", responseJSON.meta.last_id);
                    lastId = responseJSON.meta.last_id;
                }else{
                    lastId = null;
                }
            }


            await redisClient.set(`accounts_raw`, JSON.stringify(accounts), { EX: 86400 });

        }else{
            accounts = JSON.parse(cachedData);
        }
        
        // accounts = accounts.filter(acc => acc.status == "connection_ok");
        console.log("Total Accounts with Demo and Live: ", accounts.length);

        accounts = accounts.filter(acc => acc.trade_mode == "real");
        
        console.log("Total Live Accounts: ", accounts.length);

        console.log(`Procesing Analyses for ${accounts.length} accounts`);
        let accountsWithAnalysis = "";
        const cacheAnalaysisOnlyData = await redisClient.get("accounts_all_with_analysis");
        const parsedCacheAnalaysisOnlyData = JSON.parse(cacheAnalaysisOnlyData);
        
        if(!parsedCacheAnalaysisOnlyData || parsedCacheAnalaysisOnlyData?.length == 0){
            //find analysis of all accounts
            accountsWithAnalysis = await processAllAccounts(accounts);

            console.log("Before growth filter: ", accountsWithAnalysis.length);
            // accountsWithAnalysis = accountsWithAnalysis.filter(data => data.growth <= 5000);
            console.log("Total analysed accounts", accountsWithAnalysis.length);
            
            await redisClient.set(`accounts_all_with_analysis`, JSON.stringify(accountsWithAnalysis), { EX: 86400 });
        }else{
            accountsWithAnalysis = parsedCacheAnalaysisOnlyData;

        }

        console.log("Processing copiers");

        if(accountsWithAnalysis != ""){
            const copiers = await getAllCopiers();

            const accountsWithLF = accountsWithAnalysis.map(acc => {
                if(copiers.some(copyObj => copyObj.lead_id == acc.id)){
                    return (
                        {...acc, 
                            copierStatus: "Lead", 
                            followers: copiers.filter(a => a.lead_id == acc.id).length,
                        });
                }else if(copiers.some(copyObj => copyObj.follower_id == acc.id)){
                    return ({...acc, copierStatus: "Follower", followers: 0});
                }else{
                    return ({...acc, copierStatus: "Standalone", followers: 0});
                }
            });
    
            await redisClient.set("accounts_with_analysis_copier", JSON.stringify(accountsWithLF), { EX: 86400 });
            // disconnetRedis();
            returnObject = accountsWithLF;
        }
        // await disconnetRedis();
    }catch(err){
        returnObject = err;
        // await disconnetRedis();
    }
    return returnObject;
}

export const getAccount = async(accountId) => {

    try{
        // await connectRedis();
        const cachedData = await redisClient.get("accounts_with_analysis_copier");
        if(cachedData) {
            //find the account from the cached data
            const allAccounts = JSON.parse(cachedData);
            // console.log(allAccounts)
            let requiredAccount = [];
            requiredAccount = allAccounts.filter(acc => acc.id == accountId);
            // await disconnetRedis();
            
            if(requiredAccount.length > 0) {
                //account is found from cache, so return from cache
                return requiredAccount[0];
            }else{
                //find all analysis, copier and then return
                return [];
            }
        }else{
            // await disconnetRedis();
            return null;
        }
    }catch(err){
        // await disconnetRedis();
    }
}
export const getLead = async(accountId) => {
    try{
        // await connectRedis();
        const cachedFollowers = await redisClient.get("followers");
        if(cachedFollowers){ return JSON.parse(cachedFollowers); }

        const cachedData = await redisClient.get("accounts_all_copiers");
        if(!cachedData) return [];

        const parsedCacheData = JSON.parse(cachedData);
        let copier = "";
        console.log('Parsing Accounts to get Lead');
        copier = parsedCacheData.filter(acc => acc.follower_id == accountId);
        // await disconnetRedis();
        return copier;
    }catch(err){
        // await disconnetRedis();
    }

}

export const getFollowers = async(accountId) => {
    try{
        // await connectRedis();
        const cachedFollowers = await redisClient.get("followers");
        if(cachedFollowers){ return JSON.parse(cachedFollowers); }

        const cachedData = await redisClient.get("accounts_all_copiers");
        if(!cachedData) return [];

        const parsedCacheData = JSON.parse(cachedData);

        const followers = parsedCacheData.filter(acc => acc.lead_id == accountId);
        // console.log("followers", followers)
        // await disconnetRedis();
        return followers;
    }catch(err){
        // await disconnetRedis();
    }

}
export const getEverything = async() => {
    const allAccounts = await getAllAccounts();
    const accountsAndTrades = processAllAccounts(allAccounts.slice(0, 100), 100, 3000, "trades");
    return accountsAndTrades;
}
export const getDayTraders = async() => {
    const allAccounts = await getAllAccounts();

    const cachedDayTraders = await redisClient.get("day_traders");

    if(cachedDayTraders) { return JSON.parse(cachedDayTraders); }

    const accountsAndTrades = processAllAccounts(allAccounts.slice(0, 1000), 100, 3000, "daytraders");

    await redisClient.set("day_traders", JSON.stringify(accountsAndTrades), { EX: 86400 });
    return accountsAndTrades;
}

const processAllAccounts = async(accounts, batchSize = 100, delay = 3000, type = "analysis") => {
    const results = [];
    for (let i = 0; i < accounts.length; i += batchSize) {
        const batch = accounts.slice(i, i + batchSize);
        console.log(`Processing batch ${Math.floor(i / batchSize) + 1} :: Account Stack size: ${results.length}`);

        if(type == "analysis"){
            const batchResults = await fetchAnalysisForBatch(batch);
            results.push(...batchResults);
        }else if(type == "trades"){
            const batchResults = await fetchTradesForBatch(batch);
            results.push(...batchResults)
        }else{
            const batchResults = await fetchDayTrader(batch);
            results.push(...batchResults)
        }

        // If not the last batch, wait before continuing
        if (i + batchSize < accounts.length) {
            console.log(`Waiting for ${delay} milliseconds before processing next batch...`);
            await new Promise(resolve => setTimeout(resolve, delay));
        }
    }
    console.log("Total Processed Accounts", results.length);
    return results;
}

//this function has been changed from getting all accounts and all of its trades to just getting all trades. 
//initially this function was used for fetching the data and returning it for scv export.
//now it has been used to find daytrader. if needed to go back, uncomment codes after const result = await res.json() inside then() till making the object.

const fetchTradesForBatch = async(accountsBatch) => {
    const results = await Promise.all(
        accountsBatch.map(acc => 
            fetch(`${API_URL}/trades?account_id=${acc.id}&order=desc`, {
                headers: {
                    'Authorization': authKey,
                }
            }).then(async res => {
                if(res.ok){
                    const result = await res.json();
                    // const tradesWithAccountData = result.data.map(trade => ({
                    //     ...trade,    // Spread each trade data
                    //     ...acc,
                    //     // account_number: acc.account_number,
                    //     // broker: acc.broker,
                    //     // broker_server_id: acc.broker_server_id,
                    //     // currency: acc.currency,
                    //     // average_loss: acc.average_loss,
                    //     // average_win: acc.average_win,
                    //     // balance: acc.balance,   
                    //     // daily_profit: acc.daily_profit,
                    //     // drawdown: acc.drawdown,
                    //     // drawdown: acc.drawdown,
                    //     // followers: acc.follwers,
                    //     // free_margin: acc.free_margin,
                    //     // followers: acc.follwers,
                    // }));
            
                    //for csv export, just do return result;
                    return result.data;
                }else{
                    return [];
                }
            })
        ));

        return results.flat();
}

const fetchDayTrader = async (accountsBatch) => {
    try {
      const results = await Promise.all(
        accountsBatch.map(async (acc) => {
          const trades = await fetchAllTrades(acc.id);

          // Check if any trade closes after 10 PM UTC
          const hasLateTrade = trades.some(({ close_time }) => {
            if (!close_time) return false;
            return new Date(close_time).getUTCHours() > 22;
          });
          return hasLateTrade ? null : acc.id; // Return ID only if day trader
        })
      );

      return results.filter(Boolean);
    } catch (error) {
      console.error('Error fetching day traders:', error);
      return [];
    }
  };
  

const fetchAnalysisForBatch = async(accountsBatch) => {
    const results = await Promise.all(
        accountsBatch.map(acc => 
            fetch(`${API_URL}/analyses/${acc.id}`, {
                headers: {
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
                }
            })
            .catch(error => {
                console.error(`Error fetching analysis for account ${acc.id}:`, error);
                return null; // or handle the error as needed
            })
        )
    );
    const resultsUndefinedRemoved = results && results.filter(result => result);
    return resultsUndefinedRemoved;
}

const fetchAllTrades = async (accountId) => {
    let allTrades = [];
    let lastId = null;
  
    try {
      do {
        const url = new URL(`${API_URL}/trades`);
        url.searchParams.append('account_id', accountId);
        url.searchParams.append('order', 'desc');
        if (lastId) url.searchParams.append('last_id', lastId);
  
        const res = await fetch(url, {
          headers: { 'Authorization': authKey },
        });

        if (!res.ok) throw new Error(`Failed to fetch trades for account ${accountId}`);
  
        const { data, meta } = await res.json();
        
        allTrades = allTrades.concat(data);
        lastId = meta.last_id; // Move to the next batch
  
      } while (lastId); // Continue fetching until no more trades
  
    } catch (error) {
      console.error(`Error fetching trades for account ${accountId}:`, error);
    }
  
    return allTrades;
  };