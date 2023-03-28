exports.badDataType = (err, req, res, next) => {
	if (err.code === "22P02") res.status(400).send({ msg: "Bad Request" });
	else next(err);
};

exports.customErrors = (err, req, res, next) => {
	const { status, msg } = err;
	if (status && msg) {
		res.status(status).send({ msg });
	} else next(err);
};

exports.notFound = (req, res) => {
	res.status(404).send({ msg: "Not found" });
};
