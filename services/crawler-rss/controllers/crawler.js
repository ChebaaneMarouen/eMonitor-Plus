const Parser = require("rss-parser");
const eventServices = require("../modules/eventServices");
const {scrapLogger} = require("../modules/loggers");
const normalizeUrl = require("normalize-url");
const request = require("request");

exports.crawl = crawl;

function doCrawl(url, cb) {
  const parser = new Parser();
  parser.parseURL(url, (err, feed) => {
    if (err) return scrapLogger.error(err.message);
    console.log(JSON.stringify(feed.items[0], null, 2));
    feed.items.forEach((entry, i) => {
      setTimeout(() => {
        request.get(encodeURI(entry.link), (err, res, body) => {
          if (err) return scrapLogger.error(err.message);
          const data = {
            _id: entry.link,
            url: entry.link,
            text: entry.contentSnippet,
            html: body,
            created: new Date(entry.isoDate).getTime(),
            crawlTime: Date.now(),
            source: "website",
          };
          cb(data);
        });
      }, 1100 * i); // space out requests with one second
    });
  });
}

function crawl(msg) {
  const data = JSON.parse(msg.content);
  let {url, mediaId} = data;
  url = normalizeUrl(url);

  scrapLogger.debug("crawling " + url);

  doCrawl(url, (data) => {
    eventServices.create("crawlingDone", {...data, media: mediaId});
  });
}
