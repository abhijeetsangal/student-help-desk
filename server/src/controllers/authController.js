const jwt = require("jsonwebtoken");
const User = require("../models/User");
const asyncHandler = require("../middleware/asyncHandler");

function signToken(id) {
  return jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "7d" });
}

function userData(user) {
  return { id: user._id, name: user.name, email: user.email, role: user.role, course: user.course };
}

exports.register = asyncHandler(async (req, res) => {
  const { name, email, password, course } = req.body;
  if (!name || !email || !password) {
    return res.status(400).json({ message: "Name, email and password are required" });
  }
  if (typeof password !== "string") {
    return res.status(400).json({ message: "Invalid password" });
  }

  const exists = await User.findOne({ email: String(email).toLowerCase().trim() });
  if (exists) return res.status(409).json({ message: "An account with this email already exists" });

  const user = await User.create({ name, email, password, course, role: "student" });
  res.status(201).json({ token: signToken(user._id), user: userData(user) });
});

exports.login = asyncHandler(async (req, res) => {
  const { email, password } = req.body;
  if (!email || !password || typeof password !== "string") {
    return res.status(400).json({ message: "Email and password are required" });
  }

  const user = await User.findOne({ email: String(email).toLowerCase().trim() }).select("+password");
  if (!user || !(await user.comparePassword(password))) {
    return res.status(401).json({ message: "Invalid email or password" });
  }

  res.json({ token: signToken(user._id), user: userData(user) });
});

exports.me = (req, res) => {
  res.json({ user: userData(req.user) });
};
