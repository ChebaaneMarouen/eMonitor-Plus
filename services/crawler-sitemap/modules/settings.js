module.exports = (() => {
  let settings = {};

  function updateSettings(newSettings) {
    settings = { ...settings, ...newSettings };
  }

  function getSettings() {
    return settings;
  }

  return {
    updateSettings,
    getSettings
  };
})();
