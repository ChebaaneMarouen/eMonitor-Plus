const {getImageUrl} = require("../modules/getImageOfSite");

module.exports.getCoverImage = (req, res) => {
  const url = req.body;
  getImageUrl(url).then((imageUrl) => {
    res.json({imageUrl});
  });
};
