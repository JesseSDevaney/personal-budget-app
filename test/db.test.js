const assert = require("chai").assert;
const {
  addEnvelope,
  getAmountAvailable,
  getEnvelope,
  getTotalBudget,
  setTotalBudget,
  resetEnvelopes,
} = require("../server/db.cjs");

describe("Envelope Database", function () {
  beforeEach("initialize budget to 0, and reset envelopes", function () {
    resetEnvelopes();
    setTotalBudget(0);
  });

  describe("addEnvelope()", function () {
    it("when amount budgeted + envelope amount less than totalBudget, expect envelope to be added", function () {
      setTotalBudget(50);

      const expected = {
        name: "groceries",
        amount: 25,
      };

      addEnvelope(expected);
      const result = getEnvelope("groceries");

      assert.deepStrictEqual(result, expected);
    });

    it("when amount budgeted + envelope amount greater than totalBudget, expect addEnvelope to throw a RangeError", function () {
      setTotalBudget(50);

      addEnvelope({
        name: "entertainment",
        amount: 30,
      });

      const envelope = {
        name: "groceries",
        amount: 25,
      };

      assert.throws(() => addEnvelope(envelope), RangeError);
    });
  });

  describe("getAmountAvailable()", function () {
    it("when no envelopes have been added, expect amount available to equal totalBudget", function () {
      setTotalBudget(50);
      const expected = getTotalBudget();

      const result = getAmountAvailable();

      assert.strictEqual(result, expected);
    });

    it("when 1 envelope with amount 50 has been added, expect amount available to equal totalBudget - 50", function () {
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 50,
      });
      const expected = getTotalBudget() - 50;

      const result = getAmountAvailable();

      assert.strictEqual(result, expected);
    });
  });

  describe("setBudget()", function () {
    it("expect setBudget(5) to set budget to 5", function () {
      const amount = 5;
      const expected = 5;

      setTotalBudget(amount);
      const result = getTotalBudget();

      assert.strictEqual(result, expected);
    });

    it("expect setBudget(10) to set budget to 10", function () {
      const amount = 10;
      const expected = 10;

      setTotalBudget(amount);
      const result = getTotalBudget();

      assert.strictEqual(result, expected);
    });

    it("expect setting budget to a negative number to throw an RangeError", function () {
      const amount = -5;

      assert.throws(() => setTotalBudget(amount), RangeError);
    });

    it("expect setting budget to a non-number type to throw an TypeError", function () {
      const amount = "hi";

      assert.throws(() => setTotalBudget(amount), TypeError);
    });

    it("expect setting budget to a number less than the amount in budgeted envelopes to throw a RangeError", function () {
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 50,
      });

      const amount = 25;

      assert.throws(() => setTotalBudget(amount), RangeError);
    });
  });
});
