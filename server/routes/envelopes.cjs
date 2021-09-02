const express = require("express");
const { getAllEnvelopes } = require("../db.cjs");
const envelopesRouter = express.Router();

envelopesRouter.get("/", (req, res) => {
  const envelopes = getAllEnvelopes();

  res.status(200).json({ envelopes });
});

module.exports = envelopesRouter;
