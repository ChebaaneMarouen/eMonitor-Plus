const myRabbit = require("@localPackages/rabbit");
const {rabbitQueues} = require("../config");

exports.create = create;

function create(event, data) {
  const queue = rabbitQueues[event];
  console.log("[DEBUG] event is CREATED ");
  console.log("[DEBUG] event :" + event);
  console.log("[DEBUG] data  :" + data);
  myRabbit.publish(queue.exchange, "", Buffer.from(JSON.stringify(data)));
}
