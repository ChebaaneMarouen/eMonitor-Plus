const fs = require("fs");
const multer = require("multer");
const {crudService} = require("../services");
const {uploadDestination} = require("../config");
const {getSettings} = require("../settings");
const { loggers } = require("../modules/logger");
const filesCrud = crudService("File");

const upload = (setting) =>
  multer({
    storage: multer.diskStorage({
      destination: uploadDestination + setting.destination,
    }),
    limits: {
      fileSize: 5e7,
      fieldSize: 5e7,
      files: 10,
    },
    fileFilter: (req, file, cb) => {
      const allowedMimetypes =
        setting["allowedMimetypes"] || // if settings is not defined
        // access configurable settings
        getSettings(setting["mimeSettingKey"]).split(",");

        console.log("allowedMimetypes\t:",allowedMimetypes)
        console.log("file.mimetype\t:",file.mimetype)

      if (allowedMimetypes.indexOf(file.mimetype) > -1) {
        return cb(null, true);
      }
      cb(new Error("Ce type n'est pas autorisé"));
    },
  });

function uploadErrorHandler(err, res) {
  res.status(400).json({message: err.message});
}

function uploadResponseHandler(req, res) {
  const {file} = req;
  filesCrud
      .addRecord({
        ...file,
        _id: file.filename,
      })
      .then(() => {
        setTimeout(() => {
        // leave time for elasticsearch to index its data
          res.end(req.file.filename);
        }, 2000);
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
      });
}

const loadHandler = (setting) => (req, res) => {
  let {load} = req.query;
  const {filename} = req.params;
  loggers("req.query", req.query)
  console.log("req.params", req.params)
  if(load.length>32){
    load = JSON.parse(load)["filename"]
  }
  filesCrud
      .getRecord({or_:[{match : {_id : load}},{match : {filename : load}}]})
      .then((file) => {
        loggers("file", file)
        if (file) {
          res.setHeader("content-type", file.mimetype);
          const filePath = uploadDestination + setting.destination + "/" + load;
          if (filename) {
            return res.sendFile(filePath);
          } else {
            return res.download(filePath, file.originalname);
          }
        }
        return res.status(404).end();
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({...err});
      });
};

const removeHandler = (setting) => (req, res) => {
  const file = req.body;
  filesCrud
      .deleteRecord({filename: file})
      .then(() =>
        fs.promises
            .unlink(uploadDestination + setting.destination + "/" + file)
            .then(() => {
              res.json({success: true});
            })
      )
      .catch((e) => {
        res.status(500).json(e);
      });
};

module.exports.uploadHandler = (setting) => upload(setting).single("filepond");
module.exports.uploadResponseHandler = uploadResponseHandler;
module.exports.uploadErrorHandler = uploadErrorHandler;
module.exports.loadHandler = loadHandler;
module.exports.removeHandler = removeHandler;
