const express = require("express");
const envelopes = require("./data.js");
const envelopeRouter = express.Router();

envelopeRouter.get("/", (req, res, next) => {
    res.send(envelopes);
})

envelopeRouter.post("/", (req, res, next) => {
    const { title, budget } = req.body;
    const newid = envelopes.length + 1;
    const newEnvelope = {
        id: newid,
        title,
        budget,
    }
    envelopes.push(newEnvelope);
    console.log(envelopes);
    res.send(newEnvelope);
})

module.exports = envelopeRouter;