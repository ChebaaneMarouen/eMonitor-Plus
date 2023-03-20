const _ = require("lodash");
const eventServices = require("../modules/eventServices");
const helpers = require("../modules/helpers");
const ytTools = require("../modules/youtubeTools");
const {scrapLogger} = require("../modules/loggers");
const { getSettings } = require("../modules/settings");
const rp = require("request-promise");

exports.crawl = crawl;

function publishTimeString(post) {
  return _.get(post, "snippet.publishedAt");
}

function timeOfPost(post) {
  return new Date(publishTimeString(post)).getTime();
}

const commentsApiEndpoint = (key, videoId) => {
  return `https://www.googleapis.com/youtube/v3/commentThreads?key=${key}&textFormat=plainText&part=snippet&videoId=${videoId}&maxResults=100`;
};

async function crawl(msg) {
  const data = JSON.parse(msg.content);
  // eslint-disable-next-line
  let { mediaId, _id, url, collectedAllPosts, additionalData = {} } = data;

  let channelId = _.get(additionalData, "channelId");

  if (!channelId) {
    channelId = helpers.extractChannelId(url);
  }
  if (!channelId) {
    const userName = helpers.extractUserName(url);
    channelId = await ytTools.getChannelId(userName);
  }

  const lastPublishDate = collectedAllPosts
    ? undefined
    : additionalData.lastPublishDate;

  scrapLogger.info("Youtube Querying: " + url);

  ytTools
      .getPosts({channelId, lastPublishDate})
      .then((posts) => {
      // create an event for each result
        posts.forEach(async (post) => {
          try {
            let commentEndpoint = commentsApiEndpoint(
              getSettings("secretKey"),
              post.id
            );
            const resp = await rp({
              uri: commentEndpoint,
              method: "GET",
              }); 
              let comments = JSON.parse(resp).items;
              comments.forEach((comment)=>{
              comment["comment"] = comment["snippet"]["topLevelComment"]["snippet"]["textOriginal"];
              comment["userName"] = comment["snippet"]["topLevelComment"]["snippet"]["authorDisplayName"];
              });
             eventServices.create("crawlingDone", {
              ...post,
              media: mediaId,
              source: "youtube",
              comments : {
                data : comments
              },
              crawlTime: Date.now(),
              created: timeOfPost(post),
            });
          } catch (error) {
            console.log(error);
          }
        });

        scrapLogger.info("Result " + url + ": " + posts.length + " items", posts[0]);

        const newLastPublishDate =
        _.get(posts.pop(), "snippet.publishedAt") || lastPublishDate;

        eventServices.create("allCrawlingDone", {
          source: "youtube",
          numberOfNewItems: posts.length,
          oldestPublishTimestamp: timeOfPost(posts.pop()),
          additionalData: {channelId, lastPublishDate: newLastPublishDate},
          _id,
        });
      })
      .catch(scrapLogger.error);
}
