const historyModel = require("./visitedSites");

exports.addUrl = function(url) {
  historyModel.save({url}).catch((err) => {
    console.log(err);
  });
};

exports.filterUrls = function(urls) {
  return historyModel
      .get({multi_url: urls})
      .then((items) => {
        const existingUrls = items
            .map((it) => it.url)
            .reduce((acc, v) => ({[v]: true, ...acc}), {});

        return urls.filter((url) => !existingUrls[url]);
      })
      .catch((err) => {
        console.error(err);
        return urls;
      });
};
