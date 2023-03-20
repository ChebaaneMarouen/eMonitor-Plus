exports.objectHaveSingleKey = objectHaveSingleKey;
exports.mergeScriptedFields = mergeScriptedFields;

function objectHaveSingleKey(obj, key) {
  const keys = Object.keys(obj);
  return keys.length === 1 && keys[0] === key;
}

function mergeScriptedFields(obj) {
  if (!obj) return null;
  return Object.keys(obj).reduce((acc, v) => {
    return {...acc, [v]: obj[v][0]};
  }, {});
}
