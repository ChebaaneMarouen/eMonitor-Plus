const express = require("express");
const router = express.Router();
const { customDictionnariesController } = require("../controllers");
const { allow } = require("../services/checkRoles");

router.put("/:id", allow("P_DICTIONNARY", 2), customDictionnariesController.upsertCustomDictionary);
router.post("/", allow("P_DICTIONNARY", 2), customDictionnariesController.upsertCustomDictionary);
router.delete("/:id", allow("P_DICTIONNARY", 2), customDictionnariesController.deleteCustomDictionary);

module.exports = router;
