const _ = require("lodash");
const cheerio = require("cheerio");
const {md5} = require("./helper");
const {Feed, RawData} = require("../models");
const {
  getInstagramSettings,
  getYoutubeSettings,
  getFbSettings,
  getTwitterSettings,
  getTwitterMentionsSettings
} = require("../settings")({
  onChange,
});
const {crudService} = require("../services");
const rulesCrud = crudService("Rules");

exports.parse = parse;
exports.parseSite = parseSite;
exports.updateWebScrapData = updateWebScrapData;

async function updateWebScrapData(rules, from = 0) {
  try {
    const size = 50;
  rules = rules || (await rulesCrud.getRecords({}));
  new RawData("website")
      .get({source: "website"}, {size, from})
      .then(async (data) => {
        try {
          if (data.length) {
          from += size;
          data = data.map((doc) => parseSite(doc, rules));
          data = await Promise.all(data);
          data = data.filter(Boolean);
          data = data.map(Feed.save);
          updateWebScrapData(rules, from);
        }
        } catch (error) {
          console.log("error deep", error)
        }
        
      });
  } catch (error) {
    console.log(error)
  }
  
}

function onChange(source, update, wasUpdated, from = 0) {
  if (!wasUpdated) return;
  const scriptedFields = update.parsingRules;
  const size = 2;
  new RawData(source).get({}, {size, from, scriptedFields}).then((data) => {
    setTimeout(() => {
      if (data.length) {
        data = data.map((doc) => ({
          ...filterRequestedParameters(scriptedFields)(doc),
          ...getDefaultAttributes(source, doc),
        }));
      
          data = data.map(
            (feed)=> new Feed(feed).save().catch(err => console.log("error saving feed", err))
         );
        
        onChange(source, update, wasUpdated, from + size);
      }
    }, 3000);

  }).catch(err => console.log("[DEBUG] onchange function error",err));

}

function filterRequestedParameters(fields) {
  return (rawData) => _.pick(rawData, fields.map((sf) => sf.propName));
}

function parse(source, data) {
  if (source === "facebook") {
    const scriptedFields = getFbSettings("parsingRules");

    return new RawData(source)
        .getOne({_id: data._id}, {scriptedFields})
        .then((data) => ({
              ...filterRequestedParameters(scriptedFields)(data),
              ...getDefaultAttributes(source, data),
            }))
        .catch(err => console.log("[ERROR] facebook parse error",err));
  }
  if (source === "youtube") {
    const scriptedFields = getYoutubeSettings("parsingRules");
    return new RawData(source)
        .getOne({_id: data._id}, {scriptedFields})
        .then((data) => ({
          ...filterRequestedParameters(scriptedFields)(data),
          ...getDefaultAttributes(source, data),
        }))
        .catch(err => console.log("[DEBUG] youtube parse error",err));
  }
  if (source === "instagram") {
    const scriptedFields = getInstagramSettings("parsingRules");
    return new RawData(source)
        .getOne({_id: data._id}, {scriptedFields})
        .then((data) => ({
          ...filterRequestedParameters(scriptedFields)(data),
          ...getDefaultAttributes(source, data),
        }))
        .catch(err => console.log(err));
  }
  if (source === "twitter") {
    const scriptedFields = getTwitterSettings("parsingRules");
    return new RawData(source)
        .getOne({_id: data._id}, {scriptedFields})
        .then((data) => ({
          ...filterRequestedParameters(scriptedFields)(data),
          ...getDefaultAttributes(source, data),
        }))
        .catch(err => console.log(err));
  }
  if (source === "twitter_mentions") {
    const scriptedFields = getTwitterMentionsSettings("parsingRules");
    return new RawData(source)
        .getOne({_id: data._id}, {scriptedFields})
        .then((data) => ({
          ...filterRequestedParameters(scriptedFields)(data),
          ...getDefaultAttributes(source, data),
        }))
        .catch(err => console.log(err));
  }
  if (source === "facebook_mentions") {
    const scriptedFields = [
      {
          "propName": "title",
          "script": "params._source.message"
      },
      {
          "propName": "text",
          "script": "params._source.message"
      },     
      {
          "propName": "created_time",
          "script": "params._source.tagged_time"
      },
      
     ];
    console.log("scripted fields\t", JSON.stringify(scriptedFields,null, 4))
    return new RawData(source)
        .getOne({_id: data._id}, {scriptedFields})
        .then((data) => ({
              ...filterRequestedParameters(scriptedFields)(data),
              ...getDefaultAttributes(source, data),
            }))
        .catch(err => console.log("[ERROR] facebook parse error",err));
  }
  throw new Error("Unsupported Type " + source);
}
function getDefaultAttributes(source, data) {
  const sharedDefaultValues = {
    media: data.media,
    created: data.created,
  };

  if (source === "facebook") {
    return {...sharedDefaultValues, ...getDefaultFBAttributes(data)};
  }
  if (source === "twitter") {
    return {...sharedDefaultValues, ...getDefaultTwitterAttributes(data)};
  }
  if (source === "twitter_mentions") {
    return {...sharedDefaultValues, ...getDefaultTwitterMentionsAttributes(data)};
  }
  if (source === "youtube") {
    return {...sharedDefaultValues, ...getDefaultYoutubeAttributes(data)};
  }
  if (source === "instagram") {
    return {...sharedDefaultValues, ...getDefaultInstagramAttributes(data)};
  }
  if (source === "website") {
    return {...sharedDefaultValues, ...getDefaultWebsiteAttributes(data)};
  }
  if(source ==="facebook_mentions") {
    return {...sharedDefaultValues, ...getDefaultFBAttributes(data), source:"facebook_mentions"};
  }
  return sharedDefaultValues;
}
function getDefaultWebsiteAttributes(data) {
  return {
    url: data.url,
    _id: md5(data.url),
    source: "website",
  };
}
function getDefaultFBAttributes(data) {
  return {
    url: data.url,
    _id: md5("https://facebook.com/" + data.id),
    source: "facebook",
  };
}
function getDefaultInstagramAttributes(data) {
  return {
    url: data.permalink,
    _id: md5(data.permalink),
    source: "instagram",
  };
}
function getDefaultYoutubeAttributes(data) {
  return {
    url: "https://youtube.com/watch?v=" + data.id,
    _id: md5("https://youtube.com/watch?v=" + data.id),
    source: "youtube",
  };
}
function getDefaultTwitterAttributes(data) {
  return {
    url: "https://twitter.com/user/status/" + data.id_str,
    _id: md5("https://twitter.com/user/status/" + data.id_str),
    source: "twitter",
  };
}
function getDefaultTwitterMentionsAttributes(data) {
  return {
    url: "https://twitter.com/user/status/" + data.id_str,
    _id: md5("https://twitter.com/user/status/" + data.id_str),
    source: "twitter_mentions",
  };
}
const timer = ms => new Promise(res => setTimeout(res, ms)).catch(error => console.log(error))

async function parseSite(data, rules) {
  try {
    await timer(3000);
    rules = rules || (await rulesCrud.getRecords({}));
    const body = data["meta"] ? JSON.parse(data["meta"]["request"]["params"]["body"]) : data;
    const _id = data["body"] ? data["body"]["_id"] : body["_id"];
    const rule = rules
      .filter((rule) => {
        const condition = new RegExp(rule.urlCondition);
        console.log(
            rule.urlCondition,
            body.url,
            Boolean(condition.exec(body.url))
        );
        return condition.exec(body.url);
      })
      .sort((ra, rb) => rb.priority - ra.priority)[0];

  // console.log("RUlE", rule);
  if (!rule) return null;

  // remove html field from the result of the parser to reduce size
  const $ = cheerio.load(body.html);

  const scriptedFields = [];
  rule.parsingRules.forEach((pr) => {
    let value = "";
    switch (pr.propAttribute) {
      case null:
      case undefined:
      case "":
      case "text":
        value = $(pr.propPath).text();
        break;
      case "value":
        value = $(pr.propPath).val();
        break;
      default:
        value = $(pr.propPath).attr(pr.propAttribute);
    }

    // set scripted Value
    scriptedFields.push({
      propName: pr.propName,
      script: pr.propScript || "params.value",
      params: {value},
    });
  });

  return new RawData("website")
      .getOne({_id}, {scriptedFields})
      .then((data) => ({
        ...filterRequestedParameters(scriptedFields)(data),
        ...getDefaultAttributes("website", data),
      }));
  } catch (error) {
    console.log("[DEBUG] parseSite Error \t", error)
  }
}
