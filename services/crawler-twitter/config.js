const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq";
  const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
  const user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost,
  };
})();

const rabbitQueues = {
  twitterUserAdded: {
    exchange: "twitter.user.added",
    queue: "crawler-twitter",
  },
  crawlingDone: {
    exchange: "crawler.done",
  },
  allCrawlingDone: {
    exchange: "crawler.all.done",
  },
  settingChangedTwitter: {
    exchange: "settings.changeTwitter",
    queue: "manager",
  }
};

module.exports = {
  rabbitMQ,
  rabbitQueues,
};
