const {Model, Schema} = require("@localPackages/model");

module.exports = (() => {
  const schema = new Schema({
    name: String,
    priority: Number,
    urlCondition: {
      type: String,
      mapping: "keyword",
      default: "*",
    },
    userId: {
      type: String,
      mapping: "keyword",
    },
    parsingRules: [
      {
        propPath: String,
        propName: String,
        propAttribute: String,
        propScript: String,
      },
    ],
  });

  return new Model("rules", schema, "elasticsearch");
})();
