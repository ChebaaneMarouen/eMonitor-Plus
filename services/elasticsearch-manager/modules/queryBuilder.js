const _ = require("lodash");
module.exports = (() => {
  function emptyValue(val) {
    return val == null || (_.isArray(val) && _.isEmpty(val));
  }

  function buildScriptFields(scriptedFields) {
    if (
      !scriptedFields ||
      !scriptedFields instanceof Array ||
      !scriptedFields.length
    ) {
      return null;
    }

    const scriptFields = scriptedFields.reduce((acc, v) => {
      if (!v.script || !v.propName) return acc;
      return {
        ...acc,
        [v.propName]: {
          script: {
            lang: "painless",
            source: v.script,
            params: v.params || {},
          },
        },
      };
    }, {});
    return {
      script_fields: scriptFields,
    };
  }

  function buildQueryFromObject(objQuery) {
    const obj = _.omitBy(objQuery, emptyValue);
    console.log("BUILD OBJ QUERY ", obj);
    if (Object.keys(obj).length === 0) {
      return {
        query: {
          match_all: {},
        },
      };
    }
    /** Will create DSI query from mongoose like query*/
    const query = {must: [], should : []};
    const query_should = {should: []};
    let should  = false;
    for (const key of Object.keys(obj)) {
      const actions = key.split("_");
      if (actions.length > 1) {
        const action = actions.shift();
        console.log("ACTION ", action);
        const field = actions.join("_");
        console.log("field", field)
        console.log("obj[key]", obj[key])
        switch (action) {
          // query
          case "not":
            query.must.push({
              bool: {
                must_not: buildQueryFromObject(obj[key]).query.bool.must,
              },
            });
            break;
            case "or":
            query.should=obj[key];
            break;
          case "exist":
            query.must.push({
              exists: {field: obj[key]},
            });
            break;
          // case "all":
          //   query.must.push({
          //     query_string: {
          //       query: String(obj[key]),
          //       lenient: true,
          //       boost: 1.2,
          //       fuzziness: "AUTO",
          //       allow_leading_wildcard: false
          //     },
          //   });
          //   break;
            case "all":
            query.must.push({
              multi_match: {
                query: String(obj[key]),
                fields : ["text", "title", "comments.comment"],
                type: "phrase_prefix",
              },
            });
            break;
          case "before":
            query.must.push({
              range: {
                [field]: {
                  lte: obj[key],
                },
              },
            });
            break;
          case "after":
            query.must.push({
              range: {
                [field]: {
                  gte: obj[key],
                },
              },
            });
            break;
          case "regex":
            query.must.push({
              regexp: {
                [field]: {value: obj[key]},
              },
            });
            break;
          case "equal":
            query.must.push({term: {[field]: obj[key]}});
            break;
          case "moreLike":
            query.must.push({
              more_like_this: obj[key],
            });
            break;
          case "like":
            query.must.push({match: {[field]: obj[key]}});
            break;
          case "multi":
            query.must.push({
              terms: {[field]: obj[key]},
            });
            break;
          case "":
            if (field == "id") {
              query.must.push({
                ids: {values: [].concat(obj[key])},
              });
            }
            break;
          default:
            console.log("[WARN] unknowen operation ", key);
        }
      } else {
        query.must.push({term: {[key]: obj[key]}});
      }
    }
    console.log("QUERY", JSON.stringify(query, null, 2));
    return {
      query: {
        bool: query,
      },
    };
  }

  function buildSortQuery(sortArray) {
    if (!sortArray) return sortArray;
    return sortArray
        .filter((sa) => Object.keys(sa)[0])
        .map((sa) => {
          const key = Object.keys(sa)[0];
          return {
            [key]: {
            // default to desc order
              order: sa[key] || "desc",
            },
          };
        });
  }

  function buildUpdateQuery(updateObj) {
    const inc = updateObj["$inc"];
    let updateScript = "";
    Object.keys(inc).forEach((key) => {
      updateScript += "ctx._source['" + key + "'] +=" + inc[key] + " ;";
    });
    return {
      script: {
        source: updateScript,
      },
    };
  }
  function concat(root, key) {
    if (!root) return key;
    return root + "." + key;
  }

  function createMappingsDescription(mappings, root = "") {
    return Object.keys(mappings)
        .map((key) => {
          const obj = mappings[key];
          if (obj.properties) {
            return createMappingsDescription(obj.properties, concat(root, key));
          }
          if (obj.type === "keyword") {
            return {
              key: concat(root, key),
              type: "keyword",
            };
          }
          if (obj.type === "text") {
          // if there is a keyword attribute favor keyword attribute
            if (_.get(obj, ["fields.keyword.type"]) === "keyword") {
              return {
                key: concat(root, key),
                type: "keyword",
              };
            } else {
              return {
                key: concat(root, key),
                type: "text",
              };
            }
          }
          if (obj.type) {
            return {
              key: concat(root, key),
              type: obj.type,
            };
          }
        })
        .filter(Boolean)
        .reduce((acc, v) => {
          return acc.concat(v);
        }, []);
  }

  return {
    buildQueryFromObject,
    buildUpdateQuery,
    buildScriptFields,
    createMappingsDescription,
    buildSortQuery,
  };
})();
