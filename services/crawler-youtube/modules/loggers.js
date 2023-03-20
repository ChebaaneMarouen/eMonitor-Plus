const logger = require("@localPackages/logger");

module.exports = (() => {
  const myLogger = logger("Crawler Youtube", "debug");
  return {
    httpLogger: myLogger("http"),
    scrapLogger: myLogger("scrapping"),
  };
})();
