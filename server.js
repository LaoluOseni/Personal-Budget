const express = require("express");

const app = express();
const PORT = 3000;

app.get('/', (req, res, next) => {
    res.send('Entry Point');
})

app.listen(PORT, () => {
    console.log("Server is up and running");
})