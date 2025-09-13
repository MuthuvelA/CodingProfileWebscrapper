const express = require("express");
const bodyParser = require("body-parser");
const cors = require("cors");
const route = require("./routers/codingProfileExtractRoute");
const app = express();

app.use(cors());
app.use(bodyParser.json());
app.use('/webscrap',route);

module.exports = app;

