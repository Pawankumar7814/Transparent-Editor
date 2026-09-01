const prisma = require("../../lib/prisma");

const findAllByOwner = (ownerId) =>
  prisma.sheet.findMany({ where: { ownerId }, orderBy: { updatedAt: "desc" } });

const create = (data, ownerId) => prisma.sheet.create({ data: { ...data, ownerId } });

const findById = (id, ownerId) =>
  prisma.sheet.findFirst({ where: { id, ownerId } });

const update = (id, ownerId, data) =>
  prisma.sheet.updateMany({ where: { id, ownerId }, data });

const findByIdWithoutOwner = (id) => prisma.sheet.findUnique({ where: { id } });

const remove = (id, ownerId) =>
  prisma.sheet.deleteMany({ where: { id, ownerId } });

module.exports = { findAllByOwner, create, findById, update, findByIdWithoutOwner, remove };
