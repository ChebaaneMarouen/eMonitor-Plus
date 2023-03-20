const requireAll = require("require-all");
const models = require("../models");


console.log(__dirname);
module.exports = requireAll({
    dirname: __dirname,
    filter: /^(?!index\.js)(.+)\.js$/,
    resolve: (service) => {

        if (typeof service === "function")
            return service(models);

        return service;
    }
});
