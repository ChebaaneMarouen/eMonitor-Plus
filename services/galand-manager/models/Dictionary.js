const {Model, Schema} = require('@localPackages/model');

module.exports = (function() {
  const DictionarySchema = new Schema({
    name: {type: String, required: true},
    files: [String],
  });

  return new Model('dictionary', DictionarySchema, 'elasticsearch');
})();
