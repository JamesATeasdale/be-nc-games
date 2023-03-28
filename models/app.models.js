const db = require("../db/connection");

exports.fetchAllCategories = () => db.query(`SELECT * FROM categories;`);

exports.fetchReview = (reviewId) =>
	db
		.query("SELECT * FROM reviews WHERE review_id = $1", [reviewId])
		.then((result) =>
			result.rowCount === 0
				? Promise.reject({ status: 404, msg: "Not found" })
				: result.rows
		);

exports.fetchAllReviews = () =>
	db
		.query(
			`SELECT reviews.title, reviews.designer, reviews.owner, reviews.review_img_url, reviews.created_at, reviews.votes, reviews.category, reviews.review_id, COUNT(author)::INT AS comment_count
    FROM comments 
    LEFT JOIN reviews ON reviews.owner = comments.author
    GROUP BY reviews.review_id
    ORDER BY reviews.created_at DESC;`
		)
		.then((result) => result.rows);