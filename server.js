const express = require("express");

const envelopeRouter = require("./envelopes.js");


const app = express();
app.use(express.json());
const PORT = 5000;

app.get('/', (req, res, next) => {
    console.log("why")
    res.send('Entry Point');
})

app.use('/envelopes', envelopeRouter);

app.listen(PORT, () => {
    console.log("Server is up and running");
    //console.log(process.env.PORT);
})