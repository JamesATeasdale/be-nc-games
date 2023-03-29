const express = require("express");
const app = express();
const {
	getAllCategories,
	getReview,
	getAllReviews,
	getReviewComments,
	postComment,
} = require("./controllers/app.controller");
const {
	notFound,
	badDataType,
	customErrors,
	lastResort,
} = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.get("/api/reviews", getAllReviews);

app.post("/api/reviews/:review_id/comments", postComment);

app.all("/*", notFound);

app.use(badDataType);
app.use(customErrors);
app.use(lastResort);


module.exports = app;
