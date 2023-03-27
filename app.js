const express = require("express");
const app = express();
const { getCategories } = require("./controllers/app.controller");
const { notFound } = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.all("/*", notFound);

module.exports = app;
