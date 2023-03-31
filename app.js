const express = require("express");
const app = express();
const {
	getAllCategories,
	getReview,
	getAllReviews,
	getReviewComments,
	postComment,
	patchReview,
	deleteComment,
	getUsers,
	readEndpoint,
	getUsername,
} = require("./controllers/app.controller");
const {
	notFound,
	badDataType,
	customErrors,
	errorChecker,
} = require("./controllers/errors.controller");

app.use(express.json());

app.get("/api/categories", getAllCategories);

app.get("/api/reviews/:review_id", getReview);

app.get("/api/reviews/:review_id/comments", getReviewComments);

app.get("/api/reviews", getAllReviews);

app.get("/api/users", getUsers);

app.get("/api", readEndpoint);

app.get("/api/users/:username", getUsername);

app.post("/api/reviews/:review_id/comments", postComment);

app.patch("/api/reviews/:review_id", patchReview);

app.delete("/api/comments/:comment_id", deleteComment);

app.all("/*", notFound);
app.use(badDataType);
app.use(customErrors);
app.use(errorChecker);

module.exports = app;