const db = require("../db/connection");

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
exports.fetchAllReviews = () => {
	return db
		.query(
			`SELECT reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.category, reviews.review_id, COUNT(author)::INT AS comment_count
    FROM comments 
    LEFT JOIN reviews ON reviews.owner = comments.author
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`
		)
		.then((result) => result.rows);
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