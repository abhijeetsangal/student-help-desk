const express = require("express");
const protect = require("../middleware/auth");
const { chat } = require("../controllers/chatController");

const router = express.Router();

// Protected AI chat endpoint
router.post("/", protect, chat);

module.exports = router;