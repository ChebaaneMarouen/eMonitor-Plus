const {crudService} = require("../services");
const crudWatched = crudService("Watched");
const {watch, unWatch} = require("./scheduler");
const {httpLogger} = require("../modules/loggers");

exports.save = save;
exports.remove = remove;

function save(msg) {
  const watched = JSON.parse(msg.content);
  crudWatched
      .createNew({...watched, _id: watched.url})
      .then(watch)
      .catch((err) => {
        console.log(err);
        httpLogger.error(err.message);
      });
}

function remove(msg) {
  const watched = JSON.parse(msg.content);
  crudWatched
      .deleteRecord({url: watched.url})
      .then(() => {
        unWatch(watched);
      })
      .catch((err) => {
        console.log(err);
        httpLogger.error(err.message);
      });
}
