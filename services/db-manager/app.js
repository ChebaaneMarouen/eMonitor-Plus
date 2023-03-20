const requireAll = require("require-all");
const rabbit = require("@localPackages/rabbit");

const { rabbitMQ, rabbitQueues } = require("./config");

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
const { crawlingDone } = rabbitQueues;

rabbit.consume(
  crawlingDone.exchange,
  crawlingDone.queue,
  controllers.crawlers.log
);
