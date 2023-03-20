const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const schema = new Schema({
    name: {type: String, required: true},
    created: {
      type: Number,
    },
    creator: {
      type: String,
      mapping: "keyword",
    },
    searchType: {
      type: String,
    },
    creatorName: {
      type: String,
    },
    search: {},
  });
  return new Model("custom-search", schema, "elasticsearch");
})();
