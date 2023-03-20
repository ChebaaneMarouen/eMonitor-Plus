const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const NewsSchema = new Schema({
    userId: {
      type: String,
      mapping: "keyword",
    },
    newsId: {
      type: String,
      mapping: "keyword",
    },
    changedKey: String,

    oldValue: {
      type: String,
      mapping: "keyword",
      index: {
        index: false,
      },
    },
    newValue: {
      type: String,
      mapping: "keyword",
      index: {
        index: false,
      },
    },
    created: {
      type: Number,
      mapping: "date",
    },
  });

  NewsSchema.pre("save", function(next) {
    const news = this;
    if (!news.created) {
      news.created = Date.now();
    }
    next();
  });

  return new Model("news_changes", NewsSchema, "elasticsearch");
})();
