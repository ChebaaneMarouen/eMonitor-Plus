const {Model, Schema} = require("@localPackages/model");

const crawDataModels = {};
const schema = new Schema({});

module.exports = function(type) {
  if (!crawDataModels[type]) {
    crawDataModels[type] = new Model(
        "crawl-data-" + type,
        schema,
        "elasticsearch",
        {dynamic: false} // solve exeeding field limit
    );
  }
  return crawDataModels[type];
};
