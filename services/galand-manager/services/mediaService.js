module.exports = function ({ Feed, News }) {
  function getUrls(media) {
    return media.links
      .map((link) => ({
        source: link.source,
        url: link.url,
      }))
      .filter((val) => val.url);
  }

  function countAttributes(media) {
    /** *
     * Will add num of Articles, Fake news,Infractions to the media
     */
    return Promise.all([getNumArticles(media), getNumFakeNews(media), getNumInfraction(media)]).then(
      ([countArticles, countFakeNews, countInfractions]) => {
        console.log(countArticles, countFakeNews, countInfractions);
        return {
          ...media,
          countArticles,
          countFakeNews,
          countInfractions,
        };
      }
    );
  }

  function getNumArticles({ _id }) {
    return Feed.count({ "media.keyword": _id });
  }

  function getNumFakeNews({ _id }) {
    return News.count({ media: _id });
  }
  function getNumInfraction({ _id }) {
    return News.count({
      media: _id,
      "infraction.status": News.infractionEnum.INFRACTION_VALIDE,
    });
  }

  return {
    getUrls,
    countAttributes,
  };
};
