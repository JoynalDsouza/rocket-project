const express = require("express");
const cors = require("cors");
const path = require("path");

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
//serve static files from public folder
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/planets", planetsRouter);
app.get("/", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
