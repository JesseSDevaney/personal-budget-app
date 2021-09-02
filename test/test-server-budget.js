const assert = require("chai").assert;
const request = require("supertest");
const app = require("../server/server.js");
const {
  addEnvelope,
  resetEnvelopes,
  setTotalBudget,
} = require("../server/db.cjs");

describe("GET /budget", function () {
  beforeEach("", function () {
    resetEnvelopes();
    setTotalBudget(0);
  });

  it("responds with json and the correct totalBudget and budgetAvailable", async function () {
    const expectedTotalBudget = 100;
    const expectedAmountAvailable = 50;
    setTotalBudget(100);
    addEnvelope({
      name: "groceries",
      amount: 50,
    });

    const response = await request(app).get("/budget");

    assert.strictEqual(response.body.totalBudget, expectedTotalBudget);
    assert.strictEqual(response.body.amountAvailable, expectedAmountAvailable);
  });
});
