const _ = require("lodash");
const {
  crudService,
  userService,
  mailService,
  authServices,
} = require("../services");
const rolesService = crudService("Roles");

const {changeAddrUrl, recoverUrl, kibanaSecret} = require("../config");

module.exports.reset = (req, res) => {
  const {email, name} = req.body;
  userService
      .getUser({$or: [{email}, {name}]})
      .then((user) => {

        if (user) {
          authServices.sign(
              {
                _id: user._id,
              },
              (err, payload) => {
                if (!err) {
                  const url = changeAddrUrl + payload;
                  mailService
                      .sendMail(user.email, {url, username: user.name})
                      .catch(console.log);
                  return res.json({
                    success: true,
                  });
                }
                res.status(500).json({
                  success: false,
                });
              }
          );
        }
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
        console.log(err);
      });
};

module.exports.changePassword = (req, res) => {
  const {password, token} = req.body;
  authServices.verify(token, function(err, decoded) {
    if (!decoded || !decoded._id) return res.sendStatus(401);
    userService
        .getUser({_id: decoded._id})
        .then((user) => {
          user.password = password;
          user.save((err) => {
            if (err) {
              console.log(err);
              return res.status(500).json({message: err.message});
            }
            res.json({success: true});
          });
        })
        .catch((err) => {
          res.status(500).json({message: err.message});
          console.log(err);
        });
  });
};

module.exports.login = (req, res) => {
  const email = req.body.email;
  const pwd = req.body.password;
  if (!email || !pwd) {
    return res
        .status(401)
        .json({success: false, message: "MESSAGE_SOME_FIELDS_ARE_MISSING"});
  } else {
    userService
        .getUser({email})
        .then(async (user) => {
          if (!user) {
            return res.status(401).json({
              success: false,
              message: "MESSAGE_EMAIL_DOES_NOT_EXISTS",
            });
          }
          if (!(await user.comparePassword(pwd))) {
            return res.status(401).json({
              success: false,
              message: "MESSAGE_PASSWORD_IS_NOT_CORRECT",
            });
          }
          // return token for future authentification
          const role = await rolesService.getRecord({_id: user.role});
          if (!role) {
            return res.status(401).json({
              success: false,
              message: "MESSAGE_THIS_ACCOUNT_IS_NOT_ASSIGNED_A_ROLE",
            });
          }
          const permissions = role.permissions;
          authServices.sign(
              {
                _id: user._id,
              },
              (err, payload) => {
                if (!err) {
                  
                  const lastLogin = Date.now();
                  userService.updateUser(user, {lastLogin});
                  user.lastLogin = lastLogin ;

                  res.cookie("auth", payload, {
                    httpOnly: true,
                    maxAge: 30 * 24 * 3600000,
                  });
                  res.cookie("statsAuth", kibanaSecret, {
                    maxAge: 1000 * 60 * 60 * 24, // 24 hours
                    httpOnly: true,
                  });

                  return res.json({
                    success: true,
                    user: {
                      ..._.omit(user, [
                        "password",
                        "_collectionAttributes"
                      ]),
                      permissions,
                    },
                  });
                }
                res.status(401).json({
                  success: false,
                });
              }
          );
        })
        .catch((err) => {
          if (err) console.log(err);
          res.status(500).json({
            success: false,
          });
        });
  }
};

module.exports.logout = (req, res) => {
  res.clearCookie("auth");
  res.clearCookie("statsAuth");
  res.end();
};

module.exports.changePassword = async (req, res) => {
  const {password, _id} = req.body;
  const user = await userService.getUser({_id});
  if (!user) {
    return res.status(400).json({message: "MESSAGE_EMAIL_DOES_NOT_EXISTS"});
  }
  if (user.status === 0) {
    return res
        .status(400)
        .json({message: "MESSAGE_ACCOUNT_IS_NOT_ACCTIVATED"});
  }
  if (user.status === -1) {
    return res.status(400).json({message: "MESSAGE_CE_COMPTE_EST_BANNI"});
  }
  user.password = password;

  userService
      .addUser(user)
      .then((user) => {
        authServices.sign(
            {
              _id: user._id,
            },
            (err, payload) => {
              if (err) console.error(err);
              if (!err) {
                res.cookie("auth", payload, {
                  httpOnly: true,
                });
                res.cookie("statsAuth", kibanaSecret, {
                  maxAge: 1000 * 60 * 60 * 24, // 24 hours
                  httpOnly: true,
                });
              }
              res.json({
                success: true,
                user,
                message: "MESSAGE_PASSWORD_WAS_CHANGED",
              });
            }
        );
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
      });
};
module.exports.recover = async (req, res) => {
  const {email} = req.body;
  const user = await userService.getUser({email});
  if (!user) {
    return res.status(400).json({message: "MESSAGE_EMAIL_DOES_NOT_EXISTS"});
  }
  if (user.status === 0) {
    return res
        .status(400)
        .json({message: "MESSAGE_ACCOUNT_IS_NOT_ACCTIVATED"});
  }
  if (user.status === -1) {
    return res.status(400).json({message: "MESSAGE_CE_COMPTE_EST_BANNI"});
  }
  mailService
      .sendRecoveryMail(user.email, {
        url: recoverUrl + user._id,
      })
      .then(() => {
        res.json({message: "MESSAGE_AN_EMAIL_WAS_SENT"});
      })
      .catch((err) => {
        console.log(err);
        res.status(500).json({message: err.message});
      });
};

module.exports.register = async (req, res) => {
  const userDetails = _.omit(req.body, ["roles", "email"]);
  const regName = /[a-zA-Z]{4,}$/;
  const regPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  const user = await userService.getUser({_id: userDetails._id});
  if (!regName.test(req.body.fName)) {
    return res
        .status(400)
        .json({message: "MESSAGE_INVALID_FIRSTNAME"});
  }
  if (!regName.test(req.body.lName)) {
    return res.status(400).json({message: "MESSAGE_INVALID_LASTNAME"});
  }

  if(!regPhone.test(req.body.phone))
  return res.status(400).json({ message: "MESSAGE_INVALID_PHONE_NUMBER" });
  
  if (!req.body.password || req.body.password.length <= 4) {
    return res.status(400).json({
      message: "MESSAGE_LE_MOT_DE_PASS_DOIT_ÊTRE_PLUS_QUE_4_CARACTÈRES",
    });
  }
  if (!user) {
    return res.status(400).json({message: "MESSAGE_CE_COMPTE_N'EXISTE_PAST"});
  }
  if (user.status == -1) {
    return res.status(400).json({message: "MESSAGE_CE_COMPTE_EST_BANNI"});
  }
  if (user.status !== 0) {
    return res
        .status(400)
        .json({message: "MESSAGE_THIS_ACCOUNT_IS_ALREADY_ACTIVATED"});
  }
  const registredUser = await userService.addUser({
    ...user,
    ...userDetails,
    status: 1,
  });
  // return token for future authentification
  authServices.sign(
      {
        _id: registredUser._id,
      },
      (err, payload) => {
        if (err) console.error(err);
        if (!err) {
          res.cookie("auth", payload, {
            httpOnly: true,
          });
          res.cookie("statsAuth", kibanaSecret, {
            maxAge: 1000 * 60 * 60 * 24, // 24 hours
            httpOnly: true,
          });
        }
        res.json({
          success: true,
          user: registredUser,
          message: "Le compte est activé",
        });
      }
  );
};
