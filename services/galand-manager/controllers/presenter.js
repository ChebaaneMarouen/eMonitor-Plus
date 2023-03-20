// should hold the info of how to view
const {presenterService} = require('../services');
exports.getGetRights = (req, res) => {
  const {type} = req.params;
  const {user} = req;
  res.json(presenterService(type, user));
};
