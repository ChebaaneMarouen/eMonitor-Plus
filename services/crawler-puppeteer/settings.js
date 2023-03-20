const Settings = require("@localPackages/settings");
const settingsSchema = {
  maxRequestsPerCrawl: {
    type: Number,
    inputType: "number",
    description:
      "Maximum number of pages that the crawler will open. The crawl will stop when this limit is reached. Always set this value in order to prevent infinite loops in misconfigured crawlers.",
    label: "Max Request Per Crawl",
    default: 200,
  },
  maxConcurrency: {
    type: Number,
    inputType: "number",
    description: "Sets the maximum concurrency (parallelism) for the crawl",
    label: "Max Concurrency",
    default: 10,
  },
};

module.exports = (() => {
  const settings = new Settings(settingsSchema, "Pupeeteer Web Crawler");

  function getSettings(attr) {
    return settings.get(attr);
  }

  return {
    getSettings,
  };
})();
