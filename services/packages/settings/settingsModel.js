const {Model, Schema} = require('@localPackages/model');

module.exports = function(settingsSchema) {
  const schema = new Schema(settingsSchema);

  return new Model('settings', schema, 'elasticsearch');
};
