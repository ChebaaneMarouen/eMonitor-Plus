const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
  const NotificationsSchema = new Schema({
    userId: {
      type: String,
      mapping: "keyword",
    },
    title: String,
    idNew : String,
    seen : Boolean,
    video : Boolean,
    created: {
      type: Number,
      mapping: "date",
    },
  });

  NotificationsSchema.pre("save", function(next) {
    const notification = this;
    if (!notification.created) {
      notification.created = Date.now();
    }
    next();
  });

  return new Model("notifications", NotificationsSchema, "elasticsearch");
})();
