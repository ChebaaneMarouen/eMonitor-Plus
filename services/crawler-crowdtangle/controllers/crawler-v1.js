const eventServices = require("../modules/eventServices");
const fbTools = require("../modules/fbTools");
const _ = require("lodash");
const {scrapLogger} = require("../modules/loggers");

exports.crawl = crawl;

async function crawl(msg) {
  const data = JSON.parse(msg.content);
  const {additionalData, mediaId, _id, url, collectedAllPosts} = data;

  scrapLogger.info("Target: " + url);
  const next = collectedAllPosts ? null : _.get(additionalData, "next");
  let pageId = _.get(additionalData, "pageId");

  if (!pageId) {
    const page = await fbTools.extractPageId(url).catch(console.error);
    pageId = _.get(page, "id");
  }

  fbTools.getPosts({pageId, next}, (err, posts, newNext) => {
    if (err) return scrapLogger.error(err);
    scrapLogger.info("Collected " + posts.length + "items from " + pageId);

    posts.forEach((post) => {
      const data = {
        ...post,
        media: mediaId,
        source: "facebook",
        created: new Date(post.created_time).getTime(),
        crawlTime: Date.now(),
      };
      eventServices.create("crawlingDone", data);
    });

    eventServices.create("allCrawlingDone", {
      source: "facebook",
      numberOfNewItems: posts.length,
      // will be used to estimate page publish frequecy
      oldestPublishTimestamp: posts
          .map((post) => new Date(post.created_time).getTime())
          .sort()
          .pop(),
      additionalData: {next: newNext, pageId},
      _id,
    });
  });
}
