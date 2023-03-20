const crypto = require("crypto");
exports.md5 = function(ch) {
  return crypto
      .createHash("md5")
      .update(ch)
      .digest("hex");
};
