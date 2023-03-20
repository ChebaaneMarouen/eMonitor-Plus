const express = require("express");
const router = express.Router();
const { eventServices } = require("../services");
const { allow } = require("../services/checkRoles");

router.post("/", allow("P_EDIT_SYSTEM_SEETINGS", 1), (req, res) => {
    const settingsType = req.body._id;
    eventServices.create("settingChanged", req.body, settingsType);
    res.json(req.body);
});

module.exports = router;
