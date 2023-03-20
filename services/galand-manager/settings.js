const Settings = require("@localPackages/settings");
const data = require("./data");

function EndWithSlash(inStr) {
  if (!inStr) return String();
  const str = String(inStr);
  if (str[str.length - 1] !== "/") return str + "/";
  return str;
}
function NoSpaceString(str) {
  if (!str) return String();
  return String(str).replace(/ /g, "");
}

const crawlers = ["Facebook", "Youtube", "Twitter", "Website", "Instagram", "External", "Twitter_Mentions"];
const displayOptions = [
  "header",
  "tag",
  "left tag",
  "right tag",
  "image",
  "video",
  "iframe",
  "header body",
  "body",
  "body no label",
  "body html",
  "body html no label",
  "action: Similarity-Search",
  "action: Video-Processing",
  "action: Word-Cloud",
  "action: Text-Analyser",
  "Array",
  "Array_of_reaction",
  "count love",
  "count like",
  "count haha",
  "count angry",
  "count sad",
  "count care",
  "count wow",
  "count share",
  "count reactions",
  "count comments"
].map((v) => ({ label: v, value: v }));

const displaySettingsSchema = {
  displayRules: [
    {
      propName: {
        type: String,
        description: "Name for the target prop",
        label: "Property",
        default: "prop",
      },
      propLabel: {
        type: String,
        description: "Label used on display",
        label: "Label",
        default: "",
      },
      displayType: {
        type: String,
        description: "Select one of the configured display options",
        inputType: "select",
        label: "Display Option",
        options: displayOptions,
        default: "null",
      },
    },
  ],
};

const similaritySettingsSchema = {
  max_query_terms: {
    type: Number,
    description:
      "The maximum number of query terms that will be selected. Increasing this value gives greater accuracy at the expense of query execution speed.",
    label: "Max Query Terms",
    default: 30,
  },
  min_term_freq: {
    type: Number,
    description:
      "The minimum term frequency below which the terms will be ignored from the input document.",
    label: "Min Term Frequency",
    default: 2,
  },
  min_doc_freq: {
    type: Number,
    description:
      "The minimum document frequency below which the terms will be ignored from the input document.",
    label: "Min Document Frequency",
    default: 3,
  },
  max_doc_freq: {
    type: Number,
    description:
      "The maximum document frequency above which the terms will be ignored from the input document.",
    label: "Max Document Frequecy",
    default: 100000,
  },
  min_word_length: {
    type: Number,
    description: "The minimum word length below which the terms will be ignored.",
    label: "Min Word Length",
    default: 0,
  },
};
const settingsSchema = {
  allowedMimetypesCoverImage: {
    type: NoSpaceString,
    description:
      "Liste des mimeTypes autorisés pour " +
      "l'upload séparés par des virgules pour les images couvertures des news",
    label: "Liste des MimeTypes pour les couverture de news",
    default: "image/gif,image/jpeg,image/png",
  },
  allowedMimetypes: {
    type: NoSpaceString,
    description: "Liste des mimeTypes autorisés pour l'upload séparés par des virgules",
    label: "Liste des MimeTypes pour l'upload",
    default: "image/gif,application/msword,image/jpeg,image/png,application/pdf",
  },
  tagsEndPoint: {
    type: EndWithSlash,
    description: "Endpoint of tags webhook",
    label: "Tags Endpoint",
    default: "http://tunisiachecknews.com/webhooks/tags",
  },
  newsEndPoint: {
    type: EndWithSlash,
    description: "Endpoint of news webhook",
    label: "News Endpoint",
    default: "http://tunisiachecknews.com/webhooks/news",
  },
};
const stopWordsSchema = {
  ar: {
    type: NoSpaceString,
    description: "Liste des Mots vides (Stop Words) AR séparés par des virgules",
    label: "Liste des Mots vides (Stop Words) AR",
    default: data.defaultStopWordsAR,
  },
  fr: {
    type: NoSpaceString,
    description: "Liste des Mots vides (Stop Words) FR séparés par des virgules",
    label: "Liste des Mots vides (Stop Words) FR",
    default: data.defaultStopWordsFR,
  },
  en: {
    type: EndWithSlash,
    description: "Liste des Mots vides (Stop Words) EN séparés par des virgules",
    label: "Liste des Mots vides (Stop Words) EN",
    default: data.defaultStopWordsEN,
  },
};
const InfractionsTypesSchema = {
  InfractionType: [
    {
      name: {
        type: String,
        description: "Name of the infraction",
        label: "Type Name",
        default: "prop",
      },
    },
  ],
};
const DataSourcesTypesSchema = {
  DataSourceType: [
    {
      name: {
        type: String,
        description: "Name of the source type",
        label: "Type Name",
        default: "prop",
      },
    },
  ],
};
module.exports = (() => {
  const settings = new Settings(settingsSchema, "Manager");
  const stopWords = new Settings(stopWordsSchema, "Stop Words");
  const InfractionsTypes = new Settings(InfractionsTypesSchema, "Infractions Types");
  const DataSourcesTypes = new Settings(DataSourcesTypesSchema, "Data Sources Types");
  const similaritySettings = new Settings(similaritySettingsSchema, "Similarity Parameters");
  const displaySettings = {};
  crawlers.forEach((crawler) => {
    displaySettings[crawler] = new Settings(displaySettingsSchema, crawler + " Display");
  });

  function getSettings(attr) {
    return settings.get(attr);
  }

  function getSimilaritySettings(attr) {
    return similaritySettings.get(attr);
  }

  function getDisplaySettings() {
    return Object.keys(displaySettings).reduce(
      (acc, key) => ({
        ...acc,
        [key.toLowerCase()]: displaySettings[key].get("displayRules"),
      }),
      {}
    );
  }

  return {
    getSettings,
    getDisplaySettings,
    getSimilaritySettings,
  };
})();
