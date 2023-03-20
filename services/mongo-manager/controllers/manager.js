const db = require("../db/mongo");
const eventServices = require("../modules/eventServices");

exports.save = save;
exports.get = get;
exports.remove = remove;
exports.setOptions = setOptions;

function save(msg) {
  console.log("[SAVE] ", JSON.parse(msg.content));
  const { query, collection, options, data } = JSON.parse(msg.content);
  let insertMethod = null;
  if (!query) {
    insertMethod = insert(collection, data, options);
  } else {
    insertMethod = updateOne(collection, query, data, options);
  }
  insertMethod.then(_success(msg)).catch(_error(msg));
}

function get(msg) {
  const { query, collection, options } = JSON.parse(msg.content);
  const getMethod = options && options.isGetOne ? findOne : find;

  console.log("[GET]", collection, "[QUERY]", JSON.stringify(query, null, 2));

  return getMethod(collection, query)
    .then(_success(msg))
    .catch(_error(msg));
}

function remove(msg) {
  const { query, collection, options } = JSON.parse(msg.content);
  db.get(collection)
    .remove(query, options)
    .then(_success(msg))
    .catch(_error(msg));
}

function insert(collection, data, options) {
  console.log("[INSERT] ", collection, data);
  return db.get(collection).insert(data, options);
}

function updateOne(collection, query, data, options) {
  console.log("[UPSERT]", collection, "[query]", query, "[data]", data);
  return db
    .get(collection)
    .findOneAndUpdate(query, { $set: data }, { upsert: true, ...options });
}

function setOptions(msg) {
  const { collection, options } = JSON.parse(msg.content);
  const { indexes } = options;
  const dbCollection = db.get(collection);
  console.log(indexes);
  Promise.all(
    indexes.map(indexConf =>
      dbCollection.createIndex(indexConf.path, indexConf.index)
    )
  )
    .then(_success(msg))
    .catch(_error(msg));
}

function find(collection, query) {
  return db.get(collection).find(query);
}

function findOne(collection, query) {
  return db.get(collection).findOne(query);
}

function _success(msg) {
  return result => {
    console.log("success");
    console.log(result);
    eventServices.send(
      msg.properties.replyTo,
      {
        success: true,
        result
      },
      { correlationId: msg.properties.correlationId }
    );
  };
}

function _error(msg) {
  return error => {
    console.error(error);
    eventServices.send(
      msg.properties.replyTo,
      {
        success: false,
        error
      },
      { correlationId: msg.properties.correlationId }
    );
  };
}
