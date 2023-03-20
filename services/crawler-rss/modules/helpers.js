exports.extractHost = extractHost;

function extractHost(url) {
  return new URL(url).hostname;
}
