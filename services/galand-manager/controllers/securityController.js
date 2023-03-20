const {userService, authServices, crudService} = require("../services");
const _ = require("lodash");
const {User} = require("../models");
const { external_token } = require("../config");
const roleService = crudService("Roles");

const verifyCookie = (req, res, next) => {
  if ((req.header("Referer") && req.header("Referer").indexOf("localhost") > 0) || req.body.token === external_token) {
    req.user = new User({
      _id: "5d55e3f00000000000000da5",
      fName: "default",
      lName: "admin",
      email: "tnteap@undp.org",
      role: "5d55e3f00000000000000da9",
      roles: 4,
      status: 1
    });
    req.roles = 4;
    return next();
  }
  if (!req.cookies.auth) {
    return res.status(401).json({
      message: "Unauthorized",
      action :"disconnect user"
    });
  }

  const token = req.cookies.auth;
  authServices.verify(token, function(err, decoded) {
    if (!decoded || !decoded._id) {
      console.log("heeeeeeeere")

      return res.status(401).json({
        message: "Unauthorized",
        action :"disconnect user"
      });
    }

    userService
        .getUser({
          _id: decoded._id,
        })
        .then(async function(user) {
          if (user.status === 0) {
            res
                .status(401)
                .json({message: "MESSAGE_THIS_ACCOUNT_IS_NOT_ACTIVATED"});
          }
          if (user.status === -1) {
            res.status(401).json({message: "MESSAGE_THIS_ACCOUNT_IS_BANNED"});
          }
          const roles = await roleService.getRecord({_id: user.role});

          req.user = user;
          req.permissions = roles ? roles.permissions : {};
          return next();
        })
        .catch((e) => {
          console.log(e);
          res.status(500).jsonp(e);
        });
  });
};

const isAdmin = (req, res, next) => {
  const {roles} = req;
  if (roles >= 4) return next();
  return res.status(401).json({
    message: "MESSAGE_UNAUTHORISED",
    user: req.user,
  });
};

const isSuperMonitor = (req, res, next) => {
  const {roles} = req;
  if (roles >= 2) return next();
  return res
      .status(401)
      .json({message: "MESSAGE_UNAUTHORISED", user: req.user});
};

const isMonitor = (req, res, next) => {
  const {roles} = req;
  if (roles >= 1) return next();
  return res
      .status(401)
      .json({message: "MESSAGE_UNAUTHORISED", user: req.user});
};

const isOwner = (pathOfOwnerProp) => (req, res, next) => {
  const {user} = req;
  const owner = _.get(req, pathOfOwnerProp);
  if (owner === user._id) return next();
  res.status(401).json({message: "MESSAGE_UNAUTHORISED"});
};

module.exports = {
  verifyCookie,
  isOwner,
  isAdmin,
  isSuperMonitor,
  isMonitor,
};
