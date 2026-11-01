require("dotenv").config();
const mongoose = require("mongoose");
const connectDB = require("../config/db");
const User = require("../models/User");

async function seed() {
  const { ADMIN_NAME, ADMIN_EMAIL, ADMIN_PASSWORD, MONGODB_URI } = process.env;
  if (!MONGODB_URI || !ADMIN_NAME || !ADMIN_EMAIL || !ADMIN_PASSWORD) {
    console.error("Fill MONGODB_URI, ADMIN_NAME, ADMIN_EMAIL and ADMIN_PASSWORD in server/.env first");
    process.exit(1);
  }

  await connectDB();

  let admin = await User.findOne({ email: ADMIN_EMAIL.toLowerCase().trim() });
  if (admin) {
    admin.name = ADMIN_NAME;
    admin.password = ADMIN_PASSWORD;
    admin.role = "admin";
    await admin.save();
    console.log("Existing account updated and set as admin: " + admin.email);
  } else {
    admin = await User.create({ name: ADMIN_NAME, email: ADMIN_EMAIL, password: ADMIN_PASSWORD, role: "admin" });
    console.log("Admin account created: " + admin.email);
  }

  await mongoose.disconnect();
}

seed().catch(err => {
  console.error("Seeding failed: " + err.message);
  process.exit(1);
});
