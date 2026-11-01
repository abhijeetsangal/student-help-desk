const Query = require("../models/Query");
const asyncHandler = require("../middleware/asyncHandler");

exports.createQuery = asyncHandler(async (req, res) => {
  const { subject, description, category } = req.body;

  if (
    !subject?.trim() ||
    !description?.trim() ||
    typeof subject !== "string" ||
    typeof description !== "string"
  ) {
    return res.status(400).json({
      message: "Subject and description are required.",
    });
  }

  if (subject.length > 150 || description.length > 2000) {
    return res.status(400).json({
      message: "Input exceeds the allowed length.",
    });
  }

  const query = await Query.create({
    student: req.user._id,
    subject,
    description,
    category: category || "Other",
  });

  res.status(201).json({
    message: "Query submitted successfully.",
    query,
  });
});

exports.getMyQueries = asyncHandler(async (req, res) => {
  const queries = await Query.find({
    student: req.user._id,
  }).sort({ createdAt: -1 });

  res.json({
    count: queries.length,
    queries,
  });
});