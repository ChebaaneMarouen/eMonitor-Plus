const express = require("express");
const router = express.Router();
const { allow } = require("../services/checkRoles");
const { tagsController } = require("../controllers");
router.get("/", allow("P_TAGS", 1), tagsController.getTags);

router.put("/:id", allow("P_TAGS", 2), tagsController.updateTag);

router.post("/", allow("P_TAGS", 2), tagsController.createTag);

router.delete("/:id", allow("P_TAGS", 2), tagsController.removeTag);

module.exports = router;
