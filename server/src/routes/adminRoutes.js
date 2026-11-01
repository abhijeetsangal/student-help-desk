const express = require("express");

const protect = require("../middleware/auth");
const restrictTo = require("../middleware/role");

const {
  getAllQueries,
  updateQueryStatus,
} = require("../controllers/adminController");

const router = express.Router();

// Only authenticated admins can access these routes
router.get("/queries", protect, restrictTo("admin"), getAllQueries);

router.patch(
  "/queries/:id",
  protect,
  restrictTo("admin"),
  updateQueryStatus
);

module.exports = router;