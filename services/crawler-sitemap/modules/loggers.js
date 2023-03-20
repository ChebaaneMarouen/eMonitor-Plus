const logger = require("@localPackages/logger");

module.exports = (() => {
  const myLogger = logger("Crawler Web", "debug");
  return {
    httpLogger: myLogger("http"),
    scrapLogger: myLogger("scrapping"),
  };
})();
