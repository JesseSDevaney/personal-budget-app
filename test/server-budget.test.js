const assert = require("chai").assert;
const request = require("supertest");
const app = require("../server/server.js");
const {
  addEnvelope,
  resetEnvelopes,
  setTotalBudget,
} = require("../server/db.cjs");

describe("/budget routes", function () {
  beforeEach("initialize budget to 0, and reset envelopes", function () {
    resetEnvelopes();
    setTotalBudget(0);
  });

  describe("GET /budget", function () {
    it("responds with json and the correct totalBudget and budgetAvailable", async function () {
      const expectedTotalBudget = 100;
      const expectedAmountAvailable = 50;
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 50,
      });

      const response = await request(app).get("/budget");

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.totalBudget, expectedTotalBudget);
      assert.strictEqual(
        response.body.amountAvailable,
        expectedAmountAvailable
      );
    });
  });

  describe("PUT /budget", function () {
    it("updates the totalBudget and responds with json", async function () {
      const body = {
        totalBudget: 100,
      };
      const expectedTotalBudget = 100;

      const response = await request(app)
        .put("/budget")
        .set("Content-type", "application/json")
        .send(body);
      const getResponse = await request(app).get("/budget");

      assert.strictEqual(response.status, 200);
      assert.strictEqual(response.body.totalBudget, expectedTotalBudget);

      assert.strictEqual(getResponse.body.totalBudget, expectedTotalBudget);
    });

    it("responds with 400 error due to negative budget. expect budget to remain the same before the request", async function () {
      const expectedTotalBudget = 50;
      setTotalBudget(50);

      const body = {
        totalBudget: -5,
      };
      const response = await request(app)
        .put("/budget")
        .set("Content-type", "application/json")
        .send(body);
      const getResponse = await request(app).get("/budget");

      assert.strictEqual(response.status, 400);

      assert.strictEqual(getResponse.body.totalBudget, expectedTotalBudget);
    });

    it("responds with 400 error due to value not being a number. expect budget to remain the same before the request", async function () {
      const expectedTotalBudget = 50;
      setTotalBudget(50);

      const body = {
        totalBudget: "hi",
      };
      const response = await request(app)
        .put("/budget")
        .set("Content-type", "application/json")
        .send(body);
      const getResponse = await request(app).get("/budget");

      assert.strictEqual(response.status, 400);

      assert.strictEqual(getResponse.body.totalBudget, expectedTotalBudget);
    });

    it("responds with 400 error due to totalBudget being less than amount budgeted in envelopes.", async function () {
      const expectedTotalBudget = 50;
      setTotalBudget(50);
      addEnvelope({
        name: "groceries",
        amount: 40,
      });

      const body = {
        totalBudget: 30,
      };
      const response = await request(app)
        .put("/budget")
        .set("Content-type", "application/json")
        .send(body);
      const getResponse = await request(app).get("/budget");

      assert.strictEqual(response.status, 400);

      assert.strictEqual(getResponse.body.totalBudget, expectedTotalBudget);
    });
  });
});
