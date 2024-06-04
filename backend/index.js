
import express  from 'express';
import cors from 'cors';
import cron from 'node-cron'
import bodyParser from 'body-parser';
import { getAccounts } from './accounts/index.js';
import { getUserSettings, saveUserKeys } from './accounts/settings/index.js';
import { getAnalysis } from './accounts/analysis/index.js';
import { deleteClientAccount, getClientAccounts, saveClientAccount } from './clientaccounts/index.js';
import { getBrokerServers, getBrokers } from './brokers/index.js';
import { getWatchlist, saveWatchlist } from './watchlist/index.js';
import { getAccount, getAllAccounts, getFollowers, getLead } from './accounts/all/index.js';
import { saveCopier } from './clientaccounts/copier/index.js';
import { getAllCopiers } from './accounts/copiers/index.js';
import { getTrades } from './accounts/trades/index.js';
import { connectRedis } from './libs/redis/redisClient.js';
import { getUser } from './users/index.js';
import { getSessions } from './sessions/index.js';

const PORT = 3001;

const app = express();
app.use(cors({origin : "*"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("hello")
});

await connectRedis();

cron.schedule('0 4 * * *', async() => {
    //update account cache
    //update analysis
    await getAllAccounts(0);
});

cron.schedule('* 1 * * *', async() => {
    //check for change in lead account from watchlist

    //refresh copier list for lead and followers data
    await getAllCopiers()
});

app.get('/accounts/all/:lastId', async(req,res) => {
    const result = await getAllAccounts(req.params.lastId);
    return res.send(result);
});

app.get('/copiers', async(req, res) => {
    const result = await getAllCopiers();
    return res.send(result);
})

app.get('/accounts/get/:limit/:lastid', async (req, res) => {
    const limit = req.params.limit;
    const lastId = req.params.lastid;
    return res.send(await getAccounts(limit, lastId));
});

app.get('/accounts/client/get/:email/:limit', async(req, res) => {
    const email = req.params.email;
    const limit = req.params.limit;
    return res.send(await getClientAccounts(email, limit));
});

app.post('/accounts/client/copy', async(req, res) => {
    const result = await saveCopier("admin");
    return res.send(result);

});

app.post('/accounts/client/save', async(req, res) => {
    const body = req.body;
    const accSave = await saveClientAccount(body);
    return res.send(accSave);
});

app.post('/accounts/client/delete', async(req, res) => {
    const {email, accountId} = req.body;
    const result = await deleteClientAccount(email, accountId);
    return res.send(result);
});

app.get('/portfolio/:id', async(req, res) => {
    //this data is fetched from cache, contains all account data with analysis and copier status
    const clientdata = await getAccount(req.params.id);
    // console.log(clientdata);
    return res.send(clientdata);
});

app.get('/accounts/lead/:id', async(req, res) => {
    //get the lead of the account id
    const leadData = await getLead(req.params.id);
    return res.send(leadData);
});

app.get('/accounts/followers/:id', async(req, res) => {
    //get all followers of the account id
    const followersData = await getFollowers(req.params.id);
    return res.send(followersData);
})

app.post('/accounts/settings/get', async(req, res) => {
    const body = req.body;
    const email = body.email;
    const settings = await getUserSettings(email);
    return res.send(settings);
});

app.post('/accounts/settings/save', async(req, res) => {
    const body = req.body;
    const result = await saveUserKeys(body.email, body.apiKey, body.secretKey);
    return res.send(result);
});

app.get('/accounts/analysis/:id/:type', async(req, res) => {
    const id = req.params.id;
    const type = req.params.type;
    const analysis = await getAnalysis(id, type);
    return res.send(analysis);

});

app.get('/accounts/trades/:id', async(req, res) => {
    const trades = await getTrades(req.params.id);
    // console.log(trades)
    return res.send(trades);
})


app.get('/brokers/:email/:version', async(req, res) => {
    const brokers = await getBrokers(req.params.email, req.params.version);
    return res.send(brokers);
});

app.get('/brokers/servers/:username/:brokerId', async(req, res) => {
    const brokerServers = await getBrokerServers(req.params.username, req.params.brokerId);
    return res.send(brokerServers);
});

app.get('/watchlist/:username', async(req, res) => {
    const watchlist = await getWatchlist(req.params.username);
    return res.send(watchlist);
});

app.post('/watchlist', async(req,res) => {
    if(req.body.email && req.body.watchlist){
        const result = await saveWatchlist(req.body.email, req.body.watchlist);
        return res.send(result);
    }
    return res.send({ message: "Watchlist not added" });
});

app.post('/user/login', async(req, res) => {
    const { email, password } = req.body;
    const user = await getUser(email, password);
    if(user){
        return res.send({ success: true, status: 200, data: user })
    }
    return res.send({ success: false, status: 400, message: 'Invalid login credentails' })
});

app.get('/sessions', async(req, res) => {
    const sessions = await getSessions();
    return res.send(sessions);
})
app.listen(PORT, () => {
    console.log(`Server is running in PORT ${PORT}`);
})

