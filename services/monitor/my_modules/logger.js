const logger = require("@localPackages/logger");

module.exports = (() => {
    const myLogger = logger("monitor server", "debug");
    return {
        httpLogger: myLogger("http"),
    };
})();
