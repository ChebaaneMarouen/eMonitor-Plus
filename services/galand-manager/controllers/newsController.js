const path = require("path");
const rp = require("request-promise");
const _ = require("lodash");
const { getSettings } = require("../settings");
const validator = require("validator");
const { crudService, tagService, changeService, mailService } = require("../services/");
const { uploadDestination, newsFilesPath, external_token } = require("../config");
const { News, Project } = require("../models");
const { downloadVideo, downloadImage } = require("../modules/downloader");
const events = require("events");
const { loggers } = require("../modules/logger");
const eventEmitter = new events.EventEmitter();

const newsService = crudService("News", {
  sort: [{ created: "desc" }],
  size: 10,
});
const projectsCrud = crudService("Project");

const newsChanges = crudService("NewsChanges", {
  sort: [{ created: "desc" }],
  size: 10,
});
const userServices = crudService("User");
const tagsCrud = crudService("Tag");
const fileCrud = crudService("File");

const notificationServices = crudService("Notifications", {
  sort: [{ created: "desc" }],
  size: 5,
});

exports.deleteNews = (req, res) => {
  const { newsId } = req.params;
  newsService
    .deleteRecord({ _id: newsId })
    .then(() => {
      res.json({
        _id: newsId,
        deleted: true,
      });
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.checkMonitorPermission = async (req, res, next) =>{
  try {
    const { newsId } = req.params;
    const user = req.user;
    const {role, _id} = user;

    loggers("user", user)
    const news = await newsService.getRecord({ _id: newsId });
    loggers("monitor", news.monitor)
    loggers("creator", news.creator)
    if(_id === news.creator || _id === news.monitor || role === "5d55e3f00000000000000da9") return next();
    return res.status(401).json({
      message : "MESSAGE_NOT_ALLOWED"
    })

  } catch (error) {
    return res.status(500).json({
      message : error.message
    })
  }
}

exports.downloadImage = (req, res, next) => {
  const { coverImage } = req.body;
  const doImageDownload = req.body.downloadImage;
  if (!doImageDownload) return next();
  if (!validator.isURL(coverImage)) return next();
  downloadImage(path.join(uploadDestination, newsFilesPath), coverImage)
    .then((file) => {
      req.body.files = req.body.files || [];
      req.body.files.push(file);
      return fileCrud
        .addRecord({
          ...file,
          _id: file.serverId,
        })
        .then(() => next());
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};

const updateNewsFunc = async (req) =>{
  const { user } = req;
  const { newsId } = req.params;
  loggers("user test", user)
  const news = await newsService.getRecord({ _id: newsId });
  if (!news) return console.log("news deleted")
  if (user.roles === 0 && user._id !== news.creator) {
    return console.log("Cet action n'est pas autorisée");
  }
  const newNews = { ...news, files : req.body.files };
  newsService
    .addRecord(newNews)
    .then((updatedNews) => {

      eventEmitter.emit("video_downloaded", {
        userId: updatedNews.creator,
        title: updatedNews.title,
        _id: updatedNews._id,
      });

      notificationServices.addRecord({
        userId: updatedNews.creator,
        title: updatedNews.title,
        idNew: updatedNews._id,
        video : true,
        seen: false,
      });

      if(updatedNews.monitor && updatedNews.creator !== updatedNews.monitor){
        eventEmitter.emit("video_downloaded", {
          userId: updatedNews.monitor,
          title: updatedNews.title,
          _id: updatedNews._id,
        });
  
        notificationServices.addRecord({
          userId: updatedNews.monitor,
          title: updatedNews.title,
          idNew: updatedNews._id,
          video : true,
          seen: false,
        });
      }
     
      const endPoint = getSettings("newsEndPoint");
      console.log("endPoint update news\t", endPoint)
     
      rp(
        {
          uri: endPoint + updatedNews._id,
          json: true,
          body : updatedNews,
          method: "PUT",
        }
      ).catch(err => console.log("rp error \t", err ));
      
    })
    .catch((err) => {
      console.log(err);
      // if(!headerSent) 
    });
}
exports.downloadVideo = (req, res, next) => {

  const { videoUrl } = req.body;
  const doVideoDownload = req.body.downloadVideo;
  const { newsId } = req.params;
  if(!newsId) req.params.newsId = req.news._id; 
  if (!doVideoDownload && !req.news) return next();
  if (!doVideoDownload && req.news) return res.json({news : req.news});
  if (!validator.isURL(videoUrl) && !req.news) return next();
  if (!validator.isURL(videoUrl) && req.news) return res.json({news : req.news});
  downloadVideo(path.join(uploadDestination, newsFilesPath), videoUrl)
    .then((file) => {
      req.body.files = req.body.files || [];
      req.body.files.push(file);
      return fileCrud
        .addRecord({
          ...file,
          _id: file.serverId,
        })
        .then(() => updateNewsFunc(req));
    })
    .catch((err) => {
      console.log(err);
    });
    req.news ? res.json({news : req.news}) : next();
};

exports.getOne = (req, res, next) => {
  const { newsId } = req.params;
  newsService
    .getRecord({ id: newsId })
    .then((news) => {
      if (!news) {
        return res.status(404).json({ message: "MESSAGE_NEWS_DOES_NOT_EXIST" });
      }
      req.news = news;
      return next();
    })
    .catch((err) => {
      console.error(err);
      return res.status(500).json({ message: err.message });
    });
};

exports.getAll = (req, res) => {
  let query = Promise.resolve([]);
  const { user } = req;
  if (!user) res.status(401).json({ message: "Not Authenticated" });
  const roles = req.user.getRole();
  switch (roles) {
    case "journalist":
      query = newsService.getRecords({ status: 4, projectId: "" });
      break;
    default:
      query = newsService.getRecords({});
  }
  query
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      console.log(err);
      res.status(500).json({ message: err.message });
    });
};

exports.getAllAdded = (req, res) => {
  let query = Promise.resolve([]);
  const { user } = req;
  if (!user) res.status(401).json({ message: "Not Authenticated" });
  query = newsService.getRecords({ creator: user._id });
  query
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getAllFakenews = (req, res) => {
  let query = Promise.resolve([]);
  const { user } = req;
  if (!user) res.status(401).json({ message: "Not Authenticated" });
  query = newsService.getRecords({ fakeNews: true });
  query
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getAllAssigned = (req, res) => {
  const { user } = req;
  if (!user) res.status(401).json({ message: "N'est pas authorisé" });
  const roles = req.user.getRole();
  if (roles === "journalist") {
    res.status(401).json({ message: "N'est pas authorisé" });
  }
  const query = newsService.getRecords({ monitor: user._id });
  query
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getWaitingActions = (req, res) => {
  const { user } = req;
  const query = {
    // newly Created
    "actionPlan.status": 0,
  };
  if (user.getRole() === "monitor") {
    // if monitor restrict the search to assigned news
    query.monitor = user._id;
  }
  newsService
    .getRecords(query)
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getProjectsNews = (req, res) => {
  const { user } = req;
  const { projectId } = req.params;
  if (!user) res.status(401).json({ message: "N'est pas authorisé" });
  const roles = req.user.getRole();
  if (roles === "journalist") {
    res.status(401).json({ message: "N'est pas authorisé" });
  }
  projectsCrud
    .getRecord({ _id: projectId })
    .then((prj) => {
      console.log(prj);
      const userAllowed = prj.assignees.find(el => user._id === el)
      if (prj.endProject < Date.now() || !userAllowed) {
        res.json([]);
      } else {
        const query = newsService.getRecords({ projectId });
        query
          .then((news) => {
            res.json(news);
          })
          .catch((err) => {
            res.status(500).json({ message: err.message });
          });
      }
    })
    .catch((err) => res.status(500).json({ message: err.message }));
};

exports.getAllProjectsNews = (req, res) => {
  const { user } = req;
  if (!user) res.status(401).json({ message: "N'est pas authorisé" });
  const roles = req.user.getRole();
  if (roles === "journalist") {
    res.status(401).json({ message: "N'est pas authorisé" });
  }
  const query = newsService.getRecords({ regex_projectId: ".+" });
  query
    .then((news) => {
      res.json(news);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.searchAll = (req, res) => {
  const { user } = req;
  const role = user.getRole();
  if (role === "journalist") req.body.filter.status = 4;
  const { sort, page, filter, size } = req.body;
  newsService
    .getRecords({ ...filter, projectId: "" }, { sort, from: page, size })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.searchAllProjects = (req, res) => {
  const { user } = req;
  const role = user.getRole();
  if (role === "journalist") req.body.filter.status = 4;
  const { sort, page, filter, size } = req.body;

  if (filter.projectId)
    projectsCrud
      .getRecord({ _id: filter.projectId })
      .then((prj) => {
        console.log(prj);
        if (prj.endProject < Date.now()) {
          res.json([]);
        } else {
          newsService
            .getRecords({ ...filter, regex_projectId: ".+" }, { sort, from: page, size })
            .then((data) => {
              res.json(data);
            })
            .catch((err) => {
              res.status(500).json({ message: err.message });
            });
        }
      })
      .catch((err) => res.status(500).json({ message: err.message }));
  else
    newsService
      .getRecords({ ...filter, regex_projectId: ".+" }, { sort, from: page, size })
      .then((data) => {
        res.json(data);
      })
      .catch((err) => {
        res.status(500).json({ message: err.message });
      });
};

exports.projectsCount = (req, res) => {
  const { filter } = req.body;
  News.count({ ...filter, regex_projectId: ".+" })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.count = (req, res) => {
  const { filter } = req.body;

  News.count({ ...filter, projectId: "" })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.searchAllAdded = (req, res) => {
  const { user } = req;
  const { sort, filter, page, size } = req.body;
  newsService
    .getRecords({ ...filter, creator: user._id }, { sort, from: page, size })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.searchAllFakenews = (req, res) => {
  const { user } = req;
  const { sort, filter, page, size } = req.body;
  newsService
    .getRecords({ ...filter, fakeNews: true }, { sort, from: page, size })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.searchAssigned = (req, res) => {
  const { user } = req;
  const { sort, filter, page, size } = req.body;
  newsService
    .getRecords({ ...filter, monitor: user._id }, { sort, from: page, size })
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      res.status(500).json({ message: err.message });
    });
};

exports.getSigngleNews = (req, res) => {
  const { newsId } = req.params;
  newsService
    .getRecord({ _id: newsId })
    .then((news) => {
      if (!news) return res.status(404).json({ message: "Not Found" });
      res.json(news);
    })
    .catch((err) => {
      res.status(400).json({ message: err.message });
    });
};

exports.getNewsChanges = async (req, res) => {
  const { newsId } = req.params;
  try {
    let changes = await newsChanges
      .getRecords({ newsId }, { size: 15 })
      .then((changes) => changes.map(changeService.parseChanges));
    const userIds = changeService.getUserIds(changes);
    const tags = await tagsCrud.getRecords({});
    const users = await userServices.getRecords({ _id: userIds });
    changes = changeService.replaceIdsWithUserNames(changes, users, tags);
    res.json(changes);
  } catch (err) {
    console.log(err);
    res.status(500).json({ message: err.message });
  }
};


exports.updateNews = async (req, res, next) => {
  const { user } = req;
  const { newsId } = req.params;
  loggers("user", user)
  const news = await newsService.getRecord({ _id: newsId });
  if (!news) res.status(400).json({ message: "this item was deleted" });
  if (user.roles === 0 && user._id !== news.creator) {
    return res.status(401).json({ message: "Cet action n'est pas autorisée" });
  }
  const newNews = { ...news, ...req.body };
  
  if (newNews.comments) {
    newNews.comments = newNews.comments.filter(Boolean).map((c) => {
      if (typeof c === "string") {
        return {
          text: c,
          user: _.pick(user, ["fName", "lName", "_id"]),
          created: Date.now(),
        };
      }
      return c;
    });
  }
  newsService
    .addRecord(newNews)
    .then((updatedNews) => {
     
      const endPoint = getSettings("newsEndPoint");
      console.log("endPoint update news\t", endPoint)
     
      rp(
        {
          uri: endPoint + updatedNews._id,
          json: true,
          body : updatedNews,
          method: "PUT",
        }
      ).catch(err => console.log("rp error \t", err ));
      const changes = changeService.createChangeLog(news, updatedNews);
      changes.forEach(async (change) => {
        newsChanges.addRecord({
          ...change,
          userId: user._id,
          newsId: news._id,
        });
        if (change.changedKey === "monitor" && updatedNews.monitor) {
          const recieverUserId = change.newValue.replace('"', "").replace('"', "");
          userServices
            .getRecord({
              _id: recieverUserId,
            })
            .then((receiverUser) => {
              console.log(
                "\n\n\nSENDING MAIL\n\n\n" + receiverUser.email + "\n" + JSON.stringify(news) + "\n"
              );
              mailService
                .sendNotificationMail(receiverUser.email, {
                  url: news.link || news.url,
                })
                .then(() => {
                  console.log({ message: "MESSAGE_AN_EMAIL_WAS_SENT" });
                })
                .catch(console.log);
              eventEmitter.emit("affected_news", {
                userId: updatedNews.monitor,
                title: updatedNews.title,
                _id: updatedNews._id,
              });
              notificationServices.addRecord({
                userId: updatedNews.monitor,
                title: updatedNews.title,
                idNew: updatedNews._id,
                seen: false,
              });
            })
            .catch(console.log);
        }
        if (change.changedKey === "subjects") {
          tagService.updateTagsCount(news.subjects, updatedNews.subjects);
        }
        if (change.changedKey === "categories") {
          tagService.updateTagsCount(news.categories, updatedNews.categories);
        }
      });
      // if(!headerSent) 
      res.json(updatedNews);
    })
    .catch((err) => {
      console.log(err);
      // if(!headerSent) 
      res.status(400).json({ message: err.message });
    });
};

exports.fixSearchFilter = (req, res, next) => {
  const { page, size = 50 } = req.query;
  const defaultSort = [{ updatedTime: "desc" }];
  let { filter, sort = defaultSort } = req.body;
  sort = sort.filter((s) => s.key).map((s) => ({ [s.key]: s.order || "desc" }));
  filter = _.omitBy(
    filter,
    (value) => value === "" || value === null || (Array.isArray(value) && !value.length)
  );

  console.log("test ====",filter);

  req.body = { sort, filter, page: page * size, size };
  next();
};

exports.createExternalNews = (req, res, next) => {
  const {token, title, link, sujets, categories, description, coverImage} = req.body;
  console.log(token, external_token)

  if (token === external_token){
    newsService
    .addRecord({
      title,
      text : description,
      subjects : sujets,
      categories,
      link,
      coverImage,
      creator: req.user._id,
      creatorInfo: _.pick(req.user, ["fName", "lName", "_id"])
    })
    .then(news =>res.json(news))
    .catch(error=>{
      console.log(error);
      res.status(400).json({ message: error.message });
    })
  }else{
    res.status(401).json({message : "Unauthorized"})
  }
};

exports.createNews = (req, res, next) => {
  const body = _.omit(req.body, "_id");
  newsService
    .addRecord({
      ...body,
      creator: req.user._id,
      creatorInfo: _.pick(req.user, ["fName", "lName", "_id"]),
    })
    .then(async (news) => {
      if (news.monitor) {
        const recieverUserId = news.monitor.replace('"', "").replace('"', "");
       
        userServices
          .getRecord({
            _id: recieverUserId,
          })
          .then((receiverUser) => {
            mailService
              .sendNotificationMail(receiverUser.email, {
                url: news.link || news.url,
              })
              .then(() => {
                console.log({ message: "MESSAGE_AN_EMAIL_WAS_SENT" });
              })
              .catch(console.log);

            eventEmitter.emit("affected_news", {
              userId: news.monitor,
              title: news.title,
              _id: news._id,
            });
            notificationServices.addRecord({
              userId: news.monitor,
              title: news.title,
              idNew: news._id,
              seen: false,
            });
          })
          .catch(console.log);
      }
      const endPoint = getSettings("newsEndPoint");
      console.log("endPoint create news\t", endPoint)
     
      if (endPoint && /^(https?:\/\/)?[0-9a-zA-Z]+\.[-_0-9a-zA-Z]+\.[0-9a-zA-Z]+$/.exec(endPoint)) {
        rp(
          {
            uri: endPoint + news._id,
            json: true,
            body : news,
            method: "POST",
          }
        ).catch(err => console.log("rp error \t", err ));
      }
      newsChanges
        .addRecord({
          userId: req.user._id,
          newsId: news._id,
          changedKey: "created",
        })
        .catch((err) => console.log("CHANGES SAVE", err));

      const { subjects, categories } = news;
      if (subjects.length) tagService.incTags(subjects);
      if (categories.length) tagService.incTags(categories);

      req.news = news
      next()
    })
    .catch((err) => {
      console.error(err);
      return res.status(400).json({ message: err.message });
    });
};

exports.describe = (req, res) => {
  newsService
    .describe()
    .then((data) => {
      res.json(data);
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};

exports.eventEmitter = eventEmitter;
