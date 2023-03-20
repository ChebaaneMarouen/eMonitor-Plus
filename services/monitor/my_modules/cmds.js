const { exec } = require("child_process");
const util = require("util");
const execp = util.promisify(require("child_process").exec);

cache = {};

module.exports = (function() {
    function ping(container) {
        const cmd = `ping -qc1 ${container} 2>&1 | awk -F'/' 'END{ print (/min/? $5:"FAIL")  }'`;

        return execp(cmd).then(result => {
            return {
                container,
                time: result.stdout
            };
        });
    }

    return {
        ping
    };
})();
