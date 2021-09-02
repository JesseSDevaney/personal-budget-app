const express = require("express");
const { transferEnvelopeAmount } = require("../db.cjs");
const {
  addEnvelope,
  deleteEnvelope,
  getAllEnvelopes,
  getEnvelope,
  updateEnvelope,
} = require("../db.cjs");
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

envelopesRouter.put("/:name", (req, res) => {
  try {
    const envelopeUpdate = req.body.envelope;
    const updatedEnvelope = updateEnvelope(req.envelope.name, envelopeUpdate);
    res.status(200).send({ envelope: updatedEnvelope });
  } catch (err) {
    res.status(400).send(err.message);
  }
});

envelopesRouter.delete("/:name", (req, res) => {
  deleteEnvelope(req.envelope.name);
  res.status(204).send();
});

envelopesRouter.param("from", (req, res, next, id) => {
  const fromEnvelope = getEnvelope(id);

  if (!fromEnvelope) {
    return res.status(404).send(`Envelope with name ${id} does not exist`);
  }

  req.fromEnvelope = fromEnvelope;
  next();
});

envelopesRouter.param("to", (req, res, next, id) => {
  const toEnvelope = getEnvelope(id);

  if (!toEnvelope) {
    return res.status(404).send(`Envelope with name ${id} does not exist`);
  }

  req.toEnvelope = toEnvelope;
  next();
});

envelopesRouter.put("/:from/:to", (req, res) => {
  try {
    const envelopes = transferEnvelopeAmount(
      req.fromEnvelope,
      req.toEnvelope,
      req.body.amount
    );
    res.status(200).send(envelopes);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = envelopesRouter;
