const express = require("express");
const db = require('./db/database.js');

const envelopeRouter = express.Router();


//Get All Envelopes. Working!
envelopeRouter.get("/", async (req, res, next) => {
    const envelopes = await db.query('SELECT * FROM envelopes');
    res.send(envelopes.rows);
});

//Get Envelope By Id
envelopeRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    const envelope = await client.query(`SELECT * FROM envelopes WHERE id = ${id}`);
    res.send(envelope.rows);
});

//Create Envelope
envelopeRouter.post("/", async (req, res, next) => {
    const { title, budget } = req.body;
    //console.log(title);
    client.query('INSERT INTO envelopes(title, budget) VALUES($1, $2)', [title, budget]);
    const created = await client.query('SELECT * FROM envelopes');
    res.send(created.rows);
})

//Delete Envelope
envelopeRouter.delete("/:id", async (req, res, next) => {
    client.query('DELETE FROM envelopes WHERE id = $1', [req.params.id]);
    const created = await client.query('SELECT * FROM envelopes');
    res.send(created.rows);
})


//Update Envelope Budget remaining after spending
envelopeRouter.post("/:id", async (req, res, next) => {
    const { cost } = req.body;
    const reqEnvelope = (await client.query(`SELECT * FROM envelopes WHERE id = ${req.params.id}`)).rows;
    if (reqEnvelope[0].budget >= cost) {
        reqEnvelope[0].budget -= cost;
        res.send(reqEnvelope[0]);
    }
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