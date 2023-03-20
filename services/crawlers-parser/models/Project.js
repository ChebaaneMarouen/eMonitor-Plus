const {Model, Schema} = require("@localPackages/model");

module.exports = (()=> {
  const ProjectSchema = new Schema({
    title: {type: String, required: true},
    theme: {type: String, required: true},
    startProject: {
      type: Number,
      mapping: "date",
    },
    endProject: {
      type: Number,
      mapping: "date",
    },
    dictionaries: [String],
    customDictionaries: [String],
    customSearches: [String],
    models: [String],
    media: [String],
    assignees: [String],
    creator: {
      type: String,
      mapping: "keyword",
    },
    forms: [String],
  });

  return new Model("projects", ProjectSchema, "elasticsearch");
})();
