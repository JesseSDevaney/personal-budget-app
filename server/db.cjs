let totalBudget = 0;
const envelopes = [];

const isValidEnvelopeProperties = (envelope) => {
  if (envelope.name === "" || typeof envelope.name !== "string") {
    throw new TypeError("name must be a non-empty string");
  }

  if (
    !envelope.amount ||
    typeof envelope.amount !== "number" ||
    envelope.amount < 0
  ) {
    throw new TypeError("amount must be a non-negative number");
  }

  return true;
};

const isValidEnvelope = (envelope) => {
  if (!isValidEnvelopeProperties(envelope)) {
    return false;
  }

  const amountAvailable = getAmountAvailable();
  if (amountAvailable < envelope.amount) {
    throw new RangeError(
      "Amount budgeted cannot be greater than total budget."
    );
  }

  const envelopeIndex = envelopes.findIndex(
    (item) => item.name === envelope.name
  );
  if (envelopeIndex !== -1) {
    throw new Error("Envelope with that name already exists");
  }

  return true;
};

const addEnvelope = (newEnvelope) => {
  const validEnvelope = isValidEnvelope(newEnvelope);
  if (validEnvelope) {
    envelopes.push({
      name: newEnvelope.name,
      amount: newEnvelope.amount,
    });
  }
};

const getAllEnvelopes = () => {
  return envelopes;
};

const getEnvelope = (name) => {
  return envelopes.find((envelope) => envelope.name === name);
};

const getAmountAvailable = () => {
  return getTotalBudget() - getAmountBudgeted();
};

const getAmountBudgeted = () => {
  let amountBudgeted = 0;

  envelopes.forEach((item) => {
    amountBudgeted += item.amount;
  });

  return amountBudgeted;
};

const getTotalBudget = () => {
  return totalBudget;
};

const resetEnvelopes = () => {
  while (envelopes.length > 0) {
    envelopes.pop();
  }
};

const setTotalBudget = (newBudget) => {
  if (typeof newBudget !== "number") {
    throw new TypeError("Amount must be a number");
  }

  if (newBudget < 0) {
    throw new RangeError("Amount must be a non-negative number");
  }

  if (newBudget < getAmountBudgeted()) {
    throw new RangeError(
      "Total budget cannot be less than the amount budgeted in envelopes"
    );
  }

  totalBudget = newBudget;
};

const updateEnvelope = (name, envelopeUpdate) => {
  const currentEnvelope = getEnvelope(name);
  const envelopeCheck = {
    name: envelopeUpdate.name,
    amount: envelopeUpdate.amount - currentEnvelope.amount,
  };

  if (!isValidEnvelopeProperties(envelopeCheck)) {
    throw new Error("Envelope does not have valid properties");
  }

  if (envelopeCheck.amount > getAmountAvailable()) {
    throw new RangeError(
      "New budget amount put budgeted amount over total budget"
    );
  }

  currentEnvelope.name = envelopeUpdate.name;
  currentEnvelope.amount = envelopeUpdate.amount;
  return currentEnvelope;
};

module.exports = {
  addEnvelope,
  getAllEnvelopes,
  getAmountAvailable,
  getEnvelope,
  getTotalBudget,
  setTotalBudget,
  resetEnvelopes,
  isValidEnvelope,
  updateEnvelope,
};
