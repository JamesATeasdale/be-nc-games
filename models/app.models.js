const db = require("../db/connection");
const { fetchAllCategories } = require("./app.models.js");

exports.fetchAllCategories = () => db.query(`SELECT * FROM categories;`);

exports.fetchReview = (reviewId) => {
	return db
		.query("SELECT * FROM reviews WHERE review_id = $1", [reviewId])
		.then((result) =>
			result.rowCount === 0
				? Promise.reject({ status: 404, msg: "Not found" })
				: result.rows
		);
};
exports.fetchAllReviews = (sortBy, orderBy, category) => {
	const sortByWhiteList = [
		"title",
		"designer",
		"owner",
		"review_img_url",
		"review_id",
		"category",
		"created_at",
		"votes",
	];
	if (!sortByWhiteList.includes(sortBy))
		return Promise.reject({ status: 400, msg: "Bad request" });
	else if (orderBy !== "ASC" && orderBy !== "DESC" && orderBy)
		return Promise.reject({ status: 400, msg: "Bad request" });
	else
		return db.query(`SELECT * FROM categories;`).then((categories) => {
			listOfCategories = categories.rows.map((category) => category.slug);

			let queryString = `SELECT title, designer, owner, review_img_url, reviews.created_at, reviews.votes, category, reviews.review_id, COUNT(author)::INT AS comment_count
    FROM reviews LEFT JOIN comments ON reviews.owner = comments.author `;
			queryString += "WHERE category LIKE CAST('" + category + "' AS varchar)";
			queryString += " GROUP BY reviews.review_id ";
			queryString += "ORDER BY " + sortBy + " " + orderBy;

			return db.query(queryString).then((result) => result.rows);
		});
};

exports.fetchReviewComments = (review_id) => {
	return db
		.query(
			"SELECT * FROM comments WHERE review_id = $1 ORDER BY created_at DESC",
			[review_id]
		)
		.then((result) => result.rows);
};
exports.addComment = (reviewId, user) => {
	return db
		.query(
			`INSERT INTO comments (review_id, author, body)
	VALUES ($1, $2, $3)
  RETURNING *;`,
			[reviewId, user["author"], user["body"]]
		)
		.then((postedComment) => postedComment.rows);
};

exports.changeReview = (reviewId, patch) => {
	return db
		.query(
			`UPDATE reviews SET votes = votes + $2 WHERE review_id = $1 RETURNING *`,
			[reviewId, patch.votes]
		)
		.then((updatedReview) => updatedReview.rows[0]);
};

exports.removeComment = (commentId) => {
	return db
		.query(`DELETE FROM comments WHERE comment_id = $1 RETURNING *;`, [
			commentId,
		])
		.then((result) =>
			result.rowCount === 0
				? Promise.reject({ status: 404, msg: "Not found" })
				: {}
		);
};

exports.fetchUsers = () => db.query("SELECT * FROM users");
