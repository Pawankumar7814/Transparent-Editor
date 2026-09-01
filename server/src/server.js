const app = require("./app");
const prisma = require("./lib/prisma");
const { PORT } = require("./config/env");
const logger = require("./lib/logger");

const server = app.listen(PORT, () =>
  logger.info(`Transparent Editor API listening on ${PORT}`)
);

async function shutdown() {
  logger.info("Shutting down API");
  server.close();
  await prisma.$disconnect();
  process.exit(0);
}

process.on("SIGINT", shutdown);
process.on("SIGTERM", shutdown);
