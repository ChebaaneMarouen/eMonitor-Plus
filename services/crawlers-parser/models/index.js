const models = require("require-all")({
  dirname: __dirname,
  filter: /^(?!index\.js)(.+)\.js$/,
});
module.exports = models;
