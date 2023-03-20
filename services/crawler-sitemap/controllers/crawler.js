const util = require("util");
const asyncLib = require("async");
const sitemaps = require("sitemap-stream-parser");
const request = util.promisify(require("request"));
const cheerio = require("cheerio");
const eventServices = require("../modules/eventServices");
const helpers = require("../modules/helpers");
const {getSettings} = require("../settings");
const historyService = require("../modules/historyService");
const {scrapLogger} = require("../modules/loggers");
const normalizeUrl = require("normalize-url");

exports.crawl = crawl;

function doCrawl(websites, host, mediaId, cb) {
  asyncLib.mapLimit(
      websites,
      getSettings("limitConcurrent"),
      function(website, done) {
        setTimeout(() => {
          request({
            url: encodeURI(website),
            headers: {
              "User-Agent": getSettings("userAgent"),
            },
          })
              .then((html) => {
                done();
                const $ = cheerio.load(html.body);
                const text = $("body").text();

                const data = {
                  _id: website,
                  url: website,
                  host: host,
                  html: html.body,
                  text,
                  crawlTime: Date.now(),
                  media: mediaId,
                  source: "website",
                };
                eventServices.create("crawlingDone", data);
                scrapLogger.debug("Scrapping: " + website);
                historyService.addUrl(website);
              })
              .catch((err) => {
                console.log(website);
                console.error(err);
                done();
              });
        }, getSettings("sleepIntervals"));
      },
      cb
  );
}

function crawl(msg) {
  const data = JSON.parse(msg.content);
  let {host, url, _id, mediaId} = data;
  const targets = [];
  url = normalizeUrl(url);

  host = host || helpers.extractHost(url);

  scrapLogger.debug("crawling " + host);

  sitemaps.sitemapsInRobots("http://" + host + "/robots.txt", (err, urls) => {
    if (err || !urls || urls.length == 0) {
      // if we can't find sitemap in robots we make a guess
      urls = "http://" + host + "/sitemap.xml";
    }
    sitemaps.parseSitemaps(
        urls,
        (website) => {
          targets.push(website);
        },
        (err, sitemaps) => {
          scrapLogger.debug("Before filtering " + targets.length);
          historyService.filterUrls(targets).then((filtredUrls) => {
            scrapLogger.debug("After filtering " + filtredUrls.length);
            doCrawl(filtredUrls, host, mediaId, () => {
              eventServices.create("allCrawlingDone", {
                source: "website",
                numberOfNewItems: targets.length,
                // will be used to estimate page publish frequecy
                // TODO: better web creation estimation
                createdTimes: targets.map(() => new Date().getTime()),
                _id,
              });
            });
          });
        }
    );
  });
}
