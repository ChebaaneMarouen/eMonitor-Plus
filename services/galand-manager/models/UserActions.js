const { Model, Schema } = require("@localPackages/model");

module.exports = (function () {
    const UsersSchema = new Schema({
        userId: String,
        fName: String,
        lName: String,
        email: String,
        changeType: String, //UPDATE DELETE ADD
        modele: String, //dict,news,...
        created: {
            type: Number,
            mapping: "date",
        },
    });

    UsersSchema.pre("save", function (next) {
        const actions = this;
        if (!actions.created) {
            actions.created = Date.now();
        }
        next();
    });

    return new Model("users_actions", UsersSchema, "elasticsearch");
})();
