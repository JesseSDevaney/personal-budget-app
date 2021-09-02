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

});
