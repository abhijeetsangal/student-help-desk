const express = require("express");
const protect = require("../middleware/auth");

const {
  createQuery,
  getMyQueries,
} = require("../controllers/queryController");

const router = express.Router();

// Submit a query
router.post("/", protect, createQuery);

// Get logged-in student's queries
router.get("/my", protect, getMyQueries);

module.exports = router;