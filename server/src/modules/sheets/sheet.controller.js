const { z } = require("zod");
const sheetModel = require("./sheet.model");
const logger = require("../../lib/logger");

const sheetInput = z.object({
  title: z.string().trim().min(1).max(120),
  content: z.string().max(500000).optional(),
});
const idParam = z.coerce.number().int().positive();

async function list(req, res, next) {
  try {
    logger.info("Listing sheets", { userId: req.user.sub });
    res.json(await sheetModel.findAllByOwner(Number(req.user.sub)));
  } catch (error) {
    next(error);
  }
}

async function create(req, res, next) {
  try {
    const data = sheetInput.parse(req.body);
    logger.info("Creating sheet", { userId: req.user.sub, title: data.title });
    res.status(201).json(await sheetModel.create(data, Number(req.user.sub)));
  } catch (error) {
    next(error);
  }
}

async function get(req, res, next) {
  try {
    logger.info("Loading sheet", { userId: req.user.sub, sheetId: req.params.id });
    const sheetId = idParam.parse(req.params.id);
    const sheet = await sheetModel.findById(sheetId, Number(req.user.sub));
    if (!sheet) return res.status(404).json({ error: "Sheet not found" });
    res.json(sheet);
  } catch (error) {
    next(error);
  }
}

async function update(req, res, next) {
  try {
    const data = sheetInput.partial().parse(req.body);
    const sheetId = idParam.parse(req.params.id);
    logger.info("Updating sheet", { userId: req.user.sub, sheetId });
    const result = await sheetModel.update(sheetId, Number(req.user.sub), data);
    if (!result.count) return res.status(404).json({ error: "Sheet not found" });
    res.json(await sheetModel.findByIdWithoutOwner(sheetId));
  } catch (error) {
    next(error);
  }
}

async function remove(req, res, next) {
  try {
    const sheetId = idParam.parse(req.params.id);
    logger.info("Deleting sheet", { userId: req.user.sub, sheetId });
    const result = await sheetModel.remove(sheetId, Number(req.user.sub));
    if (!result.count) return res.status(404).json({ error: "Sheet not found" });
    res.status(204).end();
  } catch (error) {
    next(error);
  }
}

module.exports = { list, create, get, update, remove };
