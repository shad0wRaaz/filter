
import express  from 'express';
import cors from 'cors';
import cron from 'node-cron'
import bodyParser from 'body-parser';
import { getAccounts } from './accounts/index.js';
import { getUserSettings, saveUserKeys } from './accounts/settings/index.js';
import { getAnalysis } from './accounts/analysis/index.js';
import { getClientAccounts, saveClientAccount } from './clientaccounts/index.js';
import { getBrokerServers, getBrokers } from './brokers/index.js';
import { getWatchlist, saveWatchlist } from './watchlist/index.js';
import { getAllAccounts } from './accounts/all/index.js';
import { saveCopier } from './clientaccounts/copier/index.js';
import { getLeadFollowerArray } from './accounts/copiers/index.js';

const PORT = 3001;

const app = express();
app.use(cors({origin : "http://localhost:3000"}));
app.use(bodyParser.urlencoded({ extended: false }));
app.use(bodyParser.json()); 

app.get('/', (req, res) => {
    res.send("hello")
});

cron.schedule('0 4 * * *', async() => {
    //update account cache
    //update analysis
    await getAllAccounts(0);
});

cron.schedule('10 * * * *', async() => {
    //check for change in lead account from watchlist
});

app.get('/accounts/all/:lastId', async(req,res) => {
    const result = await getAllAccounts(req.params.lastId);
    return res.send(result);
});

app.get('/accounts/all/copiers/leadfollower', async(req, res) => {
    const result = await getLeadFollowerArray();
    return res.send(result);
})

app.get('/accounts/get/:limit/:lastid', async (req, res) => {
    const limit = req.params.limit;
    const lastId = req.params.lastid;
    return res.send(await getAccounts(limit, lastId));
});

app.get('/accounts/client/get/:username/:limit', async(req, res) => {
    const username = req.params.username;
    const limit = req.params.limit;
    return res.send(await getClientAccounts(username, limit));
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

app.post('/accounts/settings/get', async(req, res) => {
    const body = req.body;
    const username = body.username;
    const settings = await getUserSettings(username);
    return res.send(settings);
});

app.get('/accounts/analysis/:id/:type', async(req, res) => {
    const id = req.params.id;
    const type = req.params.type;
    const analysis = await getAnalysis(id, type);
    return res.send(analysis);

});

app.post('/accounts/settings/save', async(req, res) => {
    const body = req.body;
    const result = await saveUserKeys(body.username, body.apiKey, body.secretKey);
    return res.send(result);
});

app.get('/brokers/:username/:version', async(req, res) => {
    console.log(req.params.version)
    const brokers = await getBrokers(req.params.username, req.params.version);
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
    const body = req.body;
    console.log(body)
    if(req.body.username && req.body.watchlist){
        const result = await saveWatchlist(req.body.username, req.body.watchlist);
        return res.send(result);
    }
    return req.send({ message: "Watchlist not added" })
})

app.listen(PORT, () => {
    console.log(`Server is running in PORT ${PORT}`);
})

