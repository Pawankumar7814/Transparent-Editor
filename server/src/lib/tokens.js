const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");

const tokenFor = (user) =>
  jwt.sign({ sub: user.id, email: user.email, role: "user" }, JWT_SECRET, { expiresIn: "7d" });

const adminToken = (email) =>
  jwt.sign({ sub: "admin", email, role: "admin" }, JWT_SECRET, { expiresIn: "2h" });

const safeUser = (user) => ({ id: user.id, email: user.email, phone: user.phone });

module.exports = { tokenFor, adminToken, safeUser };
