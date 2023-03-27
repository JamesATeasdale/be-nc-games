const { fetchCategories, fetchReview } = require("../models/app.models");

exports.getCategories = async (req, res) => {
	const categories = await fetchCategories();
	res.status(200).send({ categories: categories.rows });
};

exports.getReview = async (req, res, next) => {
	const reviewId = req.params["review_id"];
  try {
		const review = await fetchReview(reviewId);
		review.rowCount === 0
			? next()
			: res.status(200).send({ review: review.rows });
	} catch (err) {
		next(err);
	}
};
