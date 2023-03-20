const mongo = {
  user: process.env.MONGO_USER || "admin",
  host: "mongo-database",
  pass: process.env.MONGO_PASSWORD || "admin",
  db: process.env.MONGO_DB || "chatbot",
  port: 27017,
  protocol: "mongodb",
  cnxString: function() {
    return (
      this.protocol +
      "://" +
      this.user +
      ":" +
      this.pass +
      "@" +
      this.host +
      ":" +
      this.port +
      "/" +
      this.db +
      "?authSource=admin"
    );
  }
};
const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq",
    pass = process.env.RABBITMQ_MANAGER_PASS || "guest",
    user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost
  };
})();

const rabbitQueues = {
  dataSave: {
    exchange: "data.save",
    type: "topic",
    queue: "mongo-manager",
    binding: "mongo"
  },
  dataGet: {
    exchange: "data.get",
    type: "topic",
    queue: "mongo-manager",
    binding: "mongo"
  },
  dataRemove: {
    exchange: "data.remove",
    type: "topic",
    queue: "mongo-manager",
    binding: "mongo"
  },
  dataOptions: {
    exchange: "data.settings",
    type: "topic",
    queue: "mongo-manager",
    binding: "mongo"
  }
};

module.exports = {
  rabbitMQ,
  rabbitQueues,
  mongo
};
