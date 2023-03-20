const {eventServices} = require('../services');

exports.upsertRule = upsertRule;
exports.deleteRule = deleteRule;

function upsertRule(req, res) {
  const userId = req.user._id;
  const {name, urlCondition, priority} = req.body;
  if(name && urlCondition && priority){
    eventServices.create('rulesAdded', {...req.body, userId});
    res.json({done: true});
  }else{
    res.status(422).json({
      message : "please fill in the required fields"
    })
  }
  
}

function deleteRule(req, res) {
  const {rulesId} = req.params;
  const userId = req.user._id;
  eventServices.create('rulesRemoved', {_id: rulesId, userId});
  res.json({done: true});
}
