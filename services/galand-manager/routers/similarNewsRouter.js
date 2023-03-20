const express = require("express");
const router = express.Router();

const {similarNewsController} = require("../controllers");

router.post("/search", similarNewsController.search);

module.exports = router;
