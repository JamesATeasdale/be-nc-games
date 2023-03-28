const db = require("../db/connection");

exports.fetchCategories = () => db.query(`SELECT * FROM categories;`);

exports.fetchReview = (reviewId) =>
	db
		.query("SELECT * FROM reviews WHERE review_id = $1", [reviewId])
		.then((result) =>
			result.rowCount === 0
				? Promise.reject({ status: 404, msg: "Not found" })
				: result.rows
		);
