const _ = require("lodash");
const express = require("express");
const { allow } = require("../services/checkRoles");
const { crudService } = require("../services/");

module.exports = function (model, permission) {
  const router = express.Router();
  const service = crudService(model);
  router.get("/", permission ? allow(permission, 1) : (req, res, next) => next(), (req, res) => {
    service
      .getRecords({})
      .then((records) => {
        res.json(records);
      })
      .catch((err) => {
        let statusCode = _.get(err, ["meta.statusCode"]);
        if (!statusCode) statusCode = 500;

        res.status(statusCode).json({ message: err.message });
      });
  });
  router.post("/search", permission ? allow(permission, 1) : (req, res, next) => next(), (req, res) => {
    service
      .getRecords(req.body)
      .then((records) => {
        res.json(records);
      })
      .catch((err) => {
        let statusCode = _.get(err, ["meta.statusCode"]);
        if (!statusCode) statusCode = 500;

        res.status(statusCode).json({ message: err.message });
      });
  });

  router.get("/:id", permission ? allow(permission, 1) : (req, res, next) => next(), (req, res) => {
    const { id } = req.params;
    service
      .getRecord({ _id: id })
      .then((record) => {
        res.json(record);
      })
      .catch((err) => {
        let statusCode = _.get(err, ["meta.statusCode"]);
        if (!statusCode) statusCode = 500;

        res.status(statusCode).json({ message: err.message });
      });
  });

  router.put("/:id", allow(permission, 2), (req, res) => {
    const { id } = req.params;
    service
      .getRecord({ _id: id })
      .then((record) => {
        if (!record) {
          return res.status(404).json({ message: model + " not found" });
        }
        return service.addRecord({ ...record, ...req.body }).then((record) => {
          res.json(record);
        });
      })
      .catch((err) => {
        let statusCode = _.get(err, ["meta.statusCode"]);
        if (!statusCode) statusCode = 500;

        res.status(statusCode).json({ message: err.message });
      });
  });

  router.post("/", allow(permission, 2), (req, res) => {
    service
      .createNew(req.body)
      .then((record) => {
        res.json(record);
      })
      .catch((err) => {
        let statusCode = _.get(err, ["meta.statusCode"]);
        if (!statusCode) statusCode = 500;

        res.status(statusCode).json({ message: err.message });
      });
  });

  router.delete("/:recordId", allow(permission, 2), (req, res) => {
    const { recordId } = req.params;
    service
      .deleteRecord({ _id: recordId })
      .then(() => {
        res.status(200).json({ _id: recordId, deleted: true });
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
  });
  return router;
};
