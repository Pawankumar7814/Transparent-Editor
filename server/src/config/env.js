const path = require("path");
require("dotenv").config({ path: path.resolve(__dirname, "../../.env") });

const PORT = process.env.PORT || 4000;
const JWT_SECRET = process.env.JWT_SECRET;
const DATABASE_URL = process.env.DATABASE_URL;
const ADMIN_EMAIL = process.env.ADMIN_EMAIL;
const ADMIN_ID = process.env.ADMIN_ID || "admin";
const ADMIN_PASSWORD = process.env.ADMIN_PASSWORD;

if (!JWT_SECRET) throw new Error("JWT_SECRET is required");
if (!DATABASE_URL) throw new Error("DATABASE_URL is required");
if (!ADMIN_EMAIL || !ADMIN_PASSWORD) throw new Error("ADMIN_EMAIL and ADMIN_PASSWORD are required");

module.exports = {
  PORT,
  JWT_SECRET,
  DATABASE_URL,
  ADMIN_EMAIL,
  ADMIN_ID,
  ADMIN_PASSWORD,
  CLIENT_URL: process.env.CLIENT_URL || "http://localhost:5173",
};
