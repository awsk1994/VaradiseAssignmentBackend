const express = require('express')
const { GetPassword } = require('./dao/users')
const { GetAvgEuis, GetBuildings } = require('./dao/buildings')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/buildings', async (req, res) => {
    const defaultOffset = 0;
    const defaultLimit = 5;
    const API = '/buildings'
    const offset = !!req.query.offset ? req.query.offset : defaultOffset;
    const limit = !!req.query.limit ? req.query.limit : defaultLimit;
    try {
        console.log(`API: ${API}; req=${JSON.stringify(req.query)}`);
        const buildings = await GetBuildings(offset, limit)
        results = { buildings }
        res.json({
            results: results,
            ts: timeUtils.TimeNowStr(),
        })
    }
    catch (err) {
        console.log(`err=${err.stack.toString()}`);
        res.status(500).send(err.toString());
    } finally {
        console.log(`API: ${API}; res=${JSON.stringify(res)}`);
    }
})

app.get('/charts/avgEuisByPropertyType', async (req, res) => {
    const API = '/buildings/avgEuisByPropertyType'
    try {
        console.log(`API: ${API}; req=${JSON.stringify(req.body)}`);
        const avgEuis = await GetAvgEuis();
        results = { avgEuis }
        res.json({
            results: results,
            ts: timeUtils.TimeNowStr(),
        })
    }
    catch (err) {
        console.log(`err=${err.stack.toString()}`);
        res.status(500).send(err.toString());
    } finally {
        console.log(`API: ${API}; res=${JSON.stringify(res)}`);
    }
})

app.post('/users/login', async (req, res) => {
    const API = '/user/login'
    try {
        console.log(`API: ${API}; req=${JSON.stringify(req.body)}`);

        if (req.body.username == "") {
            res.status(500).send("ERROR: missing username");    // TODO: fix
        } else if (req.body.password == "") {
            res.status(500).send("ERROR: missing password");  // TODO: fix
        } else {
            const password = await GetPassword(req.body.username);
            if (req.body.password == password) {
                results = {
                    authenticated: true,
                };
                res.json({
                    results: results,
                    ts: timeUtils.TimeNowStr(),
                });
            } else {
                results = {
                    authenticated: false,
                };
                res.json({
                    results: results,
                    ts: timeUtils.TimeNowStr(),
                });
            };
        }
    }
    catch (err) {
        console.log(`err=${err.stack.toString()}`);
        res.status(500).send(err.toString());
    } finally {
        console.log(`API: ${API}; res=${JSON.stringify(res)}`);
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})