const { allow } = require("../services/checkRoles");
const express = require("express");
const router = express.Router();
const { customSearchController } = require("../controllers");

router.get("/", allow("P_CUSTOM_SEARCH", 1), customSearchController.getCustomSearches);

router.put("/:id", allow("P_CUSTOM_SEARCH", 2), customSearchController.updateCustomSearch);

router.post("/", allow("P_CUSTOM_SEARCH", 2), customSearchController.createCustomSearch);

router.delete("/:id", allow("P_CUSTOM_SEARCH", 2), customSearchController.removeCustomSearch);
module.exports = router;
