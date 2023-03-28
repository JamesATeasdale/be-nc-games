const express = require("express");
const app = express();
const {
	getAllCategories,
	getReview,
	getAllReviews,
} = require("./controllers/app.controller");
const {
	notFound,
	badDataType,
	customErrors,
} = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews", getAllReviews);

app.all("/*", notFound);
app.use(badDataType);
app.use(customErrors);


module.exports = app;
