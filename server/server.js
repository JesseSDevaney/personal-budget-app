const express = require("express");
const app = express();
const morgan = require("morgan");
const cors = require("cors");
const errorhandler = require("errorhandler");
const budgetRouter = require("./routes/budget.cjs");
const envelopesRouter = require("./routes/envelopes.cjs");

const PORT = process.env.PORT || 3000;

app.use(cors());
app.use(morgan("tiny"));
app.use(express.json());

app.get("/", (req, res) => {
  res.send("Hello, World");
});

app.use("/budget", budgetRouter);

app.use("/envelopes", envelopesRouter);

if (process.env.NODE_ENV === "development") {
  app.use(errorhandler());
}

if (process.env.NODE_ENV !== "test") {
  app.listen(PORT, () => {
    console.log(`Server started listened at http://localhost:${PORT}`);
  });
}

module.exports = app;
