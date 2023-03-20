const logger = require("@localPackages/logger");

module.exports = (() => {
  const myLogger = logger("Crawler CrowdTangle", "debug");
  return {
    httpLogger: myLogger("http"),
    scrapLogger: myLogger("scrapping"),
  };
})();
