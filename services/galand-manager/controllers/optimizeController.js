const path = require("path");
const fs = require("fs");
const {uploadDestination, trainingFilesPath} = require("../config");

function updateTrainingFiles(req, res, next) {
  const {prediction, text, trainingFiles = []} = req.body;
  const file = trainingFiles[0]; // file is set to one

  if (!file || !text || !prediction) {
    res.status(400).json({message: "MESSAGE_BAD_REQUEST"});
  }

  const {serverId} = file;
  if (!serverId) res.status(400).json({message: "MESSAGE_BAD_REQUEST"});

  const filePath = path.join(uploadDestination, trainingFilesPath, serverId);
  // security check for path traversal
  if (filePath.indexOf(path.join(uploadDestination, trainingFilesPath)) !== 0) {
    return;
  }

  const formatedPrediction = formatPredictions(prediction);
  if (!formatPredictions) {
    res.status(400).json({message: "MESSAGE_BAD_REQUEST"});
  }
  const newRow = "\n" + `"${text}",${formatedPrediction}`;
  fs.appendFile(filePath, newRow, (err) => {
    if (err) return res.status(500).json({message: err.message});
    res.json({message: "MESSAGE_DATA_UPDATED"});
  });
}

function formatPredictions(prediction) {
  if (!prediction[0]) return null;
  return prediction[0].map((pred) => '"' + pred + '"').join(",");
}

exports.updateTrainingFiles = updateTrainingFiles;
