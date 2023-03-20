exports.extractScreenName = extractScreenName;

const screenNameReg = /twitter.com\/([^\/\?]+)[\/\?]?/;
function extractScreenName(url) {
  return url.match(screenNameReg)[1];
}
