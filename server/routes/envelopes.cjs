const express = require("express");
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

module.exports = envelopesRouter;
