module.exports = function({Tag}) {
  function updateTagsCount(oldTags, newTags) {
    return Promise.all([incTags(newTags), decTags(oldTags)]);
  }
  function decTags(tagsIds) {
    Tag.update(
        {_id: tagsIds},
        {
          $inc: {count: -1},
        }
    );
  }
  function incTags(tagsIds) {
    Tag.update(
        {_id: tagsIds},
        {
          $inc: {count: 1},
        }
    );
  }
  return {
    incTags,
    decTags,
    updateTagsCount,
  };
};
