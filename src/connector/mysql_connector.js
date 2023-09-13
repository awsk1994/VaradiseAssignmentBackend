const mysql = require('mysql'); // faster clothing might be taken by other people...
const config = require('../../config');

let pool;

function ConnectSQL() {
    pool = mysql.createPool({
        host: config.mysql.host,
        port: config.mysql.port,
        user: config.mysql.user,
        password: config.mysql.password,
        database: config.mysql.database,
        timezone: 'Asia/Shanghai',
        connectionLimit: 50,
    });
}

function DisconnectSQL() {
    console.log("Disconnecting SQL pool...");
    pool.end(function (err) {
        if (err) {
            console.log(`Pool End error: ${err.toString()}`);
            console.log(err.stack.toString());
        }
    });
}

async function Query(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Get Pool Connetion error: ${err.toString()}`);
                console.log(err.stack.toString());
                reject(err);
            }
            console.log(`sql: ${sql}`);
            query2(sql, connection)
                .then(res => {
                    console.log(`SQL results length: ${res.length}`);
                    console.log(`SQL result: ${JSON.stringify(res)} || SQL: ${sql}`);
                    resolve(res);
                })
                .catch(err => reject(err));
        });
    });
}

function query2(sql, connection) {
    return new Promise((resolve, reject) => {
        connection.query(sql, (error, results) => {
            if (error) {
                console.log(`SQL Query2 error: ${error.toString()} | ${error.stack.toString()}`);
                reject(error);
            } else {
                resolve(results);
            };
            connection.release();
        });
    });
}

async function Modify(sql) {
    return new Promise((resolve, reject) => {
        pool.getConnection(function (err, connection) {
            if (err) {
                console.log(`Get Pool Connetion error: ${err.toString()}`);
                console.log(err.stack.toString());
                reject(err);
            }
            console.log(`sql: ${sql}`);
            query2(sql, connection)
                .then(res => {
                    console.log(`SQL Affected Rows: ${res.affectedRows}`);
                    resolve(res);
                })
                .catch(err => reject(err));
        });
    });
}

async function ModifyOne(sql) {
    let results = await Modify(sql);
    // success case
    if (results.affectedRows == 1) {
        return results;
    }

    // error case
    let msg;
    let err;
    if (results.affectedRows > 1) {
        err = "Affected Rows > 1";
    } else if (results.affectedRows == 0) {
        err = "Affected Rows == 0";
    } else {
        err = "Unknown error";
    }
    msg = `ModifyOne error: sql=${sql}, error=${err}, db rsp=${JSON.stringify(results)}`;
    console.log(`SQL Modify error: ${err.toString()} | ${err.stack.toString()}`);
    throw new Error(msg);
}

module.exports = { ConnectSQL, DisconnectSQL, Query, ModifyOne, Modify }

