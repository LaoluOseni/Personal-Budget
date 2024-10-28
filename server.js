require('dotenv').config();
const express = require("express");
const logger = require('morgan');


const app = express();
app.use(logger('dev'));
app.use(express.json());


//Define Routers
const envelopesRouter = require("./routes/envelopes.js");


app.use('/envelopes', envelopesRouter);


const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
    console.log(`Server is up and running on port ${PORT}`);
})