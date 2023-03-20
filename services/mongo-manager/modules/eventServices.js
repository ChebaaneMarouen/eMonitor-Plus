const myRabbit = require("@localPackages/rabbit");
const { rabbitQueues } = require("../config");

exports.send = send;

function send(queue, data, options) {
  const a = myRabbit.sendToQueue(
    queue,
    Buffer.from(JSON.stringify(data)),
    options
  );
}
