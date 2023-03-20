const express = require("express");
const router = express.Router();
const { feedController } = require("../controllers");
const { allow } = require("../services/checkRoles");

router.put("*", feedController.update);
router.post("/search", feedController.search);
router.get("/", feedController.search);
router.get("/description", feedController.describe);
router.get("/display", feedController.displayConfig);
router.get("/:feedId", feedController.getOne);

module.exports = router;
