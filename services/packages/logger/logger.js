const myRabbit = require("@localPackages/rabbit");
const {rabbitQueues} = require("./config");

exports.log = log;

function log(logLevel, data, task, level, text) {
  switch (true) {
    case "debug" === logLevel:
    case "info" === logLevel:
    case "warning" === logLevel:
    case "error" === logLevel:
      console.log("[" + level.toUpperCase() + "]", text);
  }
  text = typeof text === "string" ? text : JSON.stringify(text, null, 2);
  createRequest({...data, level, task, text});
}

function createRequest(data) {
  return myRabbit
      .publish(rabbitQueues["saveData"], "", Buffer.from(JSON.stringify(data)))
      .catch((err) => {
        console.error(err);
        throw err;
      });
}
