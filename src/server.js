const express = require('express')
const { GetPassword } = require('./dao/users')
const { GetAvgEuis, GetBuildings, CountBuildings } = require('./dao/buildings')
const { ConnectSQL } = require("./connector/mysql_connector")
const timeUtils = require("./utils/time");
const cors = require('cors');

const app = express()
const port = 3001

app.use(cors({
    origin: '*',
    methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization']
  }));  // But this will be overriden if using ngrok

var bodyParser = require('body-parser')
// parse application/json
app.use(bodyParser.json())

// INIT
ConnectSQL();

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
        const count = await CountBuildings();
        results = { buildings, totalCount: count }
        res.json({
            results: results,
            ts: timeUtils.TimeNowStr(),
        })
    }
    catch (err) {
        console.log(`err=${err.stack.toString()}`);
        res.status(500).send(err.toString());
    }
})

app.get('/avgEuisByPropertyType', async (req, res) => {
    const API = '/avgEuisByPropertyType'
    try {
        console.log(`API: ${API}; req=${JSON.stringify(req.query)}`);
        const results = await GetAvgEuis();
        res.json({
            results: results,
            ts: timeUtils.TimeNowStr(),
        })
    }
    catch (err) {
        console.log(`err=${err.stack.toString()}`);
        res.status(500).send(err.toString());
    }
})

app.post('/login', async (req, res) => {
    const API = '/login'
    try {
        if (!req.body.username || req.body.username == "") {
            res.status(500).send("ERROR: missing username");    // TODO: fix
        } else if (!req.body.password || req.body.password == "") {
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
    }
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})