const assert = require("chai").assert;
const request = require("supertest");
const app = require("../server/server.js");
const {
  addEnvelope,
  resetEnvelopes,
  setTotalBudget,
} = require("../server/db.cjs");

describe("/envelopes routes", function () {
  beforeEach("initialize budget to 0, and reset envelopes", function () {
    resetEnvelopes();
    setTotalBudget(0);
  });

  describe("GET /envelopes", function () {
    it("responds with json and no envelopes", async function () {
      const response = await request(app).get("/envelopes");

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body.envelopes, []);
    });

    it("responds with json and all added envelopes", async function () {
      setTotalBudget(200);
      const expectedEnvelopes = [
        {
          name: "groceries",
          amount: 50,
        },
        {
          name: "shopping",
          amount: 25,
        },
      ];
      expectedEnvelopes.forEach((envelope) => addEnvelope(envelope));

      const response = await request(app).get("/envelopes");

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body.envelopes, expectedEnvelopes);
    });
  });

  describe("POST /envelopes", function () {
    it("responds with json and the added envelope", async function () {
      setTotalBudget(100);
      const envelope = {
        name: "groceries",
        amount: 50,
      };
      const body = { envelope };

      const response = await request(app)
        .post("/envelopes")
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 201);
      assert.deepStrictEqual(response.body, body);
    });

    it("responds with 400 error because budgeted amount would exceed total budget if added", async function () {
      setTotalBudget(100);
      const envelope = {
        name: "groceries",
        amount: 125,
      };
      const body = { envelope };

      const response = await request(app)
        .post("/envelopes")
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });

    it("responds with 400 error because name property is not a string", async function () {
      setTotalBudget(100);
      const envelope = {
        name: 56,
        amount: 125,
      };
      const body = { envelope };

      const response = await request(app)
        .post("/envelopes")
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });

    it("responds with 400 error because amount property is not a number", async function () {
      setTotalBudget(100);
      const envelope = {
        name: "groceries",
        amount: "hi",
      };
      const body = { envelope };

      const response = await request(app)
        .post("/envelopes")
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });

    it("responds with 400 error because amount property is negative", async function () {
      setTotalBudget(100);
      const envelope = {
        name: "groceries",
        amount: -50,
      };
      const body = { envelope };

      const response = await request(app)
        .post("/envelopes")
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });
  });
});
