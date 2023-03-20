const {spawn, execFile} = require("child_process");
const readline = require("readline");

module.exports = (() => {
    function startContainer(containerId, cb) {
        execFile("docker", ["start", containerId], cb);
    }

    function stopContainer(containerId, cb) {
        execFile("docker", ["stop ", containerId], cb);
    }

    function removeContainer(containerId, cb) {
        execFile("docker", ["rm", containerId], cb);
    }

    function restartContainer(containerId, cb) {
        execFile("docker", ["restart", containerId], cb);
    }

    const containerLogs = {};
    const INIT_LIFE = 4;
    setInterval(updateLogsProcessLifetime, 1000 * 30); // 30 sec

    function updateLogsProcessLifetime() {
        Object.keys(containerLogs).forEach((key) => {
            const logCommand = containerLogs[key];
            logCommand["lifespan"] -= 1;
            if (logCommand.lifespan <= 0) {
                logCommand.logCommand.kill();
            }
            delete containerLogs[key];
        });
    }

    function keepLogProcessAlive(containerId, {clientId, cb}) {
        if (containerLogs[containerId]) {
            containerLogs[containerId].lifespan = INIT_LIFE;
        } else {
            logContainer(containerId, {clientId, cb});
        }
    }

    function logContainerNoStream(containerId, length, cb) {
        execFile("docker", ["logs", "--tail", length, containerId], cb);
    }

    function logContainer(containerId, {clientId, cb}) {
        if (containerLogs[containerId]) {
            containerLogs[containerId].callbacks[clientId] = cb;
            return;
        }
        const logCommand = spawn("docker", [
            "logs",
            "--tail",
            "100",
            "-t",
            "-f",
            containerId,
        ]);
        logCommand.stderr.on("data", (data) => {
            process.stderr.write(data);
        });
        logCommand.on("error", (err) => {
            console.error(err);
        });

        const rl = readline.createInterface({
            input: logCommand.stdout,
        });
        containerLogs[containerId] = {
            callbacks: {clientId: cb},
            lifespan: 5,
            logCommand,
        };
        rl.on("line", (line) => {
            if (containerLogs[containerId]) {
                Object.values(containerLogs[containerId].callbacks).forEach((cb) => {
                    cb(line);
                });
            }
        });
    }

    function statsContainers(cb) {
        execFile(
            "docker",
            ["stats", "-a", "--no-stream", "--format", "{{json .}}"],
            cb
        );
    }

    function containerEvents(cb) {
        const dockerEvents = spawn("docker", [
            "events",
            "--since",
            "24h",
            "--format",
            "{{json .}}",
        ]);
        dockerEvents.stderr.on("data", (data) => {
            process.stderr.write(data);
        });
        dockerEvents.on("error", (err) => {
            console.error(err);
        });

        const rl = readline.createInterface({
            input: dockerEvents.stdout,
        });

        rl.on("line", cb);
    }

    return {
        startContainer,
        stopContainer,
        statsContainers,
        restartContainer,
        containerEvents,
        removeContainer,
        logContainer,
        keepLogProcessAlive,
        logContainerNoStream,
    };
})();
