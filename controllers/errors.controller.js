exports.notFound = (req, res) => {
	res.status(404).send({ msg: "Not found" });
};

exports.badDataType = (err, req, res, next) => {
	console.log(err);
	if (err.code === "22P02") res.status(400).send({ msg: "Bad Request" });
};