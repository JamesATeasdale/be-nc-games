exports.notFound = (req, res) => {
	res.status(404).send({ msg: "Not found" });
};
