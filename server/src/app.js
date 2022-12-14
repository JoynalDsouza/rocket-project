const express = require("express");
const cors = require("cors");
const path = require("path");
const morgan = require("morgan");

const app = express();

const apiRouter = require("./routes/api");

//cors middleware
app.use(
  cors({
    origin: "http://localhost:3000",
  })
);

app.use(morgan("combined"));

//json parser middleware
app.use(express.json());
//serve static files from public folder
app.use(express.static(path.join(__dirname, "..", "public")));

app.use("/v1", apiRouter);

app.get("/*", (req, res) => {
  res.sendFile(path.join(__dirname, "..", "public", "index.html"));
});

module.exports = app;
