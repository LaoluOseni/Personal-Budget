const db = require("../db/database");

//Get All Envelopes
const getEnvelopes = async (req, res) => {
    const query = 'SELECT * FROM envelopes';

    try {
        const envelopes = await db.query(query);
        //console.log(envelopes);
        if (envelopes.rowCount < 1) {
            return res.status(404).send({
                message: "Records not found"
            })
        }
        res.status(200).send({
            status: 'Success',
            message: 'Envelopes Information retrieved',
            data: envelopes.rows
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
};

//Get One Envelope
const getEnvelopeById = async (req, res) => {
    const query = "SELECT * FROM envelopes WHERE id = $1";
    const { id } = req.params;

    try {
        const envelope = await db.query(query, [id]);
        if (envelope.rowCount < 1) {
            return res.status(404).send({
                message: "No envelope information found",
            });
        }
        res.status(200).send({
            status: 'Success',
            message: 'Envelope Information retrieved',
            data: envelope.rows[0]
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
};

//Create an envelope
const createEnvelope = async (req, res) => {
    const { name, budget } = req.body;
    const query = 'INSERT INTO envelopes(name, budget) VALUES($1, $2) RETURNING *';

    try {
        const newEnvelope = await db.query(query, [name, budget]);
        res.status(201).send({
            status: 'Success',
            message: 'New envelope created',
            data: newEnvelope.rows[0]
        });
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
};

//update an envelope
const updateEnvelope = async (req, res) => {
    const { name, budget } = req.body;
    const { id } = req.params;
    const query = "UPDATE envelopes SET name = $1, budget = $2 WHERE id = $3 RETURNING *";

    try {
        const updatedEnvelope = await db.query(query, [name, budget, id]);
        res.status(200).send(updateEnvelope.rows[0]);
    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }

};

//Delete an envelope
const deleteEnvelope = async (req, res) => {
    const { id } = req.params;
    const envelopesQuery = "SELECT * FROM envelopes WHERE id =$1";
    const deleteEnvQuery = "DELETE FROM envelopes WHERE id = $1";

    try {
        const record = await db.query(envelopesQuery, [id]);
        if (record.rowCount < 1) {
            return res.status(404).send({
                message: "Record not found"
            })
        };

        await db.query(deleteEnvQuery, [id]);
        res.sendStatus(204);

    } catch (err) {
        return res.status(500).send({
            error: err.message
        });
    }
};

const addEnvelopeTransaction = async (req, res) => {
    const { id } = req.params;
    const { name, amount } = req.body;
    const date = new Date();

    const envelopeQuery = "SELECT * FROM envelopes WHERE envelopes.id = $1";
    const transactionQuery = "INSERT INTO transactions(title, amount, time, envelope_id) VALUES($1, $2, $3, $4) RETURNING *";
    const updateEnvQuery = "UPDATE envelopes SET budget = budget - $1 WHERE id = $2 RETURNING *";

    //SQL transaction
    const client = await db.client();
    try {
        await client.query('BEGIN');
        const envelope = await client.query(envelopeQuery, [id])
        if (envelope.rowCount < 1) {
            return res.status(404).send({
                message: "no envelope information found",
            });
        };
        const newTransaction = await client.query(transactionQuery, [name, amount, date, id]);
        await client.query(updateEnvQuery, [amount, id]);
        await client.query('COMMIT')

        res.status(201).send({
            status: 'Success',
            message: 'New Transaction Created',
            data: newTransaction.rows[0],
        })
    } catch (err) {
        await client.query('ROLLBACK');
        return res.status(500).send({
            error: err.message
        });
    }
};

module.exports = {
    getEnvelopes,
    getEnvelopeById,
    createEnvelope,
    updateEnvelope,
    deleteEnvelope,
    addEnvelopeTransaction
};