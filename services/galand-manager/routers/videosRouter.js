const express = require("express");
const router = express.Router();
const { videosController } = require("../controllers");
const { allow } = require("../services/checkRoles");

router.put("/:id", allow("P_VIDEO", 2), videosController.upsertVideo);
router.post("/", allow("P_VIDEO", 2), videosController.upsertVideo);
router.delete("/:id", allow("P_VIDEO", 2), videosController.deleteVideo);

module.exports = router;
