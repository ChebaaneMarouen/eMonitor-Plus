const express = require("express");
const router = express.Router();
const { dictionariesController } = require("../controllers");
const { allow } = require("../services/checkRoles");

router.put("/:id", allow("P_DICTIONNARY", 2), dictionariesController.upsertDictionary);
router.post("/", allow("P_DICTIONNARY", 2), dictionariesController.upsertDictionary);
router.delete("/:id", allow("P_DICTIONNARY", 2), dictionariesController.deleteDictionary);

module.exports = router;
