function notFound(req, res) {
  res.status(404).json({ message: `Route not found: ${req.method} ${req.originalUrl}` });
}

function errorHandler(err, req, res, next) {
  if (err.type === "entity.parse.failed") {
    return res.status(400).json({ message: "Invalid JSON in request body" });
  }
  if (err.name === "ValidationError") {
    const message = Object.values(err.errors).map(e => e.message).join(", ");
    return res.status(400).json({ message });
  }
  if (err.name === "CastError") {
    return res.status(400).json({ message: "Invalid ID" });
  }
  if (err.code === 11000) {
    return res.status(409).json({ message: "An account with this email already exists" });
  }
  console.error(err);
  res.status(500).json({ message: "Something went wrong on the server" });
}

module.exports = { notFound, errorHandler };
