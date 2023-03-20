const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const schema = new Schema({
    name: {type: String, required: true},

    created: {
      type: Number,
      mapping: "date",
    },
    lastModified: {
      type: Number,
      mapping: "date",
    },
    name: {
      type: String,
      mapping: "keyword",
    },
    classificationType: {
      type: Number,
    },
    trainingFiles: [
      {
        serverId: {type: String, required: true},
        filename: {type: String, required: true},
        fileType: {type: String, required: true},
        fileSize: {type: Number, required: true},
      },
    ],
  });

  schema.pre("save", function(next) {
    const data = this;
    if (!data.created) {
      data.created = Date.now();
    }
    data.lastModified = Date.now();
    next();
  });

  return new Model("sentiments", schema, "elasticsearch");
})();
