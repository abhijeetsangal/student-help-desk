const Query = require("../models/Query");
const asyncHandler = require("../middleware/asyncHandler");

// Get all student queries
exports.getAllQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find()
    .populate("student", "name email course")
    .sort({ createdAt: -1 });

  res.json({
    count: queries.length,
    queries,
  });
});

// Update query status
exports.updateQueryStatus = asyncHandler(async (req, res) => {
  const { status } = req.body;

  const allowedStatuses = ["Pending", "In Progress", "Resolved"];

  if (!allowedStatuses.includes(status)) {
    return res.status(400).json({
      message: "Invalid query status.",
    });
  }

  const query = await Query.findByIdAndUpdate(
    req.params.id,
    { status },
    { new: true, runValidators: true }
  ).populate("student", "name email course");

  if (!query) {
    return res.status(404).json({
      message: "Query not found.",
    });
  }

  res.json({
    message: "Query status updated successfully.",
    query,
  });
});