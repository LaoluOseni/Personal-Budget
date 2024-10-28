const express = require("express");
const router = express.Router();

const { getEnvelopes, getEnvelopeById, createEnvelope, updateEnvelope, deleteEnvelope, addEnvelopeTransaction } = require("../controllers/envelopes");


router.get("/", getEnvelopes);
router.get("/:id", getEnvelopeById);
router.post("/", createEnvelope);
router.delete("/:id", deleteEnvelope);
router.put("/:id", updateEnvelope);

router.post("/:id/transactions", addEnvelopeTransaction)


module.exports = router;