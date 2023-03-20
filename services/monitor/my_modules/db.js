const mongojs = require("mongojs");
const {mongo} = require("../config");

module.exports = (() => {
    const db = mongojs(mongo.cnxString(), ["monitored"], {
        reconnectTries: 60,
        reconnectInterval: 1000,
    });

    db.on("error", function(err) {
        console.log("database error", err);
    });

    function save(doc, cb) {
        db.monitored.save(doc, cb);
    }

    function get(cb) {
        db.monitored.find(cb);
    }
    function remove(containerId, cb) {
        db.monitored.remove({containerId}, cb);
    }
    return {
        save,
        get,
        remove,
    };
})();
