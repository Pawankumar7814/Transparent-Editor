const prisma = require("../../lib/prisma");

const findByEmail = (email) => prisma.user.findUnique({ where: { email } });
const findByPhone = (phone) => prisma.user.findUnique({ where: { phone } });
const findById = (id) => prisma.user.findUnique({ where: { id } });

const createUser = (email, phone, passwordHash) =>
  prisma.user.create({ data: { email, phone, passwordHash } });

module.exports = { findByEmail, findByPhone, findById, createUser };
