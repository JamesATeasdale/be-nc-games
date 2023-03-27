const db = require("../db/connection");

exports.fetchCategories = () => {
	return db.query(`SELECT * FROM categories;`);
};

exports.fetchReview = (reviewId) => {
	return db.query("SELECT * FROM reviews WHERE review_id = $1", [reviewId]);
};