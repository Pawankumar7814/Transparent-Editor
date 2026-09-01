const express = require("express");
const adminAuth = require("../../middleware/adminAuth");
const controller = require("./admin.controller");

const router = express.Router();
router.post("/login", controller.login);
router.get("/users", adminAuth, controller.users);
router.get("/users/:userId/sheets", adminAuth, controller.sheetsByUser);

module.exports = router;
