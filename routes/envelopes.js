const express = require("express");
const router = express.Router();

const { getEnvelopes, getEnvelopeById, createEnvelope } = require("../controllers/envelopes");

router.get("/", getEnvelopes);
router.get("/:id", getEnvelopeById);
router.post("/", createEnvelope);


module.exports = router;