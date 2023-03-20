const _ = require("lodash");
const db = require("../db/elasticsearch");
const {
  buildQueryFromObject,
  buildUpdateQuery,
  buildScriptFields,
  buildSortQuery,
  createMappingsDescription,
} = require("../modules/queryBuilder");
const eventServices = require("../modules/eventServices");
const helpers = require("../modules/helpers");

exports.save = save;
exports.update = update;
exports.get = get;
exports.remove = remove;
exports.setOptions = setOptions;

function save(msg) {
  const {query, collection, options, data} = JSON.parse(msg.content);
  delete data._id;
  let insertMethod = null;
  if (!query) {
    insertMethod = insert(collection, data, options);
  } else if (query._id && Object.keys(query).length === 1) {
    // we are updating a doc just by id
    insertMethod = updateById(collection, query, data, options);
  } else {
    // TODO : update by query
    insertMethod = updateByQuery(collection, query, data, options);
  }
  insertMethod.then(_success(msg)).catch(_error(msg));
}

function get(msg) {
  const {query, collection, options} = JSON.parse(msg.content);
  let getMethod = find;
  if (_.get(options, "isGetOne")) {
    getMethod = findOne;
  }
  if (_.get(options, "isCount")) {
    getMethod = count;
  }
  return getMethod(collection, query, options)
      .then(_success(msg))
      .catch(_error(msg));
}

function remove(msg) {
  const {query, collection, options} = JSON.parse(msg.content);
  const parsedQuery = buildQueryFromObject(query);
  db.deleteByQuery({
    index: collection,
    body: parsedQuery,
  })
      .then(_success(msg))
      .catch(_error(msg));
}

function update(msg) {
  const {query, collection, update} = JSON.parse(msg.content);
  if (helpers.objectHaveSingleKey(query, "_id")) {
    const ids = [].concat(query._id);
    const updateObj = buildUpdateQuery(update);
    const updates = ids.map((id) =>
      db.update({
        id,
        index: collection,
        body: updateObj,
      })
    );
    Promise.all(updates)
        .then(_success(msg))
        .catch(_error(msg));
  }
}

function count(collection, queryObj) {
  const query = buildQueryFromObject(queryObj);
  return db
      .count({index: collection, body: query})
      .then((r) => {
        console.log(r);
        return r;
      })
      .then(({body}) => body.count);
}

function insert(collection, data, options) {
  console.log("[INSERT] ", collection);
  return db.index({id: data._id, index: collection, body: data});
}

function updateByQuery(collection, query, data, options) {
  // console.log('[UPSERT]', collection, '[query]', query);
  // console.error('[WARN]  UPDATE BY QUERY NOT REALLY UPDATING BY QUERY');
  return db.update({
    id: query._id,
    index: collection,
    body: {
      doc: data,
      doc_as_upsert: true,
    },
  });
}

function updateById(collection, query, data, options) {
  // console.log('[UPSERT BY ID]', collection, '[query]', query);
  return db
      .update({
        id: query._id,
        index: collection,
        body: {
          doc: data,
          doc_as_upsert: true,
        },
      })
      .then(() => ({...data, _id: query._id}));
}

function getValuesOfKeywords(collection, mappings) {
  const keywordAttributes = mappings.filter(
      (mapping) => mapping.type === "keyword"
  );
  console.log(keywordAttributes);
  if (!keywordAttributes.length) return mappings;
  const aggs = keywordAttributes.reduce((acc, v) => {
    return {
      ...acc,
      [v.key]: {
        terms: {
          field: v.key,
          size: 1000,
        },
      },
    };
  }, {});

  return db
      .search({
        index: collection,
        body: {
          size: 0,
          aggs,
        },
      })
      .then((data) => {
        console.log(JSON.stringify(data, null, 2));
        return data;
      })
      .then((data) => data.body.aggregations)
      .then((data) => {
        console.log(data);
        return Object.keys(data).reduce((acc, v) => {
          return {...acc, [v]: data[v].buckets.map((bucket) => bucket.key)};
        }, {});
      })
      .then((data) => {
        return mappings.map((mapping) => {
          if (mapping.type === "keyword") {
            return {...mapping, values: data[mapping.key]};
          }
          return mapping;
        });
      });
}

function setOptions(msg) {
  const {collection, action} = JSON.parse(msg.content);
  if (action === "describe") {
    db.indices
        .getMapping({
          index: collection,
        })
        .then((data) =>
          _.get(data, "body." + collection + ".mappings.properties", {})
        )
        .then(createMappingsDescription)
        .then(getValuesOfKeywords.bind(null, collection))
        .then(_success(msg))
        .catch(_error(msg));
  } else {
    return initDatabase(msg);
  }
}
function initDatabase(msg) {
  const {collection, action, options, dbOptions = {}} = JSON.parse(
      msg.content
  );
  const {mappings, indexes} = options;

  console.log("RECEIVING ", collection, JSON.stringify(options, null, 2));

  const mapObject = {};
  for (const obj of indexes) {
    mapObject[obj.path] = {index: obj.index};
  }

  for (const obj of mappings) {
    mapObject[obj.path] = {...mapObject[obj.path], type: obj.type};
  }

  console.log("[MAPPING] ", collection, JSON.stringify(mapObject, null, 2));
  db.indices
      .exists({
        index: collection,
      })
      .then((res) => {
        if (res.statusCode === 200) {
          db.indices
              .putMapping({
                index: collection,
                body: {
                  ...dbOptions, // database parameters
                  properties: mapObject,
                },
              })
              .then(_success(msg))
              .catch(_error(msg));
        } else {
          return db.indices
              .create({
                index: collection,
                body: {
                  mappings: {
                    properties: mapObject,
                  },
                },
              })
              .then(_success(msg))
              .catch(_error(msg));
        }
      })
      .catch(_error(msg));
}

function find(collection, queryObj, options = {}) {
  let {from, size, sort, scriptedFields} = options;
  size = size || 500;
  const query = buildQueryFromObject(queryObj);

  sort = buildSortQuery(sort);
  const scriptedFieldsQuery = buildScriptFields(scriptedFields);
  console.log(
      "FIND",
      collection,
      JSON.stringify(
          {...query, ...scriptedFieldsQuery, from, size, sort},
          null,
          2
      )
  );
  return db
      .search({
        index: collection,
        body: {...query, ...scriptedFieldsQuery, _source: "*", from, size, sort},
      })
      .then((result) =>
        result.body.hits.hits.map((r) => ({
          ...r._source,
          _id: r._id,
          // the score according to the search query
          _score: r._score,
          ...helpers.mergeScriptedFields(r.fields),
        }))
      );
}

function findOne(collection, query, options) {
  return find(collection, query, options).then((result) => {
    return result && result[0];
  });
}

function _success(msg) {
  return (result) => {
    eventServices.send(
        msg.properties.replyTo,
        {
          success: true,
          result,
        },
        {correlationId: msg.properties.correlationId}
    );
  };
}

function _error(msg) {
  return (error) => {
    console.error(JSON.stringify(error, null, 2));
    if (error.meta) {
      error = {message: _.get(error, "meta.body.error.reason", error.name)};
    }
    eventServices.send(
        msg.properties.replyTo,
        {
          success: false,
          error,
        },
        {correlationId: msg.properties.correlationId}
    );
  };
}
