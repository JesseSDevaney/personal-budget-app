const assert = require("chai").assert;
const {
  addEnvelope,
  deleteEnvelope,
  getAmountAvailable,
  getEnvelope,
  getTotalBudget,
  setTotalBudget,
  resetEnvelopes,
  transferEnvelopeAmount,
  updateEnvelope,
} = require("../server/db.cjs");

describe("Envelope Database", function () {
  beforeEach("initialize budget to 0, and reset envelopes", function () {
    resetEnvelopes();
    setTotalBudget(0);
  });

  describe("addEnvelope(envelope)", function () {
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

  describe("setBudget(amount)", function () {
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

  describe("updateEnvelope(name, envelopeUpdates)", function () {
    it("when new amount budgeted less than totalBudget, expect envelope to be updated", function () {
      const envelopeName = "groceries";
      setTotalBudget(100);
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });
      const envelopeUpdate = {
        name: envelopeName,
        amount: 90,
      };

      const result = updateEnvelope(envelopeName, envelopeUpdate);

      assert.deepStrictEqual(result, envelopeUpdate);
    });

    it("when new amount budgeted less than totalBudget, expect envelope to be updated with new name", function () {
      const envelopeName = "groceries";
      setTotalBudget(100);
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });
      const envelopeUpdate = {
        name: "shopping",
        amount: 90,
      };

      const result = updateEnvelope(envelopeName, envelopeUpdate);

      assert.deepStrictEqual(result, envelopeUpdate);
    });

    it("when new amount budgeted greater than totalBudget, expect error to be thrown", function () {
      const envelopeName = "groceries";
      setTotalBudget(100);
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });
      const envelopeUpdate = {
        name: envelopeName,
        amount: 150,
      };

      assert.throws(
        () => updateEnvelope(envelopeName, envelopeUpdate),
        RangeError
      );
    });

    it("when envelope update amount has a non-numeric value, expect TypeError to be thrown", function () {
      const envelopeName = "groceries";
      setTotalBudget(100);
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });
      const envelopeUpdate = {
        name: envelopeName,
        amount: "hi",
      };

      assert.throws(
        () => updateEnvelope(envelopeName, envelopeUpdate),
        TypeError
      );
    });

    it("when envelope update string has a non-string value, expect TypeError to be thrown", function () {
      const envelopeName = "groceries";
      setTotalBudget(100);
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });
      const envelopeUpdate = {
        name: 566,
        amount: 45,
      };

      assert.throws(
        () => updateEnvelope(envelopeName, envelopeUpdate),
        TypeError
      );
    });
  });

  describe("deleteEnvelope(name)", function () {
    it("expect envelope to be deleted", function () {
      const envelopeName = "groceries";
      setTotalBudget(100);
      addEnvelope({
        name: envelopeName,
        amount: 50,
      });

      deleteEnvelope(envelopeName);
      const envelopeExists = getEnvelope(envelopeName);

      assert.notOk(envelopeExists);
    });
  });

  describe("transferEnvelopeAmount(name)", function () {
    it("expect envelope amount to be transferred and envelopes to be updated", function () {
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 40,
      });
      addEnvelope({
        name: "shopping",
        amount: 50,
      });
      const expectedGroceryAfterTransfer = {
        name: "groceries",
        amount: 10,
      };
      const expectedShoppingAfterTransfer = {
        name: "shopping",
        amount: 80,
      };

      const groceryEnvelope = getEnvelope("groceries");
      const shoppingEnvelope = getEnvelope("shopping");

      transferEnvelopeAmount(groceryEnvelope, shoppingEnvelope, 30);

      assert.deepStrictEqual(groceryEnvelope, expectedGroceryAfterTransfer);
      assert.deepStrictEqual(shoppingEnvelope, expectedShoppingAfterTransfer);
    });

    it("expect RangeError to be thrown because of insufficient envelope balance", function () {
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 40,
      });
      addEnvelope({
        name: "shopping",
        amount: 50,
      });
      const groceryEnvelope = getEnvelope("groceries");
      const shoppingEnvelope = getEnvelope("shopping");

      assert.throws(
        () => transferEnvelopeAmount(groceryEnvelope, shoppingEnvelope, 60),
        RangeError
      );
    });

    it("expect RangeError to be thrown because of negative amount transfer", function () {
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 40,
      });
      addEnvelope({
        name: "shopping",
        amount: 50,
      });
      const groceryEnvelope = getEnvelope("groceries");
      const shoppingEnvelope = getEnvelope("shopping");

      assert.throws(
        () => transferEnvelopeAmount(groceryEnvelope, shoppingEnvelope, -10),
        RangeError
      );
    });

    it("expect TypeError to be thrown because of non-numeric amount", function () {
      setTotalBudget(100);
      addEnvelope({
        name: "groceries",
        amount: 40,
      });
      addEnvelope({
        name: "shopping",
        amount: 50,
      });
      const groceryEnvelope = getEnvelope("groceries");
      const shoppingEnvelope = getEnvelope("shopping");

      assert.throws(
        () =>
          transferEnvelopeAmount(
            groceryEnvelope,
            shoppingEnvelope,
            "this much"
          ),
        TypeError
      );
    });
  });
});
