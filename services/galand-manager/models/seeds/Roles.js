const Roles = require("../Roles");
const maxPermission = 2;

module.exports = [
  {
    _id: "5d55e3f00000000000000da9",
    name: "Default Admin",
    // assign all permissions to the admin
    permissions: Object.keys(Roles.permissions).reduce(
        (acc, v) => ({...acc, [v]: maxPermission}),
        {}
    ),
  },
];
