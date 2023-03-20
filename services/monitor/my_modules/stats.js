const {statsContainers} = require("./docker");
const {dockerIntervalCheck} = require("../config");

module.exports = (() => {
    let stats = [];
    setInterval(() => {
        statsContainers((err, data) => {
            if (err) {
                return console.error(err);
            }
            data = data
                .split("\n")
                .map((d) => {
                    if (d) return JSON.parse(d);
                })
                .filter((d) => d);
            stats = data.map(parseStat).filter((p) => p["pid"] != null);
        });
    }, 1000);

    function getStats() {
        return stats;
    }

    function parseStat(stat) {
        const parsedStats = {};
        parsedStats["cpu%"] = Number(stat["CPUPerc"].replace("%", ""));
        parsedStats["mem%"] = Number(stat["MemPerc"].replace("%", ""));
        parsedStats["memoryRaw"] = getRawValues(stat["MemUsage"].split("/")[0]);
        parsedStats["memory"] = stat["MemUsage"].split("/")[0];
        parsedStats["networkInRaw"] = getRawValues(stat["NetIO"].split("/")[0]);
        parsedStats["networkOutRaw"] = getRawValues(stat["NetIO"].split("/")[1]);
        parsedStats["networkIn"] = stat["NetIO"].split("/")[0];
        parsedStats["networkOut"] = stat["NetIO"].split("/")[1];
        parsedStats["timeNano"] = stat["timeNano"];

        parsedStats["diskInRaw"] = getRawValues(stat["BlockIO"].split("/")[0]);
        parsedStats["diskOutRaw"] = getRawValues(stat["BlockIO"].split("/")[1]);
        parsedStats["diskIn"] = stat["BlockIO"].split("/")[0];
        parsedStats["diskOut"] = stat["BlockIO"].split("/")[1];

        parsedStats["name"] = stat["Name"];
        parsedStats["id"] = stat["ID"];
        parsedStats["type"] = stat["Name"].split("_")[0];
        parsedStats["pid"] = stat["PIDs"];

        parsedStats["alive"] = stat["PIDs"] !== "0";

        return parsedStats;
    }

    function getRawValues(value) {
        if (!value) return 0;
        const units = ["Ki?B", "Mi?B", "Gi?B"];
        for (let i = 0; i < units.length; i++) {
            const unit = units[i];
            const exp = new RegExp("([\\d\\.]+)" + unit, "i");
            const match = value.match(exp);
            if (match) {
                const val = Number(match[1]);
                if (val) {
                    return val * Math.pow(1000, i - 1);
                }
            }
        }
        return 0;
    }
    return {
        getStats,
    };
})();
