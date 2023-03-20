const {Model, Schema} = require('@localPackages/model');

module.exports = (function() {
  const schema = new Schema({});

  return new Model('feed', schema, 'elasticsearch');
})();
