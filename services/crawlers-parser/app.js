const requireAll = require("require-all");
const rabbit = require("@localPackages/rabbit");

const {rabbitMQ, rabbitQueues} = require("./config");
const controllers = requireAll(__dirname + "/controllers");

// connect to rabbitMQ
rabbit
    .connect(rabbitMQ)
    .then(() => {
      console.log("[AMQP] Connected to rabbitMQ");
      Object.values(rabbitQueues).map(rabbit.ensureExchange);
    })
    .catch(() => {
      console.log("[AMQP] Unable to connect to rabbitMQ");
    });

const {
  rulesRemoved,
  rulesAdded,
  rulesUpdated,
  userConnected,
  crawlingDone,
} = rabbitQueues;

rabbit.consume(crawlingDone, controllers.manager.parse);
rabbit.consume(userConnected, controllers.eventHandler.publishRules);
rabbit.consume(rulesAdded, controllers.eventHandler.upsertRules);
rabbit.consume(rulesUpdated, controllers.eventHandler.upsertRules);
rabbit.consume(rulesRemoved, controllers.eventHandler.removeRule);
