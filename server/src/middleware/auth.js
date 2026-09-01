const jwt = require("jsonwebtoken");
const { JWT_SECRET } = require("../config/env");
const logger = require("../lib/logger");

function auth(req, res, next) {
  const token =
    req.headers.authorization?.startsWith("Bearer ") &&
    req.headers.authorization.slice(7);

  if (!token) {
    logger.info("Authentication token missing", { path: req.originalUrl });
    return res.status(401).json({ error: "Authentication required" });
  }

  try {
    req.user = jwt.verify(token, JWT_SECRET);
    logger.info("Authentication succeeded", { userId: req.user.sub });
    next();
  } catch {
    logger.info("Authentication failed", { path: req.originalUrl });
    return res.status(401).json({ error: "Invalid or expired token" });
  }
}

module.exports = auth;
