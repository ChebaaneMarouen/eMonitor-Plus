const _ = require('lodash');
const express = require('express');
const {presenter} = require('../controllers');

const router = express.Router();
router.get('/:type', presenter.getGetRights);
module.exports = router;
