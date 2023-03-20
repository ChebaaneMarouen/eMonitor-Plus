const _ = require("lodash");
const {crudService, eventServices, mediaService} = require("../services");
const {Media} = require("../models");
const mediaCrud = crudService("Media");

function notifyMediaUpdate(req, res) {
  const {media, createdLinks, deletedLinks} = req;
  createdLinks.map((link) => {
    console.log("\n\naddedWatchedUrl\n",JSON.stringify({...link, mediaId: media._id}, null, 4), "\n\n\n")
    eventServices.create("addedWatchedUrl", {...link, mediaId: media._id});
  });
  deletedLinks.map((link) => {
    eventServices.create("removedWatchedUrl", link);
  });
  res.json(media);
}
function updateMedia(req, res, next) {
  const media = req.body;
  mediaCrud
      .getRecord({_id: media._id})
      .then((oldMedia) => {
        if (!oldMedia) {
          return res.status(400).json({message: "MESSAGE_MEDIA_DOESNT_EXIST"});
        }
        mediaCrud.addRecord(media).then((addedMedia) => {
          req.media = media;
          req.createdLinks = media.links.filter(
              (link) => !oldMedia.links.some((oldLink) => _.isEqual(link, oldLink))
          );
          req.deletedLinks = oldMedia.links.filter(
              (oldLink) => !media.links.some((link) => _.isEqual(link, oldLink))
          );
          next();
        });
      })
      .catch((err) => {
        return res.status(500).json({message: err.message});
      });
}

function verifyMediaURLS(req, res, next) {
  const media = req.body;
  const verifications = media.links.map((link) => {
    if (link.url) {
      const query = {"link.url.keyword": link.url};
      if (media._id) query._not = {id: media._id};
      return mediaCrud.getRecord(query);
    }
  });
  Promise.all(verifications)
      .then((values) => {
        for (let i = 0; i < values.length; i++) {
          if (values[i]) {
            return res.status(400).json({
              message:
              "MESSAGE_" +
              media.links[i].source.toUpperCase() +
              "_LINK_ALREADY_EXISTS_UNDER_DIFFERENT_MEDIA",
            });
          }
        }
        return next();
      })
      .catch((err) => {
        console.error(err);
        return res.status(500).json({message: err.message});
      });
}

function createMedia(req, res, next) {
  const media = req.body;
  const {name} = media;
  mediaCrud
      .getRecord({name})
      .then((result) => {
        if (result) {
          return res.status(400).json({
            message: "MESSAGE_MEDIA_WITH_THE_SAME_NAME_ALREADY_EXISTS",
          });
        } else {
          return mediaCrud.addRecord(media).then((media) => {
            req.media = media;
            req.createdLinks = media.links;
            req.deletedLinks = [];
            next();
          });
        }
      })
      .catch((err) => {
        return res.status(500).json({message: err.message});
      });
}

function deleteMedia(req, res, next) {
  const {mediaId} = req.params;
  mediaCrud.getRecord({_id: mediaId}).then((media) => {
    if (!media) res.status(400).json({message: "Media does not exists"});
    req.media = media;
    mediaCrud
        .deleteRecord({_id: mediaId})
        .then(() => {
          next();
        })
        .catch((err) => {
          return res.status(500).json(err);
        });
  });
}

function getMedia(req, res) {
  mediaCrud
      .getRecords({})
      .then((records) => {
        return Promise.all(records.map(mediaService.countAttributes));
      })
      .then((records) => {
        res.json(records);
      })
      .catch((err) => {
        console.error(err);
        res.status(500).json({message: err.message});
      });
}

function notifyMediaDelete(req, res) {
  const {media} = req;
  console.log("MEDIA ", media);
  if (media) {
    media.links.map((link) => {
      console.log("DELETING", link);
      eventServices.create("removedWatchedUrl", link);
    });
  }
  res.json({...media, deleted: true});
}

exports.notifyMediaUpdate = notifyMediaUpdate;
exports.createMedia = createMedia;
exports.deleteMedia = deleteMedia;
exports.notifyMediaDelete = notifyMediaDelete;
exports.verifyMediaURLS = verifyMediaURLS;
exports.getMedia = getMedia;
exports.updateMedia = updateMedia;
