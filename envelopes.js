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

//Create Envelope Transaction
envelopeRouter.post("/:id/transactions", async (req, res) => {
    const { id } = req.params;
    const { title, amount } = req.body;
    const date = new Date();

    const envelopeQuery = "SELECT * FROM envelopes WHERE envelopes.id = $1";
    const transactionQuery = "INSERT INTO transactions(title, amount, date, envelope_id) VALUES($1, $2, $3, $4) RETURNING *";
    const updateEnvQuery = "UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *";

    try {
        //SQL transaction
        const client = db.client;
        await client.query('BEGIN');
        const envelope = await client.query(envelopeQuery, [id]);

        if (envelope.rowCount < 1) {
            return res.status(404).send({
                message: "No envelope information found"
            });
        };

        const newTransaction = await client.query(transactionQuery, [title, amount, date, id]);
        await client.query(updateEnvQuery, [amount, id]);
        await client.query('COMMIT');

        res.status(201).send({
            status: 'Success',
            message: 'New transaction created',
            data: newTransaction.rows[0],
        });
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(500).send({
            error: err.message
        });
    }
})



//Get Envelope Transactions
envelopeRouter.get("/:id/transactions", async (req, res) => {
    const { id } = req.params;
    const query = "SELECT * FROM transactions WHERE id = $1";
});

module.exports = envelopeRouter;