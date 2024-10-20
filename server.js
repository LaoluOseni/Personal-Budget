const express = require("express");
const client = require('./db/database.js');

const envelopeRouter = require("./envelopes.js");


const app = express();
app.use(express.json());
const PORT = 5000;

app.get('/', (req, res, next) => {
    //console.log("why")
    res.send('Entry Point');
})

app.use('/envelopes', envelopeRouter);

app.listen(PORT, async () => {
    console.log("Server is up and running");
    await client.connect();
    console.log('connected to db');
    //console.log(process.env.PORT);
})