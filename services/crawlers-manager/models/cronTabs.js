const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const schema = new Schema({
    mediaId: {
      type: String,
    },
    source: {
      type: String,
    },
    cronExpression: {
      type: String,
    },
  });

  const model = new Model("crawling.crontabs", schema, "elasticsearch");
  return model;
})();
