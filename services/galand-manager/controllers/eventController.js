const _ = require("lodash");
const {authServices, crudService, eventServices} = require("../services");
const cookie = require("cookie");
const {eventEmitter} = require("./newsController");
const rolesService = crudService("Roles");
const userCrud = crudService("User");

module.exports = (io) => {

  eventEmitter.on("affected_news", (data)=>io.in(data.userId).emit("notif-user-affected",{
    userId : data.userId,
    title: data.title,
    idNew : data._id,
    message : "NOTIFICATION_AFFECTED",
    type:"info",
    seen : false,
  }));

  eventEmitter.on("video_downloaded", (data)=>io.in(data.userId).emit("notif-user-affected",{
    userId : data.userId,
    title: data.title,
    idNew : data._id,
    message : "VIDEO_DOWNLOADED_SUCCESFULLY",
    type:"info",
    seen : false,
  }));

  function receiveSettings(msg) {
    const data = JSON.parse(msg.content);
    io.in("P_EDIT_SYSTEM_SEETINGS").emit("data-updated", {
      dataType: "settings",
      value: data,
    });
  }

  function receiveUserData(msg) {
    const data = JSON.parse(msg.content);
    Object.keys(data.data).forEach((key) => {
      io.in(data.target).emit("data", {
        dataType: key,
        value: data.data[key],
      });
    });
  }

  function updateAppData(msg) {
    const data = JSON.parse(msg.content);
    Object.keys(data.data).forEach((key) => {
      io.in(data.target).emit("data-updated", {
        dataType: key,
        value: data.data[key],
      });
    });
  }

  function notification(type) {
    return (msg) => {
      const data = JSON.parse(msg.content);
      if (data.userId) {
        io.in(data.userId).emit("notification", {
          type,
          message: data.userMsg,
        });
      }
    };
  }

  function start(client) {
    client.on("user-add-comment",()=>{
      client.broadcast.emit("user-comment-added");
    })
    client.on("user-room", () => {
      const data = client.request.headers.cookie || "";
      const cookies = cookie.parse(data);
      if (cookies.auth) {
        authServices.verify(cookies.auth, async (err, payload) => {
          if (err) return console.error(err);
          if (!payload) return;
          const userId = payload._id;
          client.join("admin");
          client.join(userId);
          // send user connected event
          userCrud
              .getRecord({_id: userId})
              .then(async (user) => {
                if (user) {
                // return token for future authentification
                  const role = await rolesService.getRecord({_id: user.role});
                  const permissions = _.get(role, "permissions", {});

                  eventServices.create("userConnected", {
                    userId,
                    permissions, // "String"
                  });

                  // join rooms accordung to users permissions
                  Object.keys(permissions)
                      .filter((p) => permissions[p])
                      .forEach((p) => client.join(p));
                  eventServices.create("requestSettings", {
                    userId,
                    roles: user.roles,
                  });
                }
              })
              .catch(console.error);
        });
      }else{
        client.emit("user-disconnected-auth")
      }
    });
  }
  return {
    start,
    receiveUserData,
    updateAppData,
    notification,
    receiveSettings,
  };
};
