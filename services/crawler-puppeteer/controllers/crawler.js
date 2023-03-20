const eventServices = require("../modules/eventServices");
const {getSettings} = require("../settings");
const {scrapLogger} = require("../modules/loggers");
const normalizeUrl = require("normalize-url");

const Apify = require("apify");
exports.crawl = crawl;

async function doCrawl(url, pseudoUrl, _id,  cb) {
  try {

    console.log("pseudoUrl\t" , pseudoUrl)
    // encode _id
  const buff = new Buffer.from(_id);
  const base64Id = buff.toString("base64");

  // Create a RequestQueue
  const requestQueue = await Apify.openRequestQueue(base64Id);

  // delete old crawl history to force it to start again
  // await requestQueue.drop();

  // Define the starting URL
  await requestQueue.addRequest({url});
  const pseudo = pseudoUrl ? pseudoUrl : url;
  const pseudoUrls = [new Apify.PseudoUrl(pseudo + "[.*]")];

  console.log("psedoUrls : \t ", pseudoUrls)
  // Function called for each URL

  const handlePageFunction = async ({request, page}) => {
    try {
       // Add all links from page to RequestQueue
    await Apify.utils.enqueueLinks({
      page,
      requestQueue,
      pseudoUrls,
      selector: "a",
    });

    scrapLogger.info("crawling " + request.url);
    const name = url ? url.split("/")[2] ? url.split("/")[2].split(".")[1] : "" : "";
    const data = {
      id: request.url,
      url: request.url,
      html: await page.content(),
      crawlTime: Date.now(),
      mediaName : name,
      source: "website",
    };
    cb(data);
    } catch (error) {
      scrapLogger.error(error)
    }
   
  };
  // Create a PuppeteerCrawler
  console.log("getSettings('maxRequestsPerCrawl')", getSettings("maxRequestsPerCrawl"))
  const crawler = new Apify.PuppeteerCrawler({
    requestQueue,
    handlePageFunction,
    maxConcurrency: getSettings("maxConcurrency"),
    maxRequestsPerCrawl: getSettings("maxRequestsPerCrawl"),
  });
  // Run the crawler
  await crawler.run().then(async () => {
    try {
      const info = await requestQueue.getInfo();
    scrapLogger.info("DONE: " + url + "\t " + JSON.stringify(info, null, 2));
    requestQueue.drop();
    } catch (error) {
      scrapLogger.error(error)
    }
    
  });
  } catch (error) {
    scrapLogger.error(error)
  }
  
}

function crawl(msg) {
  const data = JSON.parse(msg.content);
  let {_id, url, mediaId, pseudoUrl} = data;
  console.log("============ data ===============\n" , JSON.stringify(data, null, 4) , "\n================================")
  url = url === "https://www.mosaiquefm.net/fr/"? url : normalizeUrl(url,{stripWWW: false});

  scrapLogger.debug("crawling " + url);

  doCrawl(url, pseudoUrl, _id, (data) => {
    eventServices.create("crawlingDone", {...data, media: mediaId});
  });
}
