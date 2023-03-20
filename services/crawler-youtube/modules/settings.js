const Settings = require("@localPackages/settings");

const settingsSchema = {
  secretKey: {
    type: String,
    description: "Youtube's Key",
    label: "Youtube's Key",
    default: process.env.GOOGLE_KEY,
  },
  parts: {
    type: String,
    description:
      "Comma-separated list of one or more video resource properties",
    label: "Parts",
    default:
      "contentDetails,id,liveStreamingDetails,localizations,player,recordingDetails,snippet,statistics,status,topicDetails",
  },
  youtubeMaxResult: {
    type: Number,
    inputType: "number",
    description: 'Youtube Request "count" parameter (Max Value : 50)',
    label: "Max Result",
    default: 30,
  },
};

module.exports = (() => {
  const settings = new Settings(settingsSchema, "Youtube Crawler");

  function getSettings(attr) {
    return settings.get(attr);
  }

  return {
    getSettings,
  };
})();
