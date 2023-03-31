const endpoints = require("../endpoints.json");
const {
	fetchAllCategories,
	fetchAllReviews,
	fetchReview,
	fetchReviewComments,
	addComment,
	changeReview,
	removeComment,
	fetchUsers,
	fetchUsername,
} = require("../models/app.models");

exports.getAllCategories = (req, res, next) =>
	fetchAllCategories()
		.then((categories) => res.status(200).send({ categories: categories.rows }))
		.catch((err) => next(err));

exports.getReview = (req, res, next) =>
	fetchReview(req.params.review_id)
		.then((review) => res.status(200).send({ review }))
		.catch((err) => next(err));

exports.getAllReviews = (req, res, next) => {
	const { sortBy = "created_at", orderBy = "DESC", category = "%" } = req.query;
	fetchAllReviews(sortBy, orderBy, category)
		.then((reviews) => res.status(200).send({ reviews }))
		.catch((err) => next(err));
};

exports.getReviewComments = (req, res, next) => {
	const reviewId = req.params.review_id;
	Promise.all([fetchReview(reviewId), fetchReviewComments(reviewId)])
		.then((promises) => res.status(200).send({ comments: promises[1] }))
		.catch((err) => next(err));
};

exports.postComment = (req, res, next) => {
	const reviewId = req.params.review_id;
	const user = req.body;
	Promise.all([fetchReview(reviewId), addComment(reviewId, user)])
		.then((promises) => res.status(201).send({ comment: promises[1] }))
		.catch((err) => next(err));
};

exports.patchReview = (req, res, next) => {
	const reviewId = req.params.review_id;
	const patch = req.body;
	Promise.all([fetchReview(reviewId), changeReview(reviewId, patch)])
		.then((promises) => res.status(200).send({ review: promises[1] }))
		.catch((err) => next(err));
};

exports.deleteComment = (req, res, next) => {
	const commentId = req.params.comment_id;
	removeComment(commentId)
		.then(() => res.status(204).send())
		.catch((err) => next(err));
};

exports.getUsers = (req, res, next) =>
	fetchUsers()
		.then((users) => res.status(200).send({ users: users.rows }))
		.catch((err) => next(err));

exports.getUsername = (req, res, next) => {
	const { username } = req.params;
	fetchUsername(username)
		.then((user) => {
			res.status(200).send({ user: user.rows });
		})
		.catch((err) => next(err));
};

exports.readEndpoint = (req, res, next) => res.status(200).send({ endpoints });
