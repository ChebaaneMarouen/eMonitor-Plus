const eventServices = require("../modules/eventServices");
const helpers = require("../modules/helpers");
const twTools = require("../modules/twitterTools");
const {scrapLogger} = require("../modules/loggers");

exports.crawl = crawl;
exports.crawlMentions = crawlMentions;

async function crawl(msg) {
  const data = JSON.parse(msg.content);
  // eslint-disable-next-line
  let { mediaId, _id, url, collectedAllPosts, additionalData = {} } = data;
  // eslint-disable-next-line
  const screen_name = helpers.extractScreenName(url);

  // eslint-disable-next-line
  const max_id = collectedAllPosts ? undefined : additionalData.max_id;
  const oldestPublishTimestamp = collectedAllPosts
  ? undefined
  : additionalData.oldestPublishTimestamp;

  // eslint-disable-next-line
  scrapLogger.info("Started Querying: " + screen_name + " max_id " + max_id);

  twTools
      .getPosts({screen_name, max_id})
      .then((posts) => {
           // create an event for each result
      posts.forEach(async (post, i) => { 
        try {       
        const comments = await twTools.getUserMentions(post["user"]["id"], post["id_str"]);
        console.log(i, post.text, post["user"]["id"]);
        console.log("\n===============\n==============\n", comments, "\n===============\n==============\n");
        eventServices.create("crawlingDone", {
          ...post,
          comments : {
            data : comments
          },
          media: mediaId,
          source: "twitter",
          origin: screen_name,
          crawlTime: Date.now(),
          created: new Date(post.created_at).getTime(),
        });
      } catch (error) {
        console.log(error)
      }   
      });
        scrapLogger.info(
            "Result " + screen_name + ": " + posts.length + " items"
        );

        const lastPost = posts.pop();
        const newOldestPublishTimestamp = lastPost
        ? new Date(lastPost.created_at).getTime()
        : oldestPublishTimestamp;
        // eslint-disable-next-line
      const new_max_id = lastPost ? lastPost.id_str : max_id;

        eventServices.create("allCrawlingDone", {
          source: "twitter",
          numberOfNewItems: posts.length,
          // will be used to estimate page publish frequecy
          additionalData: {
            max_id: new_max_id,
            oldestPublishTimestamp : newOldestPublishTimestamp
          },
          oldestPublishTimestamp : newOldestPublishTimestamp,
          _id,
        });
        
      })
      .catch(scrapLogger.error);
}

function crawlMentions(msg) {
  const data = JSON.parse(msg.content);
  console.log("message", data)
  if(data["cron_action"]){
      twTools.cronJob(data)
      }else{
        twTools.stopCronJob()
      }
}


