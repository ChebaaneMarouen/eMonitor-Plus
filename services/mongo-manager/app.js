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

Object.values(rabbitQueues).map(rabbit.ensureExchange);
const { dataSave, dataGet, dataRemove, dataOptions } = rabbitQueues;

rabbit.consume(dataSave, controllers.manager.save);
rabbit.consume(dataRemove, controllers.manager.remove);
rabbit.consume(dataGet, controllers.manager.get);
rabbit.consume(dataOptions, controllers.manager.setOptions);
