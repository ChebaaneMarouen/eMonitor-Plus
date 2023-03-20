const { client } = require("../db/elasticsearch");
exports.log = log;

function logTwitterPost(data) {
  const index = "crawler-twitter-post";
  console.debug("[DEBUG] twitter logging " + data.id);
  client
    .update({
      id: data.id,
      index,
      body: {
        doc: data,
        doc_as_upsert: true
      }
    })
    .catch(console.log);
}
function logFacebookPost(data) {
  const index = "crawler-fb-post";
  console.debug("[DEBUG] fbPost logging " + data.id);
  client
    .update({
      id: data.id,
      index,
      body: {
        doc: data,
        doc_as_upsert: true
      }
    })
    .catch(console.log);
}

function logWebsiteData(data) {
  const index = "crawler-website";
  console.debug("[DEBUG] logging " + data.url);
  client
    .update({
      id: data.url,
      index,
      body: {
        doc: data,
        doc_as_upsert: true
      }
    })
    .catch(console.log);
}

function log(msg) {
  const data = JSON.parse(msg.content);
  switch (data.type) {
    case "website":
      return logWebsiteData(data);
    case "fbPost":
      return logFacebookPost(data);
    case "twitterPost":
      return logTwitterPost(data);
  }
}
