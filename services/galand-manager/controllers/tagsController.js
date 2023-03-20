const request = require("request");
const { getSettings } = require("../settings");
const { crudService } = require("../services/");
const tagsCrud = crudService("Tag");

function getTags(req, res) {
  tagsCrud
    .getRecords({})
    .then((records) => {
      res.json(records);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

function updateTag(req, res) {
  const { id } = req.params;
  tagsCrud
    .getRecord({ _id: id })
    .then((record) => {
      if (!record) {
        return res.status(404).json({ message: "Not found" });
      }
      return tagsCrud.addRecord({ ...record, ...req.body }).then((record) => {
        res.json(record);
        const endPoint = getSettings("tagsEndPoint");
        request(
          {
            url: endPoint + "/" + record._id,
            json: record,
            method: "PUT",
          },
          (err) => {
            if (err) console.log(err);
          }
        );
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

function createTag(req, res) {
  tagsCrud
    .createNew(req.body)
    .then((record) => {
      res.json(record);
      const endPoint = getSettings("tagsEndPoint");
      request(
        {
          method: "POST",
          url: endPoint,
          json: record,
        },
        (err) => {
          if (err) console.log(err);
        }
      );
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
}

function removeTag(req, res) {
  const { id } = req.params;
  tagsCrud
    .deleteRecord({ _id: id })
    .then(() => {
      res.status(200).json({ _id: id, deleted: true });
      const endPoint = getSettings("tagsEndPoint");
      request({ url: endPoint + "/" + id, method: "DELETE" }, (err) => {
        if (err) console.log(err);
      });
    })
    .catch((e) => {
      console.log(e);
      res.status(500).json(e);
    });
}
module.exports = {
  createTag,
  removeTag,
  getTags,
  updateTag,
};
