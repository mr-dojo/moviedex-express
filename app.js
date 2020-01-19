const express = require("express");
const morgan = require("morgan");
const helmet = require("helmet");
const movies = require("./movies.json");

const app = express();

app.use(morgan("dev"));
app.use(helmet());

