module.exports = function(models) {
  return function(model) {
    function createNew(record) {
      return models[model].save(record);
    }

    function getRecord(query) {
      return models[model].getOne(query);
    }

    function addRecord(record) {
      const newRecord = new models[model](record);
      return newRecord.save();
    }

    function getRecords(query) {
      return models[model].get(query);
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
    };
  };
};
