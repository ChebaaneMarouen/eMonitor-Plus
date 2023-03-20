const { Client } = require("@elastic/elasticsearch");
const { elasticsearchUrl } = require("../config");
const client = new Client({ node: elasticsearchUrl });

exports.client = client;
