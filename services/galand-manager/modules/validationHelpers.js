const {isURL} = require("validator");
module.exports = (() => {
  function isUrl(value) {
    return isURL(value);
  }
  return {
    isUrl,
  };
})();
