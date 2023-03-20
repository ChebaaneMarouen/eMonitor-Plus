const express = require("express");
const router = express.Router();
const { newsController } = require("../controllers");
const { allow } = require("../services/checkRoles");

// TODO: redo
// router.param("/:newsId", newsController.getOne);
router.post("/*/search", newsController.fixSearchFilter);

router.get("/description", newsController.describe);

router.get("/all", newsController.getAll);

router.get("/added", newsController.getAllAdded);

router.get("/fakenews", newsController.getAllFakenews);

router.get("/assigned", allow("P_GET_ASSIGNED", 1), newsController.getAllAssigned);

router.get("/required-actions", newsController.getWaitingActions);

router.get("/projects", newsController.getAllProjectsNews);

router.get("/projects/:projectId", newsController.getProjectsNews);

router.post("/projects/search", newsController.searchAllProjects);

router.post("/projects/count", newsController.projectsCount);

router.get("/:newsId", newsController.getSigngleNews);

router.get("/:newsId/changes", newsController.getNewsChanges);

router.post("/all/search", newsController.searchAll);

router.post("/added/search", newsController.searchAllAdded);

router.post("/fakenews/search", newsController.searchAllFakenews);

router.post("/assigned/search", allow("P_GET_ASSIGNED", 1), newsController.searchAssigned);

router.post("/", newsController.downloadImage, newsController.createNews, newsController.downloadVideo );
router.post("/external", newsController.createExternalNews);
router.post("/all/count", newsController.count);
router.put(
  "/:newsId", 
  newsController.checkMonitorPermission,
  newsController.downloadVideo,
  newsController.downloadImage,
  newsController.updateNews
);

router.delete("/:newsId", allow("P_NEWS_DELETE", 1), newsController.checkMonitorPermission, newsController.deleteNews);

module.exports = router;
