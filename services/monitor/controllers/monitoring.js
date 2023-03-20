const express = require("express");
const router = express.Router();

const docker = require("../my_modules/docker");
const stats = require("../my_modules/stats");
const notifier = require("../my_modules/notifier");
const {loggin} = require("../config");

router.get("/", (req, res) => {
    res.jsonp({
        status: stats.getStats(),
        logs: notifier.getLogs(),
    });
});

router.post("/actions", (req, res) => {
    const {containerId, action} = req.body;

    if (!(containerId && action)) {
        return res.status(400).end();
    }

    const handler = (err) => {
        if (err) {
            console.error(err);
            return res.status(500).json(err);
        }
        res.jsonp({
            success: true,
        });
    };

    console.log(containerId + "\t\t" + action);

    switch (action) {
    case "stop":
        return docker.stopContainer(containerId, handler);
    case "start":
        return docker.startContainer(containerId, handler);
    case "restart":
        return docker.restartContainer(containerId, handler);

    case "remove":
        return docker.removeContainer(containerId, handler);
    }

    res.status(400).json(new Error("unkonwen action"));
});

module.exports = router;
