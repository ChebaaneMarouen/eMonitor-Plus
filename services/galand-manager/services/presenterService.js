module.exports = function(models) {
  return function getView(model, user) {
    // what user can access about the app
   
    return models[model].getAccessRights.map((ar) => ({
      ...ar,
      access: ar.access(user),
    }));
  };
};
