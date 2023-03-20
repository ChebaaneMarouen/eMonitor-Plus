const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const schema = new Schema({
    created: {
      type: Number,
    },
    url: {
      type: String,
      mapping: "keyword",
    },
  });

  schema.pre("save", function(next) {
    const model = this;
    if (!model.created) {
      model.created = Date.now();
    }
    next();
  });

  return new Model("visited-sites", schema, "elasticsearch");
})();
