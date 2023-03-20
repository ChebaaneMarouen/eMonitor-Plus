const express = require('express');
const router = express.Router();

const {authController} = require('../controllers');

router.post('/reset', authController.reset);

router.post('/change-password', authController.changePassword);

router.post('/login', authController.login);

router.get('/logout', authController.logout);

router.post('/change', authController.changePassword);
router.post('/recover', authController.recover);

router.post('/register', authController.register);

module.exports = router;
