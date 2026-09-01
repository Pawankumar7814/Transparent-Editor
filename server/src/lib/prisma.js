const { PrismaClient } = require("@prisma/client");
const logger = require("./logger");

const prisma = new PrismaClient({
  log: [
    { emit: "event", level: "query" },
    { emit: "event", level: "error" },
  ],
});

prisma.$on("query", (event) => {
  logger.info("Database query", {
    durationMs: event.duration,
    query: event.query,
  });
});

prisma.$on("error", (event) => {
  logger.error("Database error", { message: event.message });
});

module.exports = prisma;
