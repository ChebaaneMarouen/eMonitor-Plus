const myRabbit = require('@localPackages/rabbit');
const {rabbitQueues} = require('../config');

exports.create = create;

function create(event, data, binding = '') {
  const queue = rabbitQueues[event];
  console.log("queu", queue)
  console.log("event", event)
  myRabbit.publish(
      {exchange: queue.exchange, type: queue.type},
      binding,
      Buffer.from(JSON.stringify(data))
  );
}
