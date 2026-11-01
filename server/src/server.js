require("dotenv").config();
const connectDB = require("./config/db");
const app = require("./app");

const required = ["MONGODB_URI", "JWT_SECRET", "GEMINI_API_KEY", "GEMINI_MODEL", "CLIENT_URL"];
const missing = required.filter(name => !process.env[name]);
if (missing.length) {
  console.error("Missing values in server/.env: " + missing.join(", "));
  process.exit(1);
}

const PORT = process.env.PORT || 5000;

connectDB()
  .then(() => app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`)))
  .catch(err => {
    console.error("MongoDB connection failed: " + err.message);
    process.exit(1);
  });
