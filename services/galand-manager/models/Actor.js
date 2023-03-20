const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const ActorSchema = new Schema({
    name: {type: String, required: true},
    sex: {type: String, required: true},
    constituency: {type: String, required: true},
    candidate_type: {type: String, required: true}
  });

  return new Model("actor", ActorSchema, "elasticsearch");
})();
