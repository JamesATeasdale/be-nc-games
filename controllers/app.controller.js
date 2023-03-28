const { fetchCategories, fetchReview } = require("../models/app.models");

exports.getCategories = (req, res) => {
	fetchCategories().then((categories) =>
		res.status(200).send({ categories: categories.rows })
	);
};

exports.getReview = (req, res, next) => {
	const reviewId = req.params["review_id"];
	fetchReview(reviewId)
		.then((review) => res.status(200).send({ review }))
		.catch((err) => next(err));
};
