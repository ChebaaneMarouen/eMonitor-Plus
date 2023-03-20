const validator = require("validator");
const { Model, Schema } = require("@localPackages/model");

module.exports = (function () {
  const MediaSchema = new Schema({
    name: { type: String, required: true },
    links: [{ source: String, url: String, schedule: String }],
    type: String,
  });

  MediaSchema.validations = [
    function webLinksShouldBeLinks(media) {
      console.log("media", JSON.stringify(media, null, 4))
      if (media.links && media.links.some(({ url, search_crowdTangle }) => !search_crowdTangle && !validator.isURL(url))) {
        throw new Error("MESSAGE_WEB_URL_IS_NOT_A_VALID_URL");
      }
    },
  ].concat(
    ["facebook", "youtube", "twitter", "instagram"].map((type) => (media) => {
      media.links.forEach((link) => {
        if (link.source === type) {
          if (!link.search_crowdTangle && (!validator.isURL(link.url) ||
          // not the correct website
          !validator.matches(link.url, ".*" + type + ".*", "i"))
            
          ) {
            throw new Error(
              "MESSAGE_" + type.toUpperCase() + "_URL_IS_NOT_A_VALID_URL"
            );
          }
        }
      });
    })
  );
  const MediaModel = new Model("media", MediaSchema, "elasticsearch");

  MediaModel.returnUrlFields = () => [
    "facebook",
    "twitter",
    "website",
    "youtube",
    "instagram",
  ];

  return MediaModel;
})();
