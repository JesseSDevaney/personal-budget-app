const express = require("express");
const { addEnvelope, getAllEnvelopes, getEnvelope } = require("../db.cjs");
const envelopesRouter = express.Router();

envelopesRouter.get("/", (req, res) => {
  const envelopes = getAllEnvelopes();

  res.status(200).json({ envelopes });
});

envelopesRouter.post("/", (req, res) => {
  try {
    addEnvelope(req.body.envelope);
    const envelope = getEnvelope(req.body.envelope.name);
    res.status(201).json({ envelope });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

envelopesRouter.param("name", (req, res, next, id) => {
  const envelope = getEnvelope(id);

  if (!envelope) {
    return res.status(404).send(`Envelope with name ${id} does not exist`);
  }

  req.envelope = envelope;
  next();
});

envelopesRouter.get("/:name", (req, res) => {
  res.status(200).send({ envelope: req.envelope });
});

module.exports = envelopesRouter;
