const express = require("express");
const router = express.Router();
const {optimizeController} = require("../controllers");
const {allow} = require("../services/checkRoles");

router.post("/", optimizeController.updateTrainingFiles);

module.exports = router;
