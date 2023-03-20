const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq";
  const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
  const user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost,
  };
})();

const rabbitQueues = {
  websiteAdded: {
    exchange: "website.added",
  },
  websiteSitemapAdded: {
    exchange: "website.sitemap.added",
  },
  fbPageAdded: {
    exchange: "facebook.page.added",
    queue: "crawlers-manager",
  },
  crowdTanglePageAdded: {
    exchange: "crowdTangle.page.added",
    queue: "crawlers-manager",
  },
  twitterUserAdded: {
    exchange: "twitter.user.added",
  },
  instagramUserAdded: {
    exchange: "instagram.user.added",
  },
  websiteRSSAdded: {
    exchange: "website.rss.added",
  },
  youtubeUserAdded: {
    exchange: "youtube.user.added",
  },
  addedWatchedUrl: {
    exchange: "watched.added",
    queue: "crawlers-manager",
  },
  removedWatchedUrl: {
    exchange: "watched.removed",
    queue: "crawlers-manager",
  },
  allCrawlingDone: {
    exchange: "crawler.all.done",
    queue: "crawlers-manager",
  },
};

const MAX_SCORE = 100;

module.exports = {
  rabbitMQ,
  rabbitQueues,
  MAX_SCORE,
};
