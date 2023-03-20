const Settings = require("@localPackages/settings");
const settingsSchema = {
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
