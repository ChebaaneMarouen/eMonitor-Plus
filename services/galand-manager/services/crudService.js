module.exports = function(models) {
  return function(model, modelDefaultOptions) {
    const defaultOptions = {from: 0, size: 2000, ...modelDefaultOptions};

    function createNew(record) {
      return models[model].save(record);
    }
    function getRecord(query) {
      return models[model].getOne(query);
    }
    function addRecord(record) {
      try {
        const newRecord = new models[model](record);
        return newRecord.save();
      } catch (err) {
        return Promise.reject(err);
      }
    }
    function describe() {
      return models[model].describe();
    }
    function getRecords(query, options) {
      return models[model].get(query, {...defaultOptions, ...options});
    }
    function deleteRecord(query) {
      return models[model].remove(query);
    }

    return {
      getRecord,
      addRecord,
      getRecords,
      deleteRecord,
      createNew,
      describe,
    };
  };
};
