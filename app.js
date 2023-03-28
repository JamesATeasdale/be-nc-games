const express = require("express");
const app = express();
const { getCategories, getReview } = require("./controllers/app.controller");
const {
	notFound,
	badDataType,
	customErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api/categories", getCategories);

app.get("/api/reviews/:review_id", getReview);

app.all("/*", notFound);
app.use(badDataType);
app.use(customErrors);


module.exports = app;
