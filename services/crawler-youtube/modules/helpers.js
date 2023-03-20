const _ = require("lodash");
exports.extractChannelId = extractChannelId;
exports.extractUserName = extractUserName;

const channelIdReg = /youtube.com\/channel\/([^\/\?]+)[\/\?]?/;
const userNameReg = /youtube.com\/user\/([^\/\?]+)[\/\?]?/;
function extractChannelId(url) {
  return _.get(url.match(channelIdReg), 1);
}
function extractUserName(url) {
  return _.get(url.match(userNameReg), 1);
}
