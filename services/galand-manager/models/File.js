const {Model, Schema} = require('@localPackages/model');

module.exports = (function() {
  const schema = new Schema({
    filename: String,
    serverId: String,
    originalname: String,
    mimetype: String,
    size: Number,
    path: String,
  });

  return new Model('files', schema, 'elasticsearch');
})();
