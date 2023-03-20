const express = require("express");
const { statsController } = require("../controllers");
const router = express.Router();
const { allow } = require("../services/checkRoles");

router.get("/indicators", allow("P_ACCESS_STATISTICS", 1), statsController.getIndicators);

module.exports = router;
