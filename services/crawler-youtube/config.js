const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq";
  const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
  const user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost,
  };
})();

const rabbitQueues = {
  youtubeUserAdded: {
    exchange: "youtube.user.added",
    queue: "crawler-youtube",
  },
  crawlingDone: {
    exchange: "crawler.done",
  },
  allCrawlingDone: {
    exchange: "crawler.all.done",
  },
};

module.exports = {
  rabbitMQ,
  rabbitQueues,
};
