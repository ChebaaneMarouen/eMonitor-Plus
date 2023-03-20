const logger = require("@localPackages/logger");

module.exports = (() => {
  const myLogger = logger("Crawler RSS Web", "debug");
  return {
    httpLogger: myLogger("http"),
    scrapLogger: myLogger("scrapping"),
  };
})();
