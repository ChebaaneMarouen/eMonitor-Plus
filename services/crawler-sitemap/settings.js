const Settings = require("@localPackages/settings");
const settingsSchema = {
  limitConcurrent: {
    type: Number,
    inputType: "number",
    description:
      "Number of concurrent web requests during scrapping." +
      " (High numbers can cause timeouts)",
    label: "Number of concurrent web requests",
    default: 3,
  },
  sleepIntervals: {
    type: Number,
    inputType: "number",
    description: "Sleep time in ms between calls",
    label: "Sleep Intervals(ms)",
    default: 100,
  },
  userAgent: {
    type: String,
    inputType: "text",
    description: "User Agent to be used in web requests",
    label: "User Agent",
    default: "Vbot",
  },
};

module.exports = (() => {
  const settings = new Settings(settingsSchema, "Web Crawler");

  function getSettings(attr) {
    return settings.get(attr);
  }

  return {
    getSettings,
  };
})();
