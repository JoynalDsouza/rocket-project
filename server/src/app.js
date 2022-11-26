const express = require("express");
const cors = require("cors");

const planetsRouter = require("./routes/planets/planets.router");

const app = express();

//cors middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

//json parser middleware
app.use(express.json());

app.use("/planets", planetsRouter);

module.exports = app;
