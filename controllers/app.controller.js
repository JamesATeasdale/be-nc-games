const {
	fetchAllCategories,
	fetchAllReviews,
	fetchReview,
	fetchReviewComments,
} = require("../models/app.models");

exports.getAllCategories = (req, res) => {
	fetchAllCategories().then((categories) =>
		res.status(200).send({ categories: categories.rows })
	);
};

exports.getReview = (req, res, next) => {
	const reviewId = req.params["review_id"];
	fetchReview(reviewId)
		.then((review) => res.status(200).send({ review }))
		.catch((err) => next(err));
};

exports.getAllReviews = (req, res, next) => {
	fetchAllReviews()
		.then((reviews) => res.status(200).send({ reviews }))
		.catch((err) => next(err));
};

exports.getReviewComments = (req, res, next) => {
	const reviewId = req.params["review_id"];
	Promise.all([fetchReviewComments(reviewId), fetchReview(reviewId)])
		.then((promises) => {
			const comments = promises[0];
			res.status(200).send({ comments });
		})
		.catch((err) => next(err));
};
