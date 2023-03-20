const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const ConstituencySchema = new Schema({
    name: {type: String, required: true},
    governorate: {type: String, required: true}
  });

  return new Model("constituency", ConstituencySchema, "elasticsearch");
})();
