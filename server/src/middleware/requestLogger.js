const { randomUUID } = require("crypto");
const logger = require("../lib/logger");

function requestLogger(req, res, next) {
  const requestId = randomUUID();
  const startedAt = Date.now();
  req.requestId = requestId;

  logger.info("Request started", {
    requestId,
    method: req.method,
    path: req.originalUrl,
  });

  res.on("finish", () => {
    logger.info("Request completed", {
      requestId,
      method: req.method,
      path: req.originalUrl,
      status: res.statusCode,
      durationMs: Date.now() - startedAt,
    });
  });

  res.on("close", () => {
    if (!res.writableEnded) {
      logger.error("Request connection closed before response completed", {
        requestId,
        method: req.method,
        path: req.originalUrl,
      });
    }
  });

  next();
}

module.exports = requestLogger;
