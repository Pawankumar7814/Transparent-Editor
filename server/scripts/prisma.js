const path = require("path");
const { spawnSync } = require("child_process");
const dotenv = require("dotenv");

const result = dotenv.config({ path: path.resolve(__dirname, "../.env") });
if (result.error) {
  console.error("Could not load server/.env. Copy server/.env.example to server/.env first.");
  process.exit(1);
}

if (!process.env.DATABASE_URL) {
  console.error("DATABASE_URL is missing from server/.env.");
  process.exit(1);
}

const prismaCommand = path.resolve(
  __dirname,
  `../node_modules/.bin/prisma${process.platform === "win32" ? ".cmd" : ""}`
);
const prisma = process.platform === "win32"
  ? spawnSync(process.env.ComSpec, [
      "/d",
      "/s",
      "/c",
      `"${prismaCommand}" ${process.argv.slice(2).join(" ")}`,
    ], { stdio: "inherit" })
  : spawnSync(prismaCommand, process.argv.slice(2), { stdio: "inherit" });

if (prisma.error) {
  console.error(`Could not start Prisma: ${prisma.error.message}`);
  process.exit(1);
}

process.exit(prisma.status ?? 1);
