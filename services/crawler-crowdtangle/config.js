const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq";
  const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
  const user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost,
  };
})();

const crowdTangle_token = process.env.CROWDTANGLE_ACCESS_TOKEN;
const crowdTangle_url = "https://api.crowdtangle.com/posts?count=20&";
const search_accounts  = process.env.CROWDTANGLE_SEARCH_ACCOUNTS;
const crowdTangle_search_url = `https://api.crowdtangle.com/posts/search?count=20&platforms=facebook&accounts=${search_accounts}&`;
const rabbitQueues = {
  crowdTanglePageAdded: {
    exchange: "crowdTangle.page.added",
    queue: "crawler-CrowdTangle",
  },
  crawlingDone: {
    exchange: "crawler.done",
  },
  allCrawlingDone: {
    exchange: "crawler.all.done",
    queue: "crawlers-manager",
  }
};

module.exports = {
  rabbitMQ,
  rabbitQueues,
  crowdTangle_token,
  crowdTangle_url,
  crowdTangle_search_url
};
