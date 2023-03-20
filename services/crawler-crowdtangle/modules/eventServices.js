const myRabbit = require("@localPackages/rabbit");
const { rabbitQueues } = require("../config");

exports.create = create;

function create(event, data) {
  const queue = rabbitQueues[event];
  console.log("[DEBUG] event created :" + event);
  myRabbit.publish(queue.exchange, "", Buffer.from(JSON.stringify(data)));
}
