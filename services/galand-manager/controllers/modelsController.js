const {eventServices} = require("../services");

exports.upsertModel = upsertModel;
exports.deleteModel = deleteModel;

function upsertModel(req, res) {
  const userId = req.user._id;
  eventServices.create("modelsAdded", {...req.body, userId});
  res.json({done: true});
}

function deleteModel(req, res) {
  const {id} = req.params;
  const userId = req.user._id;
  eventServices.create("modelsRemoved", {_id: id, userId});
  console.log("DELETING ", {_id: id, userId});
  res.json({done: true});
}
