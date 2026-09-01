const bcrypt = require("bcrypt");
const { z } = require("zod");
const { ADMIN_EMAIL, ADMIN_ID, ADMIN_PASSWORD } = require("../../config/env");
const { adminToken } = require("../../lib/tokens");
const adminModel = require("./admin.model");
const adminPasswordHash = bcrypt.hash(ADMIN_PASSWORD, 12);

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});
const adminCredentials = z.object({
  email: z.string().trim().min(1).max(254),
  password: z.string().min(8).max(128),
});

async function login(req, res, next) {
  try {
    const { email: identifier, password } = adminCredentials.parse(req.body);
    const validIdentifier =
      identifier.toLowerCase() === ADMIN_EMAIL.toLowerCase() ||
      identifier.toLowerCase() === ADMIN_ID.toLowerCase();
    const validPassword = await bcrypt.compare(password, await adminPasswordHash);
    if (!validIdentifier || !validPassword) {
      return res.status(401).json({ error: "Invalid admin credentials" });
    }
    res.json({ token: adminToken(ADMIN_EMAIL), admin: { email: ADMIN_EMAIL, role: "admin" } });
  } catch (error) {
    next(error);
  }
}

async function users(_req, res, next) {
  try {
    res.json({ users: await adminModel.listUsers() });
  } catch (error) {
    next(error);
  }
}

async function sheetsByUser(_req, res, next) {
  try {
    const userId = Number(_req.params.userId);
    if (!Number.isInteger(userId) || userId < 1) {
      return res.status(400).json({ error: "Invalid user ID" });
    }
    res.json({ userId, sheets: await adminModel.listSheetsByUser(userId) });
  } catch (error) {
    next(error);
  }
}

module.exports = { login, users, sheetsByUser };
