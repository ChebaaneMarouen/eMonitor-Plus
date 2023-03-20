const name =
  process.env.HOSTNAME ||
  Math.random()
      .toString(16)
      .slice(2);

const settingsDataBase = process.env.SETTING_DB || 'elasticsearch';

const rabbitQueues = (settingsId) => ({
  settingChanged: {
    exchange: 'settings.change',
    type: 'topic',
    options: {
      autoDelete: true,
    },
    queue: settingsId + '-' + name,
  },
  settingsRequested: {
    exchange: 'settings.request',
    queue: settingsId + '-' + name,
  },
  publishSettings: {
    exchange: 'user.data.updated',
    queue: settingsId + '-' + name,
  },
});
module.exports = {
  settingsDataBase,
  rabbitQueues,
};
