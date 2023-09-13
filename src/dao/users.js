const { Query } = require('../connector/mysql_connector');

async function GetPassword(username) {
    let sql = `SELECT password FROM users WHERE username='${username}'`;
    const results = await Query(sql);
    if(results.length > 1) {
        throw new Error(`Found more than 1 user with username ${username}`)
    } else if (results.length == 0) {
        throw new Error(`Unable to find user with username ${username}`)
    } else {    // results.length == 1
        return results[0].password;
    }
}

module.exports = { GetPassword }