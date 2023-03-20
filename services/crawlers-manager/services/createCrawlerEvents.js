const eventServices = require("./eventServices");

module.exports = function() {
  function create(watched) {
    console.log("============ watched ===============\n" , JSON.stringify(watched, null, 4) , "\n================================")
    switch (watched.source) {
      case "facebook":
        if (watched.crowdTangle || watched.search_crowdTangle) {
          eventServices.create("crowdTanglePageAdded", {
            url: watched.url,
            _id: watched._id,
            newestItem: watched.newestItem,
            collectedAllPosts: watched.collectedAllPosts,
            oldestItem: watched.oldestItem,
            mediaId: watched.mediaId,
            additionalData: watched.additionalData,
            search_crowdTangle : watched.search_crowdTangle
          });
        } else {
          eventServices.create("fbPageAdded", {
            url: watched.url,
            _id: watched._id,
            newestItem: watched.newestItem,
            collectedAllPosts: watched.collectedAllPosts,
            oldestItem: watched.oldestItem,
            mediaId: watched.mediaId,
            additionalData: watched.additionalData,
          });
        }
        break;
      case "twitter":
        eventServices.create("twitterUserAdded", {
          url: watched.url,
          _id: watched._id,
          newestItem: watched.newestItem,
          collectedAllPosts: watched.collectedAllPosts,
          oldestItem: watched.oldestItem,
          mediaId: watched.mediaId,
          additionalData: watched.additionalData,
        });
        break;
      case "instagram":
        eventServices.create("instagramUserAdded", {
          url: watched.url,
          _id: watched._id,
          newestItem: watched.newestItem,
          collectedAllPosts: watched.collectedAllPosts,
          oldestItem: watched.oldestItem,
          mediaId: watched.mediaId,
          additionalData: watched.additionalData,
        });
        break;
      case "youtube":
        eventServices.create("youtubeUserAdded", {
          url: watched.url,
          _id: watched._id,
          newestItem: watched.newestItem,
          collectedAllPosts: watched.collectedAllPosts,
          oldestItem: watched.oldestItem,
          mediaId: watched.mediaId,
          additionalData: watched.additionalData,
        });
        break;
      case "rss":
        eventServices.create("websiteRSSAdded", {
          url: watched.url,
          _id: watched._id,
          mediaId: watched.mediaId,
          additionalData: watched.additionalData,
        });
        break;
      case "sitemap":
        eventServices.create("websiteSitemapAdded", {
          url: watched.url,
          _id: watched._id,
          mediaId: watched.mediaId,
          additionalData: watched.additionalData,
        });
        break;
      default:
        eventServices.create("websiteAdded", {
          url: watched.url,
          _id: watched._id,
          pseudoUrl : watched.pseudoUrl,
          mediaId: watched.mediaId,
          additionalData: watched.additionalData,
        });
        break;
    }
  }

  return {
    create,
  };
};
