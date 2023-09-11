const express = require('express')
const app = express()
const port = 3000

app.get('/', (req, res) => {
    res.send('Hello World!')
})

app.get('/buildings', (req, res) => {
    results = {
        buildings: []
    };   // TODO
    res.json({
        results: results,
        ts: timeUtils.TimeNowStr(),
    });
})

app.get('/buildings/avgEuiByPropertyType', (req, res) => {
    results = {
        buildings: []
    };   // TODO
    res.json({
        results: results,
        ts: timeUtils.TimeNowStr(),
    });
})

app.post('/users/login', (req, res) => {
    results = {
        authenticated: true,
    };   // TODO
    res.json({
        results: results,
        ts: timeUtils.TimeNowStr(),
    });
})

app.listen(port, () => {
    console.log(`Example app listening on port ${port}`)
})