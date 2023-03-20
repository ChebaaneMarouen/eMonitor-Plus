const { isArray } = require("lodash");

module.exports = {
  allow: (permissionType, accessLevel, reqFrom) => (req, res, next) => {
    const reqSource = req.headers.referer;
    if (reqFrom) {
      for (let i = 0; i < permissionType.length; i++) {
        if (
          reqSource.includes(reqFrom[i]) &&
          req.permissions &&
          req.permissions[permissionType[i]] >= accessLevel
        ) {
          return next();
        } else if (i + 1 == permissionType.length) {
          return res.status(401).json({ message: "Unauthorized" });
        }
      }
    } else {
      if (isArray(permissionType)) {
        for (let i = 0; i < permissionType.length; i++) {
          if (req.permissions && req.permissions[permissionType[i]] >= accessLevel) return next();
        }
        return res.status(401).json({ message: "Unauthorized" });
      } else
        req.permissions && req.permissions[permissionType] >= accessLevel
          ? next()
          : res.status(401).json({ message: "Unauthorized" });
    }
  },
};
