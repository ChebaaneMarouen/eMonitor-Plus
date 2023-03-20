const myRabbit = require('@localPackages/rabbit');

exports.send = send;

function send(queue, data, options) {
  return myRabbit.sendToQueue(
      queue,
      Buffer.from(JSON.stringify(data)),
      options
  );
}
