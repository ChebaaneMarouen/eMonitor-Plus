const express = require('express');
const router = express.Router();

const {utilitiesController} = require('../controllers');

router.post('/cover-image', utilitiesController.getCoverImage);
module.exports = router;
