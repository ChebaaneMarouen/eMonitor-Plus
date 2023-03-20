const { crudService } = require("../services");
const UserActionsCrud = crudService("UserActions");

module.exports = {
  addAction: (req, res, next) => {
    try {
      const { user, method, baseUrl } = req;
      let { fName, lName, email, _id } = user;
      console.log(fName, lName, email, _id, method, baseUrl);
      if (method.toLowerCase() != "get") {
        let record = {
          userId: _id,
          fName,
          lName,
          email,
          changeType: method,
          modele: baseUrl.replace("/", "").replace("-", " "),
        };
        UserActionsCrud.addRecord(record);
      }
    } catch (e) {
      console.log("\nUserActions Error : \n", e);
    } finally {
      next();
    }
  },
};
