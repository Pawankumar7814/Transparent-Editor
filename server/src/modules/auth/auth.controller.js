const bcrypt = require("bcrypt");
const { z } = require("zod");
const authModel = require("./auth.model");
const { tokenFor, safeUser } = require("../../lib/tokens");
const logger = require("../../lib/logger");

const credentials = z.object({
  email: z.string().email(),
  password: z.string().min(8).max(128),
});

const registrationCredentials = credentials.extend({
  phone: z.string().trim().min(7).max(20).regex(/^[+\d\s().-]+$/, "Enter a valid phone number"),
});

async function register(req, res, next) {
  try {
    const { email, phone, password } = registrationCredentials.parse(req.body);
    const normalizedEmail = email.toLowerCase();
    const normalizedPhone = phone.trim();
    logger.info("Registering user", { email: normalizedEmail });
    const exists = await authModel.findByEmail(normalizedEmail);
    if (exists) return res.status(409).json({ error: "Email is already registered" });
    const phoneExists = await authModel.findByPhone(normalizedPhone);
    if (phoneExists) return res.status(409).json({ error: "Phone number is already registered" });

    const user = await authModel.createUser(
      normalizedEmail,
      normalizedPhone,
      await bcrypt.hash(password, 12)
    );
    res.status(201).json({ user: safeUser(user), token: tokenFor(user) });
    logger.info("User registered", { userId: user.id });
  } catch (error) {
    next(error);
  }
}

async function login(req, res, next) {
  try {
    const { email, password } = credentials.parse(req.body);
    const user = await authModel.findByEmail(email.toLowerCase());
    if (!user || !(await bcrypt.compare(password, user.passwordHash))) {
      return res.status(401).json({ error: "Invalid email or password" });
    }
    res.json({ user: safeUser(user), token: tokenFor(user) });
    logger.info("User logged in", { userId: user.id });
  } catch (error) {
    next(error);
  }
}

async function me(req, res, next) {
  try {
    const user = await authModel.findById(Number(req.user.sub));
    if (!user) return res.status(401).json({ error: "User not found" });
    res.json({ user: safeUser(user) });
    logger.info("Loaded current user", { userId: user.id });
  } catch (error) {
    next(error);
  }
}

module.exports = { register, login, me };
