const express = require("express");
const router = express.Router();
const { eventServices } = require("../services");
const { allow } = require("../services/checkRoles");

router.post("/", allow("P_EDIT_SYSTEM_SEETINGS", 1), (req, res) => {
    const settingsType = req.body._id;
    const crawler = settingsType.split(" ");
    console.log("settings", req.body);
    eventServices.create("settingChanged", req.body, settingsType);
    eventServices.create("settingChanged"+ crawler[0], req.body);
    res.json([]);
});

module.exports = router;
