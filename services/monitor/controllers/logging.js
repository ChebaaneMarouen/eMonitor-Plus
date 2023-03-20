const Debug = require("../models/Debug");
exports.addLogs = (io) =>
    function(msg) {
        const data = JSON.parse(msg.content);
        Debug.save(data)
            .then((data) => {
                io.in("users").emit("appLogData", data);
            })
            .catch(console.error);
    };
