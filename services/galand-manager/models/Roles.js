const { Model, Schema } = require("@localPackages/model");

const numberType = {
  type: Number,
  mapping: "integer",
};

const booleanType = {
  type: Boolean,
  mapping: "boolean",
};
const permissions = {
  P_FAKENEWS: numberType,
  P_GLOBAL_FAKENEWS: numberType,
  P_STATEMENT: numberType,
  P_FAKENEWS_REJECTION: booleanType,
  P_FAKENEWS_VALIDATION: booleanType,
  P_NEWS_DELETE: booleanType,
  P_FAKENEWS_DELETE: booleanType,
  P_FAKENEWS_PUBLISH: booleanType,
  P_AFFECT_FAKENEWS: numberType,
  P_ASSIGN_TO_PROJECT_FROM_FAKENEWS: booleanType,
  P_MACHINE_LEARNING_MODELS: numberType,
  P_GET_ASSIGNED: booleanType,
  P_DICTIONNARY: numberType,
  P_PROJECT: numberType,
  P_VIDEO: numberType,
  P_FORM: numberType,
  P_MEDIA: numberType,
  P_TAGS: numberType,
  P_ROLES: numberType,
  P_RULES: numberType,
  P_USERS: numberType,
  P_CLASSIFICATION: numberType,
  P_ACCESS_SCRAPPING: booleanType,
  P_EDIT_SYSTEM_SEETINGS: booleanType,
  P_CUSTOM_SEARCH: numberType,
  P_ACCESS_STATISTICS: booleanType,
  P_VALIDATE_INFRACTION: booleanType,
  P_FAKENEWS_INFRACTIONS: numberType,
  P_MONITORING_INFRACTIONS: numberType,
  P_ACTION_PLANS: numberType,
  P_WEB_SCRAPPING_RULES: numberType,
  P_RULES: numberType,
  P_EXCEL : booleanType
};

module.exports = (function () {
  const schema = new Schema({
    name: { type: String, required: "MESSAGE_ROLE_NAME_IS_REQUIRED" },
    permissions,
    created: {
      type: Number,
      mapping: "date",
    },
  });

  schema.pre("save", function (next) {
    const data = this;
    if (!data.created) {
      data.created = Date.now();
    }
    next();
  });

  const model = new Model("roles", schema, "elasticsearch");
  model.permissions = permissions;
  return model;
})();
