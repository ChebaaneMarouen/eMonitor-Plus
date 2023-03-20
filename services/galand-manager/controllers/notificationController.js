const {notificationServices, crudService} = require("../services/");
const notificationCrud = crudService("Notifications", {sort: [{created: "desc"}]});

function getNotifications(req, res, next) {
    const userId = req.params.userId;

    notificationCrud
        .getRecords({userId})
        .then((notifications) => {
          if (!notifications) {
            return res.status(404).json({message: "MESSAGE_USER_NOT_FOUND"});
          }
          res.status(200).json(notifications)
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({message: err.message});
        });
  }

  function getNotification(req, res, next) {
    const _id = req.params.notifId;
    const {idNotif, idNew}= req.body
    if(idNotif){
        notificationCrud
        .getRecord({_id})
        .then((notification) => {
          if (!notification) {
            return res.status(404).json({message: "MESSAGE_NOTIFICATION_NOT_FOUND"});
          }
          req.selectedNotification = notification;
          next();
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({message: err.message});
        });
    }else{
        notificationCrud
        .getRecord({idNew})
        .then((notification) => {
          if (!notification) {
            return res.status(404).json({message: "MESSAGE_NOTIFICATION_NOT_FOUND"});
          }
          req.selectedNotification = notification;
          next();
        })
        .catch((err) => {
          console.error(err);
          res.status(500).json({message: err.message});
        });
    }
    
  }

  function updateNotification(req, res) {
    const {selectedNotification} = req;
    if (!selectedNotification) {
        return res.status(400).json({message: "MESSAGE_NOTIFICATION_NOT_FOUND"});
    }
    notificationServices.updateNotification(selectedNotification).then((newNotification) => {
        res.json(newNotification);
    });
  }

  module.exports = {
    getNotifications,
    getNotification,
    updateNotification
  };