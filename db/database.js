const pg = require('pg');
const { Pool, Client} = pg;

const pool = new Pool();

const query = async (text, params, callback) => {
    return pool.query(text, params, callback);
}

//connect();
//console.log('connected');

module.exports = {
    query
};