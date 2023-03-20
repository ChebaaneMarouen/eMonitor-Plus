const logger = require("@localPackages/logger");

module.exports = (() => {
  const myLogger = logger("Crawler Twitter", "debug");
  return {
    httpLogger: myLogger("http"),
    scrapLogger: myLogger("scrapping"),
  };
})();
