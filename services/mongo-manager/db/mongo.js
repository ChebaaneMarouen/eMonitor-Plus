const monk = require("monk");

const { mongo } = require("../config");
const db = monk(mongo.cnxString());

module.exports = db;

db.on("timeout", () => {
  console.log("Mongo connection lost");
});

db.on("close", () => {
  console.log("Mongo connection closed");
});

db.on("reconnect", () => {
  console.log("Mongo reconnected");
});
