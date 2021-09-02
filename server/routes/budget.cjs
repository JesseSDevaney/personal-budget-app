const express = require("express");
const budgetRouter = express.Router();
const { getTotalBudget, getAmountAvailable } = require("../db.cjs");

budgetRouter.get("/", (req, res) => {
  const response = {
    totalBudget: getTotalBudget(),
    amountAvailable: getAmountAvailable(),
  };
  res.status(200).json(response);
});

module.exports = budgetRouter;
