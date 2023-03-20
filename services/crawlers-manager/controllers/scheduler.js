const {crudService, createCrawlerEvents} = require("../services");
const crudWatched = crudService("Watched");
const {Watched} = require("../models");
const cron = require("node-cron");
const {getSettings} = require("../settings");
const {freqLogger, schedulingLogger} = require("../modules/loggers");
const {fixScheduleFormat} = require("../modules/helper");

const cronTasks = {};
exports.start = start;
exports.watch = watch;
exports.unWatch = unWatch;

exports.updateScheduler = (msg) => {
  const crawlReport = JSON.parse(msg.content);
  crudWatched.getRecord({_id: crawlReport._id}).then((watched) => {
    if (!watched) {
      return freqLogger.warn(
          "[WARNING] watch not found id: " + crawlReport._id
      );
    }
    const {
      numberOfNewItems,
      oldestPublishTimestamp,
      additionalData,
    } = crawlReport;

    console.log("oldest", oldestPublishTimestamp)
    console.log("numberOfNewItems", numberOfNewItems)
    console.log("watched.collectedAllPosts", watched.collectedAllPosts)
    console.log("additionalData", additionalData)

    watched.additionalData = additionalData;

    if (!watched.collectedAllPosts && numberOfNewItems === 0) {
      // there is no new data to collect
      watched.collectedAllPosts = true;
    }

    if (oldestPublishTimestamp && !watched.collectedAllPosts) {
      const oldestDate = getSettings("oldestDate");

      watched.oldestPublishTimestamp = oldestPublishTimestamp;
      console.log("oldestDate ", oldestDate )

      console.log("new Date(oldestDate) > new Date(oldestPublishTimestamp)", new Date(oldestDate) > new Date(oldestPublishTimestamp))
      watched.collectedAllPosts =
        new Date(oldestDate) > new Date(oldestPublishTimestamp);
    }

    crudWatched.addRecord(watched).catch((err) => freqLogger.error(err.message));
  });
};

function crawl({url}) {
  crudWatched.getRecord({_id: url}).then((watched) => {
    if (watched) {
      console.log(watched);
      createCrawlerEvents.create(watched);
    }
  }).catch(err=>freqLogger.error(err.message));
}
function watch(watched) {
  if (cronTasks[watched.url]) {
    cronTasks[watched.url].stop();
    cronTasks[watched.url].destroy();
  }
  const schedule = fixScheduleFormat(watched.schedule);
  if (cron.validate(schedule)) {
    cronTasks[watched.url] = cron.schedule(schedule, () => crawl(watched));
    schedulingLogger.info("Watching " + JSON.stringify(watched, null, 2));
  } else {
    schedulingLogger.warn(
        "Invalid cron expression " + JSON.stringify(watched, null, 2)
    );
  }
}

function unWatch(watched) {
  if (cronTasks[watched.url]) {
    cronTasks[watched.url].stop();
    cronTasks[watched.url].destroy();
    delete cronTasks[watched.url];
  }
}

function start() {
  // init
  Watched.get({}, {size: 10000}).then((watchedUrls) => {
    watchedUrls.forEach(watch);
  }).catch(err=>freqLogger.error(err.message));
}
