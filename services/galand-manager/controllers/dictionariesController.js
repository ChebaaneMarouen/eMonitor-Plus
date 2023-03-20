const {eventServices} = require("../services");

exports.upsertDictionary = upsertDictionary;
exports.deleteDictionary = deleteDictionary;

function upsertDictionary(req, res) {
  const userId = req.user._id;
  eventServices.create("dictionariesAdded", {...req.body, userId});
  res.json({done: true});
}

function deleteDictionary(req, res) {
  const {id} = req.params;
  const userId = req.user._id;
  eventServices.create("dictionariesRemoved", {_id: id, userId});
  res.json({done: true});
}
