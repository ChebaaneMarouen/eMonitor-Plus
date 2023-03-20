exports.isJournalist = ({roles}) => roles == 0;
exports.isMonitor = ({roles}) => roles == 1;
exports.isSuperMonitor = ({roles}) => roles == 2;
exports.isDecider = ({roles}) => roles == 3;
exports.isAdmin = ({roles}) => roles == 4;

exports.hasAtleastJournalistAccess = ({roles}) => roles >= 0;
exports.hasAtleastMonitorAccess = ({roles}) => roles >= 1;
exports.hasAtleastSuperMonitorAccess = ({roles}) => roles >= 2;
exports.hasAtleastDeciderAccess = ({roles}) => roles >= 3;
exports.hasAtleastAdminAccess = ({roles}) => roles >= 4;

exports.setAccess = (accessRights) => ({roles}) => {
  const value = Math.pow(10, roles);
};
