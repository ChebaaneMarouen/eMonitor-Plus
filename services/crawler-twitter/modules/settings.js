const Settings = require("@localPackages/settings");

const settingsSchema = {
  consumer_key: {
    type: String,
    description: "Twitter Consumer Key",
    label: "Twitter Consumer Key",
    default: process.env.TWITTER_CONSUMER_KEY,
  },
  consumer_secret: {
    type: String,
    description: "Twitter Consumer Secret",
    label: "Twitter Consumer Secret",
    default: process.env.TWITTER_CONSUMER_SECRET,
  },
  access_token_key: {
    type: String,
    description: "Twitter Access Token Key",
    label: "Twitter Access Token Key",
    default: process.env.TWITTER_ACCESS_TOKEN_KEY,
  },
  access_token_secret: {
    type: String,
    description: "Twitter Access Token Secret",
    label: "Twitter Access Token Secret",
    default: process.env.TWITTER_ACCESS_TOKEN_SECRET,
  },
  twitterLimit: {
    type: Number,
    description: 'Twitter Request "count" parameter (recommended Value : 150)',
    label: 'Twitter\'s "count" parameter',
    default: 150,
  },
  twitterCommentsLimit:{
    type: Number,
    description: 'Twitter Request "max_results" parameter (maximum Value : 100)',
    label: 'Twitter\'s "max_results" parameter',
    default: 20,
  },
  cron_mentions: {
    type: String,
    description: "Cron expression for crawling mentions",
    label: "Cron mentions",
    default:
      "* * 5 * * *",
  },
  cron_action: {
    type: Boolean,
    description: "Activate crawler mentions",
    inputType : "checkbox",
    label: "Activate crawler mentions",
  }
};

module.exports = (() => {
  const settings = new Settings(settingsSchema, "Twitter Crawler");

  function getSettings(attr) {
    return settings.get(attr);
  }

  return {
    getSettings,
  };
})();
