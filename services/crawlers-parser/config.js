const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq";
  const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
  const user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost,
  };
})();

const PERMISSSION_KEY = "P_WEB_SCRAPPING_RULES";

const rabbitQueues = {
  userConnected: {
    exchange: "user.activies.signin",
    queue: "crawlers-parser",
  },
  rulesRemoved: {
    exchange: "data.rules.deleted",
    queue: "crawlers-parser",
  },
  rulesAdded: {
    exchange: "data.rules.created",
    queue: "crawlers-parser",
  },
  rulesUpdated: {
    exchange: "data.rules.updated",
    queue: "crawlers-parser",
  },
  sendUserData: {
    exchange: "user.publicData",
    queue: "crawlers-parser",
  },
  userNotificationSuccess: {
    exchange: "user.notifications.success",
    queue: "crawlers-parser",
  },
  userNotificationError: {
    exchange: "user.notifications.error",
    queue: "crawlers-parser",
  },
  userDataUpdated: {
    exchange: "user.data.updated",
    queue: "crawlers-parser",
  },
  feedAdded: {
    exchange: "feed.added",
  },
  crawlingDone: {
    exchange: "crawler.done",
  },
};
const customDictionariesApi = "http://custom-dictionaries/search-occurence";
const hateApi = "http://hate/predict";
const sentimentApi = "http://sentiment/predict";
const detoxifyApi = "http://detoxify/predict";
const ducklingApi = "http://duckling:8000";

module.exports = {
  rabbitMQ,
  rabbitQueues,
  PERMISSSION_KEY,
  customDictionariesApi,
  hateApi,
  sentimentApi,
  ducklingApi,
  detoxifyApi
};
