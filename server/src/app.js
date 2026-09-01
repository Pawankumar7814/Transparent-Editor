const express = require("express");
const cors = require("cors");
const { z } = require("zod");
const { CLIENT_URL } = require("./config/env");
const requestLogger = require("./middleware/requestLogger");
const logger = require("./lib/logger");
const authRoutes = require("./modules/auth/auth.routes");
const sheetRoutes = require("./modules/sheets/sheet.routes");
const adminRoutes = require("./modules/admin/admin.routes");

const app = express();

app.use(cors({ origin: CLIENT_URL }));
app.use(express.json({ limit: "1mb" }));
app.use(requestLogger);
app.get("/api/health", (_req, res) => res.json({ ok: true }));
app.use("/api/auth", authRoutes);
app.use("/api/sheets", sheetRoutes);
app.use("/api/admin", adminRoutes);

app.use((err, _req, res, _next) => {
  const requestId = _req.requestId;
  if (err instanceof z.ZodError) {
    logger.error("Validation error", {
      requestId,
      path: _req.originalUrl,
      issues: err.issues.map((issue) => issue.message),
    });
    return res.status(400).json({ error: err.issues[0].message, requestId });
  }
  logger.error("Unhandled request error", {
    requestId,
    method: _req.method,
    path: _req.originalUrl,
    message: err.message,
    stack: err.stack,
  });
  res.status(500).json({ error: "Internal server error", requestId });
});

module.exports = app;
