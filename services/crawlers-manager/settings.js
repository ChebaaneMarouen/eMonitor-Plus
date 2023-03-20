const Settings = require("@localPackages/settings");

module.exports = (() => {
  const settings = new Settings(
      {
        oldestDate: {
          type: String,
          description:
          "Oldest date to limit scrapping (scrapping will not include posts from earlier date yyyy-mm-dd format)",
          label: "Oldest date to scrap",
          default: "2019-1-1",
        },
      },
      "Crawlers General Settings",
      {onChange: runCallBacks}
  );

  const callBacks = [];

  function runCallBacks(...args) {
    callBacks.forEach((cb) => {
      cb(...args);
    });
  }

  function registerCallBack(cb) {
    callBacks.push(cb);
  }

  function getSettings(attr) {
    return settings.get(attr);
  }

  return {
    getSettings,
    registerCallBack,
  };
})();
