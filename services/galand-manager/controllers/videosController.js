const {eventServices} = require("../services");

exports.upsertVideo = upsertVideo;
exports.deleteVideo = deleteVideo;

function upsertVideo(req, res) {
  const userId = req.user._id;
  eventServices.create("videosAdded", {...req.body, userId});
  res.json({done: true});
}

function deleteVideo(req, res) {
  const {id} = req.params;
  const userId = req.user._id;
  eventServices.create("videosRemoved", {_id: id, userId});
  res.json({done: true});
}
