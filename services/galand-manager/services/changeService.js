const _ = require("lodash");

exports.createChangeLog = createChangeLog;
exports.parseChanges = parseChanges;
exports.getUserIds = getUserIds;
exports.replaceIdsWithUserNames = replaceIdsWithUserNames;

const ignoredFields = ["lastModified"];

function replaceIdWithValues(change, dict) {
  if (!change) return change;
  if (Array.isArray(change)) {
    return change.map((c) => dict[c]).filter(Boolean);
  }
  return dict[change] || {};
}

function replaceAttributeInArray(changes, objects, targetField, fields) {
  objects = objects.map((obj) => _.pick(obj, fields));
  const objectsById = _.keyBy(objects, "_id");
  changes = changes.map((c) => {
    if (c.changedKey === targetField) {
      return {
        ...c,
        oldValue: replaceIdWithValues(c.oldValue, objectsById),
        newValue: replaceIdWithValues(c.newValue, objectsById),
      };
    }
    return c;
  });
  return changes;
}

function replaceIdsWithUserNames(changes, users, tags) {
  users = users.map((user) => _.pick(user, ["_id", "fName", "lName"]));
  const usersById = _.keyBy(users, "_id");
  changes = changes.map((c) => ({...c, userId: usersById[c.userId] || ""}));
  changes = replaceAttributeInArray(changes, users, "monitor", [
    "_id",
    "fName",
    "lName",
  ]);
  changes = replaceAttributeInArray(changes, tags, "categories", [
    "_id",
    "label",
    "color",
  ]);
  changes = replaceAttributeInArray(changes, tags, "subjects", [
    "_id",
    "label",
    "color",
  ]);
  return changes;
}

function getUserIds(changes) {
  /* will exctarct list of affected userId*/
  const userIds = changes.map((c) => c.userId);
  const monitorsId = changes
      .filter((c) => c.changedKey === "monitor")
      .map((c) => [c.oldValue, c.newValue])
      .reduce((acc, c) => acc.concat(c), []);
  return userIds.concat(monitorsId).filter(Boolean);
}

function tryParse(value) {
  try {
    return JSON.parse(value);
  } catch (e) {
    return value;
  }
}

function parseChanges(change) {
  const {oldValue, newValue} = change;
  return {
    ...change,
    newValue: tryParse(newValue),
    oldValue: tryParse(oldValue),
  };
}

function createChangeLog(oldNewsObject, newNewsObject) {
  const modifications = [];
  Object.keys(newNewsObject).forEach((key) => {
    if (ignoredFields.indexOf(key) > -1) return;
    if (!_.isEqual(oldNewsObject[key], newNewsObject[key])) {
      modifications.push({
        changedKey: key,
        oldValue: JSON.stringify(oldNewsObject[key]),
        newValue: JSON.stringify(newNewsObject[key]),
      });
    }
  });
  return modifications;
}
