const express = require("express");
const router = express.Router();
const { allow } = require("../services/checkRoles");
const { MediaController } = require("../controllers");

router.get("/", allow("P_MEDIA", 1), MediaController.getMedia);
router.post(
    "/",
    allow("P_MEDIA", 2),
    MediaController.verifyMediaURLS,
    MediaController.createMedia,
    MediaController.notifyMediaUpdate
);
router.put(
    "/:mediaId",
    allow("P_MEDIA", 2),
    MediaController.updateMedia,
    MediaController.notifyMediaUpdate
);
router.delete(
    "/:mediaId",
    allow("P_MEDIA", 2),
    MediaController.deleteMedia,
    MediaController.notifyMediaDelete
);
module.exports = router;
