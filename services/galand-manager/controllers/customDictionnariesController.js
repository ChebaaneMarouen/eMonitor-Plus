const { eventServices } = require("../services");

exports.upsertCustomDictionary = upsertCustomDictionary;
exports.deleteCustomDictionary = deleteCustomDictionary;

function upsertCustomDictionary(req, res) {
    const userId = req.user._id;
    eventServices.create("customDictionariesAdded", { ...req.body, userId });
    res.json({ done: true });
}

function deleteCustomDictionary(req, res) {
    const { id } = req.params;
    const userId = req.user._id;
    eventServices.create("customDictionariesRemoved", { _id: id, userId });
    res.json({ done: true });
}
