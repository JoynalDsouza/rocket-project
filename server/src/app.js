const express = require("express");

const app = express();

//json parser middleware

app.use(express.json());

module.exports = app;
