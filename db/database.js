const pg = require('pg');
const { Pool, Client } = pg;

const client = new Client({
    user: 'budget',
    password: 'budget',
    host: 'localhost',
    port: 5432,
    database: 'personal_budget'
});

async function connect(params) {
    await client.connect();
    const res = await client.query('SELECT * FROM envelopes');
    console.log(res.rows);
}

//connect();
console.log('connected');

module.exports = client;