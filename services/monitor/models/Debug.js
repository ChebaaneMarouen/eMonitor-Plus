const {Model, Schema} = require("@localPackages/model");

module.exports = (function() {
    const schema = new Schema({
        origin: {type: String, mapping: "keyword"},
        containerId: {type: String, mapping: "keyword"},
        task: {type: String, mapping: "keyword"},
        level: {type: String, mapping: "keyword"},
        text: {type: String},
        time: {type: Number, mapping: "date"},
    });

    schema.pre("save", function(next) {
    // eslint-disable-next-line
    const debug = this;
        if (!debug.time) {
            debug.time = Date.now();
        }
        next();
    });

    return new Model("debug", schema, "elasticsearch");
})();
