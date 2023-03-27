const { fetchCategories } = require("../models/app.models");

exports.getCategories = async (req, res, next) => {
	const categories = await fetchCategories();
	res.status(200).send(categories);
};
