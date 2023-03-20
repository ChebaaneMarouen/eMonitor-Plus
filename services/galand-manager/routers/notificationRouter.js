const express = require("express");
const router = express.Router();
const {notificationController} = require("../controllers");

router.get("/:userId", notificationController.getNotifications);
router.put("/:notifId", notificationController.getNotification, notificationController.updateNotification);

module.exports = router;