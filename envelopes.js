const express = require("express");
//const envelopes = require("./data.js");
const client = require('./db/database.js');

const envelopeRouter = express.Router();



//Param to select envelope by Id
/*
envelopeRouter.param("id", (req, res, next, id) => {
    const numId = Number(id);
    const selectedEnvelope = envelopes.find((env) => {
        return env.id === numId;
    });
    req.selectedEnvelope = selectedEnvelope;
    //console.log(selectedEnvelope);
    next();
})
*/

//Get All Envelopes
envelopeRouter.get("/", async (req, res, next) => {
    const envelopes = await client.query('SELECT * FROM envelopes');
    res.send(envelopes.rows);
});

//Get Envelope By Id
envelopeRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    const envelope = await client.query(`SELECT * FROM envelopes WHERE id = ${id}`);
    res.send(envelope.rows);
})


//Update Envelope Budget remaining after spending
envelopeRouter.post("/:id", (req, res, next) => {
    const { cost } = req.body;
    req.selectedEnvelope.budget = req.selectedEnvelope.budget - cost;
    const updateIndex = envelopes.findIndex(env => env.id === req.selectedEnvelope.id);
    envelopes[updateIndex] = req.selectedEnvelope;
    res.send(envelopes[updateIndex]);
})

//Create Envelope
envelopeRouter.post("/", async (req, res, next) => {
    const { title, budget } = req.body;
    await client.query(`INSERT INTO envelopes (title, budget) VALUES (${title}, ${budget})`);
    const created = await client.query('SELECT * FROM envelopes');
    res.send(created.rows);
})

//Delete Envelope
envelopeRouter.delete("/:id", (req, res, next) => {
    const updateIndex = envelopes.findIndex(env => env.id === req.selectedEnvelope.id);
    envelopes.splice(updateIndex, 1);
    res.send(envelopes);
})


//Transfer routes
envelopeRouter.param("from", (req, res, next, from) => {
    console.log(from);
    const originEnv = envelopes.find(env => env.title === from);
    const originIndex = envelopes.findIndex(env => env.id === originEnv.id);
    req.originEnv = originEnv;
    req.originIndex = originIndex;
    next();
})

envelopeRouter.param("to", (req, res, next, to) => {
    const destEnv = envelopes.find(env => env.title === to);
    const destIndex = envelopes.findIndex(env => env.id === destEnv.id);
    req.destEnv = destEnv;
    req.destIndex = destIndex
    next();
})

envelopeRouter.post("/transfer/:from/:to", (req, res, next) => {
    console.log(req.params);
    const { amount } = req.body;
    req.originEnv.budget -= amount;
    req.destEnv.budget += amount;
    envelopes[req.originIndex] = req.originEnv;
    envelopes[req.destIndex] = req.destEnv;

    res.send(envelopes[req.originIndex]);
    
})

module.exports = envelopeRouter;