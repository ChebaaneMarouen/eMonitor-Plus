const jwt = require('jsonwebtoken');
const {SECRET, UrlLifeDuration} = require('../config');

exports.sign = sign;
exports.verify = verify;

function sign(data, cb) {
  return jwt.sign(
      data,
      SECRET,
      {
        algorithm: 'HS256',
        expiresIn: UrlLifeDuration,
      },
      cb
  );
}
function verify(token, cb) {
  return jwt.verify(token, SECRET, cb);
}
