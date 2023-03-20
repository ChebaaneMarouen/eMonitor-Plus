const express = require("express");
const router = express.Router();
const {userController} = require("../controllers");
const {allow} = require("../services/checkRoles");

router.get("/", allow("P_USERS", 1), userController.getUsers);
router.param("userId", userController.getUser);
router.put("/:userId", allow("P_USERS", 2), userController.updateUser);
router.post("/", allow("P_USERS", 2), userController.createUser);
router.delete("/:userId", allow("P_USERS", 2), userController.deleteUser);

module.exports = router;
