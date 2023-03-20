const { News } = require("../models");
exports.getIndicators = (req, res) => {
  const { user } = req;
  if (!user) res.status(401).end();
  Promise.all([
    News.count({
      monitor: user._id,
      status: News.statusEnum.VERIFICATION,
    }),
    News.count({ creator: user._id }),
    News.count({ "after_infraction.status": "1", projectId: "" }),
    News.count({ "infraction.status": "1" }),
    News.count({ "after_infraction.status": "1", regex_projectId: ".+" }),
  ])
    .then((values) => {
      res.json({
        numNewsMonitored: values[0],
        numAddedNews: values[1],
        numInfractions: values[2],
        numInfractionsAValider: values[3],
        numMonitoringInfractions: values[4],
      });
    })
    .catch((err) => {
      console.error(err);
      res.status(500).json({ message: err.message });
    });
};
