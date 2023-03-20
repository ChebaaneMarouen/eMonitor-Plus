const requireAll = require("require-all");
const rabbit = require("@localPackages/rabbit");

const {rabbitMQ, rabbitQueues} = require("./config");
const { getSettings } = require("./modules/settings");

// Controllers
const controllers = requireAll(__dirname + "/controllers");

// connect to rabbitMQ
rabbit
    .connect(rabbitMQ)
    .then(() => {
      console.log("[AMQP] Connected to rabbitMQ");
    })
    .catch(() => {
      console.log("[AMQP] Unable to connect to rabbitMQ");
    });
const {twitterUserAdded, settingChangedTwitter} = rabbitQueues;

rabbit.consume(twitterUserAdded, controllers.crawler.crawl);
rabbit.consume(settingChangedTwitter, controllers.crawler.crawlMentions);

setTimeout(() => {
  const cronJob = getSettings("cron_action");
  console.log("cron_action", cronJob)
  if(cronJob){
  const message = {
    content : JSON.stringify({
      "cron_mentions": getSettings("cron_mentions"),
      "cron_action": getSettings("cron_action")
    })
  }
      controllers.crawler.crawlMentions(message)
  }
}, 10000);

