const docker = require("./docker");
const {loggin} = require("../config");
const {sendMail} = require("./mailer");

module.exports = (() => {
    const logs = [];

    // start listening to docker events
    docker.containerEvents((line) => {
        return;
        // keep a history of last logs
        line = JSON.parse(line);
        logs.unshift(line);
        if (logs.length > loggin.logs_length) {
            logs.pop();
        }
        // notifications concernes the container
        if (line["status"] === "die") {
            // a container has stopped
            const exitCode = line["Actor"]["Attributes"]["exitCode"];
            const container = line["Actor"]["Attributes"]["name"];
            docker.logContainerNoStream(
                container,
                loggin.logs_length,
                (err, stdout) => {
                    if (err) {
                        console.error(err);
                    }
                    sendMail({
                        containerId: container,
                        exitCode,
                        logs: stdout,
                    }).catch((err) => {
                        console.log(err);
                    });
                }
            );
        }
    });

    function getLogs() {
        return logs;
    }

    return {
        getLogs,
    };
})();
