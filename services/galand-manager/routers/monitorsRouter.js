const express = require('express');
const router = express.Router();

const {userService} = require('../services/');

router.get('/', (req, res) => {
  userService.getUsers({}).then((users) => {
    res.json(
        users.filter((user) => user.roles === 1).filter((user) => user.status === 1)
    );
  });
});

module.exports = router;
