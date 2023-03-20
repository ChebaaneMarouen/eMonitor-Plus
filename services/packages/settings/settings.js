const _ = require("lodash");
const rabbit = require("@localPackages/rabbit");
const {rabbitQueues} = require("./config");
const settingsModel = require("./settingsModel");
module.exports = Settings;

function Settings(settingsSchema, name, params = {}) {
  const {target = "admin", onChange} = params;
  const {settingChanged, settingsRequested, publishSettings} = rabbitQueues(
      name
  );
  const broadcastSettings = broadcast.bind(this, publishSettings);
  this.settingsSchema = settingsSchema;
  this.model = settingsModel(settingsSchema);
  this.settings = this.model({_id: name});
  this.model
      .getOne({_id: name})
      .then((savedSettings) => {
        if (savedSettings) {
          this.settings = savedSettings;
          // false = this is not an update (server is starting)
          if (typeof onChange === "function") onChange(savedSettings, false);
        }
      })
      .catch((err) => {
        console.error("SETTINGS GET ONE ");
        console.error(err);
        this.settings = this.model({_id: name});
      });

  rabbit.consume({...settingChanged, binding: name}, (msg) => {
    const data = JSON.parse(msg.content);
    this.model
        .save({...data, _id: name})
        .then((updatedSettings) => {
          if (updatedSettings) this.settings = updatedSettings;
          // true this is an update
          if (typeof onChange === "function") onChange(updatedSettings, true);
        })
        .catch((err) => {
          console.error(err);
        })
        .finally(() => {
          broadcastSettings(
              formatSettings(name, this.settings, settingsSchema),
              target
          );
        });
  });

  rabbit.consume(settingsRequested, () => {
    broadcastSettings(
        formatSettings(name, this.settings, settingsSchema),
        target
    );
  });
}

Settings.prototype.get = function(attr) {
  return this.settings[attr] || _.get(this.settingsSchema, attr + ".default");
};

function broadcast(publishSettings, settings) {
  rabbit.publish(
      publishSettings.exchange,
      "",
      Buffer.from(
          JSON.stringify({
            target: "admin",
            data: {settings},
          })
      )
  );
}
function formatSettings(name, settings, settingsSchema) {
  const result = {};
  for (const key of Object.keys(settingsSchema)) {
    // if value is not defined default to the default
    const value = settings[key] || settingsSchema[key].default;
    // copy other attributes such as description
    result[key] = {...settingsSchema[key], value};
  }
  // _id is a special prop that refer to settings type
  result["_id"] = name;
  return result;
}
