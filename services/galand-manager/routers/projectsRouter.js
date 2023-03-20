const express = require("express");
const router = express.Router();
const {allow} = require("../services/checkRoles");
const {projectsController} = require("../controllers");

router.get("/", allow("P_PROJECT", 1), projectsController.getProjects);

router.get("/:id", allow("P_PROJECT", 1), projectsController.getProject);

router.put("/:id", allow("P_PROJECT", 2), projectsController.updateProject);

router.post("/", allow("P_PROJECT", 2), projectsController.createProject);

router.delete("/:id", allow("P_PROJECT", 2), projectsController.removeProject);
module.exports = router;
