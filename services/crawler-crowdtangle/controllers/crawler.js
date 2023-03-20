const eventServices = require("../modules/eventServices");
const fbTools = require("../modules/fbTools");
const _ = require("lodash");
const {scrapLogger} = require("../modules/loggers");

exports.crawl = crawl;

async function crawl(msg) {
  const data = JSON.parse(msg.content);
  console.log("data", JSON.stringify(data,null,4))
  const {additionalData, mediaId, _id, url, collectedAllPosts, search_crowdTangle} = data;

  scrapLogger.info("Target: " + url);
  const next = collectedAllPosts ? null : _.get(additionalData, "next");
  let pageId = _.get(additionalData, "pageId");

  if (!pageId && !search_crowdTangle) {
    pageId = fbTools.extractPageId(url);
  }
  if(search_crowdTangle){
    pageId = !pageId ? url : pageId;

    fbTools.searchPosts({pageId, next}, (err, posts, newNext) => {
      if (err) return scrapLogger.error(err);
      scrapLogger.info("Collected " + posts.length + "items from " + pageId);
  
      posts.forEach((post) => {
  
        const data = {
          ...post,
          url : post.postUrl,
          title : post.description || post.message,
          imageSource : post.media? post.media.filter(el=>el.type === "photo")[0] ? post.media.filter(el=>el.type === "photo")[0].full : null : null,
          videoUrl :post.media? post.media.filter(el=>el.type === "video")[0] ? post.media.filter(el=>el.type === "video")[0].url : null : null,
          userName : post.account.name,
          likes_count : post.statistics.actual.likeCount,
          angry_count : post.statistics.actual.angryCount,
          sad_count : post.statistics.actual.sadCount,
          wow_count : post.statistics.actual.wowCount,
          love_count : post.statistics.actual.loveCount,
          care_count : post.statistics.actual.careCount,
          haha_count : post.statistics.actual.hahaCount,
          comments_count : post.statistics.actual.commentCount,
          shares_count : post.statistics.actual.shareCount,
          media: mediaId,
          source: "facebook",
          created: new Date(post.date).getTime(),
          crawlTime: Date.now(),
        };
        eventServices.create("crawlingDone", data);
      });
  
      eventServices.create("allCrawlingDone", {
        source: "facebook",
        numberOfNewItems: posts.length,
        // will be used to estimate page publish frequecy
        oldestPublishTimestamp: posts
            .map((post) => new Date(post.date).getTime())
            .sort()
            .pop(),
        additionalData: {next: newNext, pageId},
        _id,
      });
    });

  }else{
    fbTools.getPosts({pageId, next}, (err, posts, newNext) => {
      if (err) return scrapLogger.error(err);
      scrapLogger.info("Collected " + posts.length + "items from " + pageId);
  
      posts.forEach((post) => {
  
        const data = {
          ...post,
          url : post.postUrl,
          title : post.description || post.message,
          imageSource : post.media? post.media.filter(el=>el.type === "photo")[0] ? post.media.filter(el=>el.type === "photo")[0].full : null : null,
          videoUrl :post.media? post.media.filter(el=>el.type === "video")[0] ? post.media.filter(el=>el.type === "video")[0].url : null : null,
          userName : post.account.name,
          likes_count : post.statistics.actual.likeCount,
          angry_count : post.statistics.actual.angryCount,
          sad_count : post.statistics.actual.sadCount,
          wow_count : post.statistics.actual.wowCount,
          love_count : post.statistics.actual.loveCount,
          care_count : post.statistics.actual.careCount,
          haha_count : post.statistics.actual.hahaCount,
          comments_count : post.statistics.actual.commentCount,
          shares_count : post.statistics.actual.shareCount,
          media: mediaId,
          source: "facebook",
          created: new Date(post.date).getTime(),
          crawlTime: Date.now(),
        };
        eventServices.create("crawlingDone", data);
      });
  
      eventServices.create("allCrawlingDone", {
        source: "facebook",
        numberOfNewItems: posts.length,
        // will be used to estimate page publish frequecy
        oldestPublishTimestamp: posts
            .map((post) => new Date(post.date).getTime())
            .sort()
            .pop(),
        additionalData: {next: newNext, pageId},
        _id,
      });
    });
  }
  
}
