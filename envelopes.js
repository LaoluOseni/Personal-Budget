const express = require("express");
const db = require('./db/database.js');

const envelopeRouter = express.Router();


//Get All Envelopes. Working!
envelopeRouter.get("/", async (req, res, next) => {
    const envelopes = await db.query('SELECT * FROM envelopes');
    res.send(envelopes.rows);
});

//Get Envelope By Id. Working!
envelopeRouter.get("/:id", async (req, res, next) => {
    const id = req.params.id;
    const envelope = await db.query(`SELECT * FROM envelopes WHERE id = ${id}`);
    res.send(envelope.rows);
});

//Create Envelope. Working!
envelopeRouter.post("/", async (req, res, next) => {
    const { title, budget } = req.body;
    await db.query('INSERT INTO envelopes(title, budget) VALUES($1, $2)', [title, budget]);
    const created = await db.query('SELECT * FROM envelopes');
    res.send(created.rows);
})

//Delete Envelope. Working!
envelopeRouter.delete("/:id", async (req, res, next) => {
    await db.query('DELETE FROM envelopes WHERE id = $1', [req.params.id]);
    const created = await client.query('SELECT * FROM envelopes');
    res.send('Deleted');
});


//Update Envelope Budget remaining after spending. Working!
envelopeRouter.post("/:id", async (req, res, next) => {
    const { cost } = req.body;
    const id = req.params.id;
    const envelope = await db.query(`SELECT * FROM envelopes WHERE id = ${id}`);
    if (envelope.rows[0].budget > cost) {
        envelope.rows[0].budget -= cost;
        await db.query('UPDATE envelopes SET budget = $1 WHERE id = $2', [envelope.rows[0].budget, id]);
        res.send('Success');
    } else {
        res.send('Insufficient Funds');
    }
});

//Transactions

module.exports = envelopeRouter;