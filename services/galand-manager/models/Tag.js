const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const TagSchema = new Schema({
    label: {type: String, required: true},
    count: Number,
    isCategory: Boolean,
    color: {
      type: String,
      required: true,
      mapping: "keyword",
    },
  });

  return new Model("tags", TagSchema, "elasticsearch");
})();
