const express = require("express");
const router = express.Router();
const {trainingFilesPath, newsFilesPath, sentimentFilesPath} = require("../config");

const {staticController} = require("../controllers");
const destinations = {
  news: newsFilesPath,
  cover: "news-cover",
  training: trainingFilesPath,
  sentiment: sentimentFilesPath,
  infractions: "infractions",
};

router.post(
    "/news",
    staticController.uploadHandler({
      mimeSettingKey: "allowedMimetypes",
      destination: destinations["news"],
    }),
    staticController.uploadResponseHandler,
    staticController.uploadErrorHandler
);

router.get(
    "/news/:filename?",
    staticController.loadHandler({
      destination: destinations["news"],
    })
);

router.delete(
    "/news",
    staticController.removeHandler({
      destination: destinations["news"],
    })
);
router.post(
    "/infractions",
    staticController.uploadHandler({
      mimeSettingKey: "allowedMimetypes",
      destination: destinations["infractions"],
    }),
    staticController.uploadResponseHandler,
    staticController.uploadErrorHandler
);

router.get(
    "/infractions/:filename?",
    staticController.loadHandler({
      destination: destinations["infractions"],
    })
);

router.delete(
    "/infractions",
    staticController.removeHandler({
      destination: destinations["infractions"],
    })
);

router.post(
    "/trainingFiles",
    staticController.uploadHandler({
      allowedMimetypes: ["text/csv", "application/vnd.ms-excel"],
      destination: destinations["training"],
    }),
    staticController.uploadResponseHandler,
    staticController.uploadErrorHandler
);

router.get(
    "/trainingFiles/:filename?",
    staticController.loadHandler({
      destination: destinations["training"],
    })
);

router.delete(
    "/trainingFiles",
    staticController.removeHandler({
      destination: destinations["training"],
    })
);

router.post(
  "/sentimentFiles",
  staticController.uploadHandler({
    allowedMimetypes: ["text/csv", "application/vnd.ms-excel", "application/vnd.openxmlformats-officedocument.spreadsheetml.sheet"],
    destination: destinations["sentiment"],
  }),
  staticController.uploadResponseHandler,
  staticController.uploadErrorHandler
);

router.get(
  "/sentimentFiles/:filename?",
  staticController.loadHandler({
    destination: destinations["sentiment"],
  })
);

router.delete(
  "/sentimentFiles",
  staticController.removeHandler({
    destination: destinations["sentiment"],
  })
);

router.post(
    "/cover",
    staticController.uploadHandler({
      mimeSettingKey: "allowedMimetypesCoverImage",
      destination: destinations["cover"],
    }),
    staticController.uploadResponseHandler,
    staticController.uploadErrorHandler
);

router.get(
    "/cover/:filename?",
    staticController.loadHandler({
      destination: destinations["cover"],
    })
);
router.delete(
    "/cover",
    staticController.removeHandler({
      destination: destinations["cover"],
    })
);

module.exports = router;
