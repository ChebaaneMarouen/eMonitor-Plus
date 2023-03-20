const jwt = require("jsonwebtoken");
const {auth} = require("../config");
const cookie = require("cookie");
const ROOM = "users";
const docker = require("../my_modules/docker");
const Debug = require("../models/Debug");

module.exports = (io) => {
    function broadcastData(type, payload) {
        io.in(ROOM).emit("data", {
            type,
            payload,
        });
    }

    function notification(type) {
        return (msg) => {
            const data = JSON.parse(msg.content);
            if (data.userId) {
                io.in(data.userId).emit("notification", {
                    type,
                    message: data.userMsg,
                });
            }
        };
    }

    function listenForUserActions(client) {
        const clientId = client.id;
        client.on("loadAppLogData", () => {
            console.log("CLIENT REQS");
            Debug.get({}, {size: 1000, sort: [{time: "desc"}]})
                .then((data) => {
                    client.emit("appLogData", data);
                })
                .catch(console.error);
        });

        client.on("getLogs", ({containerId}) => {
            docker.logContainer(containerId, {
                clientId,
                cb: (line) => {
                    client.emit("logData", {
                        type: "logData",
                        payload: {
                            containerId,
                            line,
                        },
                    });
                },
            });
        });

        client.on("updateLogsProcessLifetime", ({containerId}) => {
            docker.keepLogProcessAlive(containerId, {
                clientId,
                cb: (line) => {
                    client.emit("logData", {
                        type: "logData",
                        payload: {
                            containerId,
                            line,
                        },
                    });
                },
            });
        });
    }

    function start(client) {
        client.on("user-room", () => {
            const data = client.request.headers.cookie || "";
            const cookies = cookie.parse(data);
            if (cookies.monitorAuth) {
                const {user, secret} = auth;
                jwt.verify(cookies.monitorAuth, secret, function(err, decoded) {
                    if (!decoded || decoded.user !== user) {
                        return;
                    }
                    client.join(ROOM);
                    listenForUserActions(client);
                });
            }
        });
    }

    return {
        start,
        notification,
        broadcastData,
    };
};
