const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const CivilSchema = new Schema({
    name: {type: String, required: true},
    head_quarters: {type: String, required: true}
  });

  return new Model("civil", CivilSchema, "elasticsearch");
})();
