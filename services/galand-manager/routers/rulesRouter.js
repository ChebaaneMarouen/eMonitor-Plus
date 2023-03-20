const express = require("express");
const router = express.Router();
const { rulesController } = require("../controllers");
const { allow } = require("../services/checkRoles");

router.put("/:rulesId", allow("P_WEB_SCRAPPING_RULES", 2), rulesController.upsertRule);
router.post("/", allow("P_WEB_SCRAPPING_RULES", 2), rulesController.upsertRule);
router.delete("/:rulesId", allow("P_WEB_SCRAPPING_RULES", 2), rulesController.deleteRule);

module.exports = router;
