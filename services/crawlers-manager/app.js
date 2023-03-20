const requireAll = require("require-all");
const rabbit = require("@localPackages/rabbit");
const {rabbitMQ, rabbitQueues} = require("./config");

// Controllers

// connect to rabbitMQ
rabbit
    .connect(rabbitMQ)
    .then(() => {
      console.log("[AMQP] Connected to rabbitMQ");
      Object.values(rabbitQueues).map(rabbit.ensureExchange);
    })
    .then(() => {
    // start schedulers
      controllers.scheduler.start();
    })
    .catch(() => {
      console.log("[AMQP] Unable to connect to rabbitMQ");
    });

const {addedWatchedUrl, allCrawlingDone, removedWatchedUrl} = rabbitQueues;
const controllers = requireAll(__dirname + "/controllers");

rabbit.consume(addedWatchedUrl, controllers.manager.save);
rabbit.consume(removedWatchedUrl, controllers.manager.remove);
rabbit.consume(allCrawlingDone, controllers.scheduler.updateScheduler);
