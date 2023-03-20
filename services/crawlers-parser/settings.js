const Settings = require("@localPackages/settings");

const settingsSchema = {
  parsingRules: [
    {
      propName: {
        type: String,
        description: "Name for the new prop",
        label: "Property",
        default: "prop",
      },
      script: {
        type: String,
        description: "Elasticsearch Painless Script",
        inputType: "script",
        label: "Script",
        default: "null",
      },
    },
  ],
};

module.exports = ({onChange}) => {
  const fbParsingSettings = new Settings(settingsSchema, "Facebook Parser", {
    onChange: onChange.bind(null, "facebook"),
  });
  const instagramParsingSettings = new Settings(
      settingsSchema,
      "Instagram Parser",
      {
        onChange: onChange.bind(null, "instagram"),
      }
  );
  const twitterParsingSettings = new Settings(
      settingsSchema,
      "Twitter Parser",
      {
        onChange: onChange.bind(null, "twitter"),
      }
  );
  const twitterMentionsParsingSettings = new Settings(
    settingsSchema,
    "Twitter Mentions Parser",
    {
      onChange: onChange.bind(null, "twitter_mentions"),
    }
);
  const youtubeParsingSettings = new Settings(
      settingsSchema,
      "Youtube Parser",
      {
        onChange: onChange.bind(null, "youtube"),
      }
  );

  function getSettings(settings, attr) {
    return settings.get(attr);
  }

  return {
    getFbSettings: getSettings.bind(this, fbParsingSettings),
    getInstagramSettings: getSettings.bind(this, instagramParsingSettings),
    getTwitterSettings: getSettings.bind(this, twitterParsingSettings),
    getYoutubeSettings: getSettings.bind(this, youtubeParsingSettings),
    getTwitterMentionsSettings: getSettings.bind(this, twitterMentionsParsingSettings),
  };
};
