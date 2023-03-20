const _ = require("lodash");
const { crudService } = require("../services");
const { getDisplaySettings } = require("../settings");

function describe(req, res) {
  const feedCrud = crudService("Feed");
  feedCrud
    .describe()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
}

function displayConfig(req, res) {
  res.json(getDisplaySettings());
}

function getOne(req, res) {
  const feedCrud = crudService("Feed");
  const { feedId } = req.params;
  feedCrud
    .getRecord({ _id: feedId })
    .then((feed) => {
      if (!feed) return res.status(404).json({ message: "Not Found" });
      res.json(feed);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
}

function search(req, res) {
  const defaultSort = [{ updatedTime: "desc" }];
  const { page, size = 50 } = req.query;
  let { filter = {}, sort = defaultSort } = req.body;
  console.log("filter ==== ", filter)
  sort = sort.filter((s) => s.key).map((s) => ({ [s.key]: s.order || "desc" }));
  filter = _.omitBy(
    filter,
    (value) => value === "" || value === null || (Array.isArray(value) && !value.length)
  );

  const feedCrud = crudService("Feed", {
    from: (page || 0) * size,
    size: size,
    sort,
  });

  feedCrud
    .getRecords(filter || {})
    .then((records) => {
      res.json(records);
    })
    .catch((err) => {
      let statusCode = _.get(err, ["meta.statusCode"]);
      if (!statusCode) statusCode = 500;
      res.status(statusCode).json({ message: err.message });
    });
}

function update(req, res) {
  const feedCrud = crudService("Feed");
  feedCrud
    .addRecord(req.body)
    .then((data) => res.json(data))
    .catch((err) => {
      let statusCode = _.get(err, ["meta.statusCode"]);
      if (!statusCode) statusCode = 500;

      res.status(statusCode).json({ message: err.message });
    });
}

exports.search = search;
exports.describe = describe;
exports.displayConfig = displayConfig;
exports.update = update;
exports.getOne = getOne;
