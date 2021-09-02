const express = require("express");
const budgetRouter = express.Router();
const {
  getTotalBudget,
  getAmountAvailable,
  setTotalBudget,
} = require("../db.cjs");

budgetRouter.get("/", (req, res) => {
  const response = {
    totalBudget: getTotalBudget(),
    amountAvailable: getAmountAvailable(),
  };
  res.status(200).json(response);
});

budgetRouter.put("/", (req, res) => {
  try {
    setTotalBudget(req.body.totalBudget);
    const responseBody = {
      totalBudget: getTotalBudget(),
    };

    res.status(200).send(responseBody);
  } catch (err) {
    res.status(400).send(err.message);
  }
});

module.exports = budgetRouter;
