const prisma = require("../../lib/prisma");

const listUsers = () =>
  prisma.user.findMany({
    orderBy: { createdAt: "desc" },
    select: {
      id: true,
      email: true,
      phone: true,
      createdAt: true,
      sheets: {
        orderBy: { updatedAt: "desc" },
        select: { id: true, title: true, createdAt: true, updatedAt: true },
      },
    },
  });

const listSheetsByUser = (userId) =>
  prisma.sheet.findMany({
    where: { ownerId: userId },
    orderBy: { updatedAt: "desc" },
    select: { id: true, title: true, content: true, createdAt: true, updatedAt: true },
  });

module.exports = { listUsers, listSheetsByUser };
