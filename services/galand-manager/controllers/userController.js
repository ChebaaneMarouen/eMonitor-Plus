const express = require("express");
const router = express.Router();
const { changeAddrUrl } = require("../config");

const { userService, crudService, mailService } = require("../services/");
const userCrud = crudService("User", { sort: [{ created: "desc" }] });

function getUser(req, res, next) {
  const _id = req.params.userId;
  userCrud
    .getRecord({ _id })
    .then((user) => {
      if (!user) {
        return res.status(404).json({ message: "MESSAGE_USER_NOT_FOUND" });
      }
      req.user = user;
      next();
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
}

function getUsers(req, res) {
  userCrud.getRecords({}).then((users) => {
    res.json(users);
  });
}

function updateUser(req, res) {
  const { user } = req;
  console.log(user);
  if (!user) return res.status(400).json({ message: "MESSAGE_USER_NOT_FOUND" });
  userService.updateUser(user, req.body).then((newUser) => {
    if (user.status !== newUser.status && newUser.status === -1) {
      mailService.sendBanMail(newUser.email);
    }
    res.json(newUser);
  });
}

function createUser(req, res) {
  const invitedBy = req.user._id;
  console.log("added user", req.body)
  const {fName, lName, email, phone}= req.body;
  const regName = /[a-zA-Z]{4,}$/;
  const regEmail = /^(([^<>()[\]\\.,;:\s@\"]+(\.[^<>()[\]\\.,;:\s@\"]+)*)|(\".+\"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
  const regPhone = /^[+]*[(]{0,1}[0-9]{1,4}[)]{0,1}[-\s\./0-9]*$/;
  if (!regName.test(fName))
  return res.status(400).json({ message: "MESSAGE_INVALID_FIRSTNAME" });

  if (!regName.test(lName))
  return res.status(400).json({ message: "MESSAGE_INVALID_LASTNAME" });

  if (!regEmail.test(email))
  return res.status(400).json({ message: "MESSAGE_INVALID_EMAIL" });

  if(!regPhone.test(phone))
  return res.status(400).json({ message: "MESSAGE_INVALID_PHONE_NUMBER" });

  return userService
    .createNewUser({ ...req.body, invitedBy })
    .then((user) => {
      return mailService
        .sendMail(user.email, {
          url: changeAddrUrl + user._id,
        })
        .then(() => user);
    })
    .then((user) => {
      res.json(user);
    })
    .catch((err) => {
      console.log(err);
      res.status(400).json({ message: err.message });
    });
}

function deleteUser(req, res) {
  const { userId } = req.params;
  userService
    .deleteUser({ _id: userId })
    .then(() => {
      res.status(200).json({ _id: userId, deleted: true });
    })
    .catch((e) => {
      console.log(e);
      res.sendStatus(500);
    });
}

module.exports = {
  getUsers,
  getUser,
  updateUser,
  deleteUser,
  createUser,
};
