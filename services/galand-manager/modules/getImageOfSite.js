const cheerio = require('cheerio');
const request = require('request');

exports.getImageUrl = function getImageUrl(url) {
  return new Promise((resolve, reject) => {
    request(url, (err, res, body) => {
      if (body) {
        const $ = cheerio.load(body);
        const imageUrl = $('meta[property="og:image"]').attr('content');
        return resolve(imageUrl);
      }
      resolve('');
    });
  });
};
