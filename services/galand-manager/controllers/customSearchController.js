const {crudService} = require("../services/");
const customSearchesCrud = crudService("CustomSearch");

function getCustomSearches(req, res) {
  customSearchesCrud
      .getRecords({})
      .then((records) => {
        res.json(records);
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
      });
}

function updateCustomSearch(req, res) {
  const {id} = req.params;
  customSearchesCrud
      .getRecord({_id: id})
      .then((record) => {
        if (!record) {
          return res.status(404).json({message: "Not found"});
        }
        return customSearchesCrud
            .addRecord({...record, ...req.body})
            .then((record) => {
              res.json(record);
            });
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
      });
}

function createCustomSearch(req, res) {
  const {user} = req;
  const customSearch = {
    ...req.body,
    created: Date.now(),
    creator: user._id,
    creatorName: user.fName + " " + user.lName,
  };
  customSearchesCrud
      .createNew(customSearch)
      .then((record) => {
        res.json(record);
      })
      .catch((err) => {
        res.status(500).json({message: err.message});
      });
}

function removeCustomSearch(req, res) {
  const {id} = req.params;
  customSearchesCrud
      .deleteRecord({_id: id})
      .then(() => {
        res.status(200).json({_id: id, deleted: true});
      })
      .catch((e) => {
        console.log(e);
        res.status(500).json(e);
      });
}
module.exports = {
  createCustomSearch,
  removeCustomSearch,
  getCustomSearches,
  updateCustomSearch,
};
