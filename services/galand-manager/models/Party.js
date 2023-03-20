const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const PartyListSchema = new Schema({
    name: {type: String, required: true},
    political_actor: [String]
  });

  return new Model("party", PartyListSchema, "elasticsearch");
})();
