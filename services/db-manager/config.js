const elasticsearchUrl = "http://elasticsearch:9200";

const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq",
    pass = process.env.RABBITMQ_MANAGER_PASS || "guest",
    user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost
  };
})();

const rabbitQueues = {
  websiteAdded: {
    exchange: "website.added"
  },
  crawlingDone: {
    exchange: "crawler.done",
    queue: "db-manager"
  }
};

module.exports = {
  rabbitMQ,
  rabbitQueues,
  elasticsearchUrl
};
