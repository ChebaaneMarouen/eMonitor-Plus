const {crudService, eventServices} = require("../services");
const rulesCrud = crudService("Rules");
const {updateWebScrapData} = require("../modules/parser");
const {PERMISSSION_KEY} = require("../config");

exports.publishRules = publishRules;
exports.upsertRules = upsertRules;
exports.removeRule = removeRule;

function publishRules(msg) {
  const data = JSON.parse(msg.content);
  rulesCrud
      .getRecords({})
      .then((rules) => {
        eventServices.create("sendUserData", {
          target: data.userId,
          data: {rules},
        });
      })
      .catch((err) => {
        console.error(err);
        eventServices.create("userNotificationError", {
          userMsg: err.message,
          userId: data.userId,
        });
      });
}

function upsertRules(msg) {
  const data = JSON.parse(msg.content);
  rulesCrud
      .addRecord(data)
      .then((rule) => {
        eventServices.create("userDataUpdated", {
          data: {rules: rule},
          target: PERMISSSION_KEY, // TODO: make it clever
        });

        eventServices.create("userNotificationSuccess", {
          userMsg: "Les régles pour " + rule.name + " sont modifiés",
          userId: data.userId,
        });
        setTimeout(
            () =>
              updateWebScrapData().catch((err) => {
                console.error(err);
              }),
            2000 // wait for indexing to finish
        );
      })
      .catch((err) => {
        console.error(err);
        eventServices.create("userNotificationError", {
          userMsg: err.message,
          userId: data.userId,
        });
      });
}

function removeRule(msg) {
  const data = JSON.parse(msg.content);
  rulesCrud
      .deleteRecord(data)
      .then((rule) => {
        eventServices.create("userDataUpdated", {
          data: {rules: {...data, deleted: true}},
          target: PERMISSSION_KEY, // TODO: make it clever
        });
        eventServices.create("userNotificationSuccess", {
          userMsg: "Les régle sont modifiés",
          userId: data.userId,
        });
      })
      .catch((err) => {
        console.error(err);
        eventServices.create("userNotificationError", {
          userMsg: err.message,
        });
      });
}
