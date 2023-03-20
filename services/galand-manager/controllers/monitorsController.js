const express = require("express");
const router = express.Router();

const {crudService} = require("../services/");
const userService = crudService("User");
const rolesService = crudService("Roles");

router.get("/", (req, res) => {
  // get roles that define the possibilité to be assigned
  rolesService
      .getRecords({P_GET_ASSIGNED: true})
      .then((roles) => roles.map((role) => role._id))
      .then((rolesIds) => {
      // get users that possess that role
        return userService.getRecords({multi_role: rolesIds}).then((users) => {
          res.json(users);
        });
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({message: err.message});
      });
});

module.exports = router;
