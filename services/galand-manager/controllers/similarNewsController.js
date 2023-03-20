const _ = require("lodash");
const {News} = require("../models");
const {getSimilaritySettings} = require("../settings");

module.exports.search = (req, res) => {
  const {title, text, link} = req.body;
  const similarArticlesRequests = [];
  if (link) similarArticlesRequests.push(News.get({link}));
  if (title) {
    similarArticlesRequests.push(
        News.get({
          moreLike_: {
            fields: ["title", "text"],
            like: title,
            min_word_length: getSimilaritySettings("min_word_length"),
            min_term_freq: getSimilaritySettings("min_term_freq"),
            max_query_terms: getSimilaritySettings("max_query_terms"),
            max_doc_freq: getSimilaritySettings("max_doc_freq"),
            min_doc_freq: getSimilaritySettings("min_doc_freq"),
            min_word_length: getSimilaritySettings("min_word_length"),
          },
        })
    );
  }
  if (text) {
    similarArticlesRequests.push(
        News.get({
          moreLike_: {
            fields: ["title", "text"],
            like: text,
            min_word_length: getSimilaritySettings("min_word_length"),
            min_term_freq: getSimilaritySettings("min_term_freq"),
            max_query_terms: getSimilaritySettings("max_query_terms"),
            max_doc_freq: getSimilaritySettings("max_doc_freq"),
            min_doc_freq: getSimilaritySettings("min_doc_freq"),
            min_word_length: getSimilaritySettings("min_word_length"),
          },
        })
    );
  }
  Promise.all(similarArticlesRequests)
      .then((values) => {
        res.json(
            _.concat(...values)
                .filter((v) => v._score >= 0.2)
                .sort((a, b) => b._score - a._score)
        );
      })
      .catch((err) => {
        console.log(err);
        res.json({message: err.message});
      });
};
