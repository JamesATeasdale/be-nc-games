const { fetchCategories, fetchReview } = require("../models/app.models");

exports.getCategories = async (req, res) => {
	const categories = await fetchCategories();
	res.status(200).send({ categories: categories.rows });
};

exports.getReview = async (req, res, next) => {
	const reviewId = req.params["review_id"];
	const review = await fetchReview(reviewId);
	if (review.code === "22P02") next(review);
	else if (review.rowCount === 0) next();
	else res.status(200).send({ review: review.rows });
};
