exports.badDataType = (err, req, res, next) =>
	err.code === "22P02" || err.code === "23502"
		? res.status(400).send({ msg: "Bad Request" })
		: next(err);

exports.customErrors = (err, req, res, next) => {
	const { status, msg } = err;
	if (status && msg) res.status(status).send({ msg });
	else next(err);
};

exports.lastResort = (err, req, res, next) => res.status(500).send(err);

exports.notFound = (req, res) => res.status(404).send({ msg: "Not found" });
