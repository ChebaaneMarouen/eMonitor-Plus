const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const schema = new Schema({
    name: {type: String, mapping: "keyword", required: true},
    theme: {type: String, mapping: "keyword", required: true},
    title: {type: String, mapping: "text", required: true},
    inputs: [
      {
        name: String,
        placeholder: String,
        options: [String],
        inputType : String
      },
    ],
    created: {
      type: Number,
      mapping: "date",
    },
    lastModified: {
      type: Number,
      mapping: "date",
    },
  });

  schema.pre("save", function(next) {
    const data = this;
    if (!data.created) {
      data.created = Date.now();
    }
    data.lastModified = Date.now();
    next();
  });

  return new Model("forms", schema, "elasticsearch");
})();
