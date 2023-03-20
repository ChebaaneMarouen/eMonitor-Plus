const models = require("require-all")({
  dirname: __dirname,
  filter: /^(?!index\.js)(.+)\.js$/,
});

const seeds = require("require-all")({
  dirname: __dirname + "/seeds",
  filter: /^(?!index\.js)(.+)\.js$/,
});

setTimeout(() => {
  // start seeding after the data base is ready
  for (const collection of Object.keys(seeds)) {
    if (!models[collection]) {
      console.log("[WARN] Model Not Found for " + collection);
    } else {
      Promise.all(seeds[collection].map(models[collection].save))
          .then(() => {
            console.log("[INFO] " + collection + " was seeded!");
          })
          .catch((err) => {
            console.error("[ERROR] Seeding", +collection);
            console.error(JSON.stringify(err, null, 2));
          });
    }
  }
}, 5000);

module.exports = models;
