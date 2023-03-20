const express = require("express");
const router = express.Router();
const { modelsController } = require("../controllers");
const { allow } = require("../services/checkRoles");

router.put("/:id", allow("P_MACHINE_LEARNING_MODELS", 2), modelsController.upsertModel);
router.post("/", allow("P_MACHINE_LEARNING_MODELS", 2), modelsController.upsertModel);
router.delete("/:id", allow("P_MACHINE_LEARNING_MODELS", 2), modelsController.deleteModel);

module.exports = router;
