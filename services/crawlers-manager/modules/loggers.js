const logger = require("@localPackages/logger");

module.exports = (() => {
  const myLogger = logger("Crawler Scheduler", "debug");
  return {
    httpLogger: myLogger("http"),
    freqLogger: myLogger("frequency estimation"),
    schedulingLogger: myLogger("Crawl Scheduling"),
  };
})();
