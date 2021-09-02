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

  describe("GET /envelopes/:name", function () {
    it("responds with json and the specified envelope", async function () {
      setTotalBudget(100);
      const envelope = {
        name: "groceries",
        amount: 55,
      };
      addEnvelope(envelope);

      const response = await request(app).get(`/envelopes/${envelope.name}`);

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body.envelope, envelope);
    });

    it("responds with 404 error since the resource does not exist", async function () {
      const response = await request(app).get("/envelopes/shopping");

      assert.strictEqual(response.status, 404);
    });
  });

  describe("PUT /envelopes/:name", function () {
    it("updates the given envelope amount and responds with json", async function () {
      setTotalBudget(200);
      const envelopeName = "groceries";
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      const envelopeUpdate = {
        name: envelopeName,
        amount: 75,
      };

      const body = { envelope: envelopeUpdate };
      const response = await request(app)
        .put(`/envelopes/${envelopeName}`)
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, body);
    });

    it("updates the given envelope amount and name and responds with json", async function () {
      setTotalBudget(200);
      const envelopeName = "groceries";
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      const envelopeUpdate = {
        name: "shopping",
        amount: 75,
      };

      const body = { envelope: envelopeUpdate };
      const response = await request(app)
        .put(`/envelopes/${envelopeName}`)
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 200);
      assert.deepStrictEqual(response.body, body);
    });

    it("returns a 404 error because envelope to update does not exist", async function () {
      const envelopeUpdate = {
        name: "shopping",
        amount: 75,
      };

      const body = { envelope: envelopeUpdate };
      const response = await request(app)
        .put("/envelopes/shopping")
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 404);
    });

    it("does not update and returns a 400 error because budgeted amount would be greater than total budget", async function () {
      setTotalBudget(200);
      const envelopeName = "groceries";
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      const envelopeUpdate = {
        name: envelopeName,
        amount: 250,
      };

      const body = { envelope: envelopeUpdate };
      const response = await request(app)
        .put(`/envelopes/${envelopeName}`)
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });

    it("does not update and returns a 400 error because update amount is not a number", async function () {
      setTotalBudget(200);
      const envelopeName = "groceries";
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      const envelopeUpdate = {
        name: envelopeName,
        amount: "hi",
      };

      const body = { envelope: envelopeUpdate };
      const response = await request(app)
        .put(`/envelopes/${envelopeName}`)
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });

    it("does not update and returns a 400 error because update amount is a negative number", async function () {
      setTotalBudget(200);
      const envelopeName = "groceries";
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      const envelopeUpdate = {
        name: envelopeName,
        amount: -5,
      };

      const body = { envelope: envelopeUpdate };
      const response = await request(app)
        .put(`/envelopes/${envelopeName}`)
        .set("Content-type", "application/json")
        .send(body);

      assert.strictEqual(response.status, 400);
    });
  });

  describe("DELETE /envelopes/:name", function () {
    it("deletes the given envelope since it exists and returns 204", async function () {
      setTotalBudget(200);
      const envelopeName = "groceries";
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      const response = await request(app).delete(`/envelopes/${envelopeName}`);

      assert.strictEqual(response.status, 204);
    });

    it("returns 404 since envelope does not exist", async function () {
      const envelopeName = "groceries";

      const response = await request(app).delete(`/envelopes/${envelopeName}`);

      assert.strictEqual(response.status, 404);
    });
  });
});
