const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const WatchedSchema = new Schema({
    url: {
      type: String,
      required: true,
      mapping: "keyword",
    },
    pseudoUrl: {
      type: String,
      required: false,
    },
    mediaId: {
      type: String,
      mapping: "keyword",
    },
    schedule: {type: String, mapping: "keyword"},
    collectedAllPosts: {
      type: Boolean,
      default: false,
    },
    crowdTangle: {
      type: Boolean,
      required: false,
    },
    search_crowdTangle: {
      type: Boolean,
      required: false,
    },
    source: String,
    additionalData: {},
  });

  const model = new Model(
      "crawling.watched.urls",
      WatchedSchema,
      "elasticsearch"
  );
  return model;
})();
