const _ = require("lodash");
const {getSettings} = require("./settings");
const request = require("request");
const {scrapLogger} = require("./loggers");

exports.getPosts = getPosts;
exports.getChannelId = getChannelId;

function addToDate(value, date) {
  const changedValue = new Date(date).getTime() + value;
  return new Date(changedValue).toISOString();
}

const channelApiEndpoint = (key, userName) =>
  `https://www.googleapis.com/youtube/v3/channels?part=id&forUsername=${userName}&key=${key}`;

const searchApiEndpoint = (key, channelId, maxResults) =>
  `https://www.googleapis.com/youtube/v3/search?key=${key}&channelId=${channelId}&part=id&order=date&maxResults=${maxResults}`;

const videosApiEndpoint = (key, videoIds, parts) => {
  const ids = videoIds.join(",");
  return `https://www.googleapis.com/youtube/v3/videos?key=${key}&id=${ids}&part=${parts}`;
};

function getChannelId(userName) {
  return new Promise((resolve, reject) => {
    const url = channelApiEndpoint(getSettings("secretKey"), userName);
    request.get({url, json: true}, (err, resp, body) => {
      resolve(_.get(body, "items.0.id"));
    });
  });
}

// eslint-disable-next-line
function getPosts({ channelId, lastPublishDate }) {
  let endpoint = searchApiEndpoint(
      getSettings("secretKey"),
      channelId,
      getSettings("youtubeMaxResult")
  );

  if (lastPublishDate) {
    // removing 1ms  allows us to skip equal dates
    const lessThanLastPublishDate = addToDate(-1000, lastPublishDate);
    endpoint += "&publishedBefore=" + lessThanLastPublishDate;
  }

  return new Promise((resolve, reject) => {
    request.get({url: endpoint, json: true}, (err, resp, body) => {
      if (err) return reject(err);
      if (!body.items) return reject(body);

      const videoIds = body.items.map(({id}) => id.videoId);
      console.log("videoIDS\t",videoIds)
      const videosEndpoint = videosApiEndpoint(
          getSettings("secretKey"),
          videoIds,
          getSettings("parts")
      );
      request({url: videosEndpoint, json: true}, (err, _, body) => {
        if (err) return reject(err);
        if (!body.items) return reject(body);
        resolve(body.items);
      });
    });
  });
}
