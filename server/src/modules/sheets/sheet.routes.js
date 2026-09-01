const express = require("express");
const auth = require("../../middleware/auth");
const controller = require("./sheet.controller");

const router = express.Router();

router.use(auth);
router.get("/", controller.list);
router.post("/", controller.create);
router.get("/:id", controller.get);
router.patch("/:id", controller.update);
router.delete("/:id", controller.remove);

module.exports = router;
