const {log} = require("./logger");
module.exports = (origin, logLevel = "debug") => {
  const containerId = process.env.HOSTNAME || origin;
  const data = {origin, containerId};
  return (task) => ({
    debug: log.bind(null, logLevel, data, task, "debug"),
    info: log.bind(null, logLevel, data, task, "info"),
    warn: log.bind(null, logLevel, data, task, "warning"),
    error: log.bind(null, logLevel, data, task, "error"),
    log: log.bind(null, logLevel, data, task),
  });
};
