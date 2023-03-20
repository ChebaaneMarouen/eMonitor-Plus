const express = require("express");
const router = express.Router();
const _ = require("lodash");

const { crudService } = require("../services/");
const newsService = crudService("News", { sort: [{ created: "desc" }] });
const feedService = crudService("Feed", { sort: [{ created: "desc" }] });

router.get("/", (req, res) => {
  const query = newsService.getRecords({ status: 3 });
  query
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ ...err, message: err.message });
    });
});

router.post("/", (req, res) => {
  let { feed } = req.body;
  feedService.getRecords({ url: feed.url }).then((similiarFeeds) => {
    if (similiarFeeds.length) return res.status(400).json({ message: "FEED_ALREADY_EXISTS" });
    else {
      feedService
        .addRecord(feed)
        .then((feed) => res.json(feed))
        .catch((err) => {
          console.log(err);
          res.status(500).json({ ...err, message: err.message });
        });
    }
  });
});

module.exports = router;
