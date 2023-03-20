const smtp = {
  host: process.env.MAIL_HOST,
  port: Number(process.env.MAIL_PORT) || 587,
  // port: Number(process.env.MAIL_PORT) || 587,
  secure: Boolean(process.env.MAIL_SECURE),
  user: process.env.MAIL_USER,
  pass: process.env.MAIL_PASS,
};
const mailOptionsRecover = {
  subject: "Votre mot de passe Haica",
  from: process.env.MAIL_USER,
  template: "recoverPasswordEmail",
  layout: "recoverPasswordEmail",
};

const mailOptionsBanned = {
  subject: "Votre compte a été banni",
  from: process.env.MAIL_USER,
  template: "banned",
};
const mailOptions = {
  subject: "[INVITATION] Bienvenu sur la plateforme de la HAICA",
  from: process.env.MAIL_USER,
  template: "email",
};
const mailNotifyOption = {
  subject: "[AFFECTATION] Vous avez été affecté à un nouvel article",
  from: process.env.MAIL_USER,
  template: "notify",
};

const external_token = process.env.EXTERNAL_TOKEN;

const kibanaStatUrl = (() => {
  const dashboardId = "ac9d6d80-2a1c-11e9-936b-a597639faec7";
  const kibanaSecret = process.env.KIBANA_SECRET_TOKEN;
  const query =
    "/stats/app/kibana#/dashboard/" +
    dashboardId +
    "?embed=true&_g=()" +
    "&_a=(query:(match:(input.app.id.keyword:(query:'<appid>'))))";
  return {
    kibanaSecret,
    query,
  };
})();
const uploadDestination = "/uploads/";

const blockRegistration = process.env.BLOCK_REGISTRATION === "1";

const SECRET = process.env.AUTH_COOKIE_SECRET || "iue85/*fe+zefzfez";

const changeAddrUrl = process.env.CHANGE_PASSWORD_ADDR;
// TODO make this an env variable
const recoverUrl = changeAddrUrl.replace("register", "reset-password");

const UrlLifeDuration = "24h";
// const UrlLifeDuration = "1m";

const rabbitMQ = (() => {
  const rabbitHost = "rabbitmq";
  const pass = process.env.RABBITMQ_MANAGER_PASS || "guest";
  const user = process.env.RABBITMQ_MANAGER_USER || "guest";

  return {
    rabbitHost: user + ":" + pass + "@" + rabbitHost,
  };
})();

const rabbitQueues = {
  userConnected: {
    exchange: "user.activies.signin",
    queue: "manager",
  },
  receivedUserData: {
    exchange: "user.publicData",
    queue: "manager",
  },
  userNotificationSuccess: {
    exchange: "user.notifications.success",
    queue: "manager",
  },
  userNotificationError: {
    exchange: "user.notifications.error",
    queue: "manager",
  },
  rulesRemoved: {
    exchange: "data.rules.deleted",
    queue: "manager",
  },
  rulesAdded: {
    exchange: "data.rules.created",
    queue: "manager",
  },
  rulesUpdated: {
    exchange: "data.rules.updated",
    queue: "manager",
  },
  userDataUpdated: {
    exchange: "user.data.updated",
    queue: "manager",
  },
  addedWatchedUrl: {
    exchange: "watched.added",
    queue: "manager",
  },
  removedWatchedUrl: {
    exchange: "watched.removed",
    queue: "manager",
  },
  settingChanged: {
    exchange: "settings.change",
    type: "topic",
    queue: "manager",
  },
  settingChangedFacebook: {
    exchange: "settings.changeFacebook",
    queue: "manager",
  },
  settingChangedTwitter: {
    exchange: "settings.changeTwitter",
    queue: "manager",
  },
  settingChangedPupeeteer: {
    exchange: "settings.changePupeeteer",
    queue: "manager",
  }, 
  requestSettings: {
    exchange: "settings.request",
    queue: "manager",
  },
  modelsRemoved: {
    exchange: "data.models.deleted",
    queue: "manager",
  },
  modelsAdded: {
    exchange: "data.models.created",
    queue: "manager",
  },
  modelsUpdated: {
    exchange: "data.models.updated",
    queue: "manager",
  },
  videosRemoved: {
    exchange: "data.videos.deleted",
    queue: "manager",
  },
  videosAdded: {
    exchange: "data.videos.created",
    queue: "manager",
  },
  videosUpdated: {
    exchange: "data.videos.updated",
    queue: "manager",
  },
  publishedSettings: {
    exchange: "settings.broadcast",
    queue: "manager",
  },
  dictionariesRemoved: {
    exchange: "data.dictionaries.deleted",
    queue: "corpus-similarity",
  },
  dictionariesAdded: {
    exchange: "data.dictionaries.created",
    queue: "corpus-similarity",
  },
  dictionariesUpdated: {
    exchange: "data.dictionaries.updated",
    queue: "corpus-similarity",
  },
  customDictionariesRemoved: {
    exchange: "data.customDictionaries.deleted",
    queue: "custom-dictionaries",
  },
  customDictionariesAdded: {
    exchange: "data.customDictionaries.created",
    queue: "custom-dictionaries",
  },
  customDictionariesUpdated: {
    exchange: "data.customDictionaries.updated",
    queue: "custom-dictionaries",
  },
  sentimentStartTraining: {
    exchange: "sentiment.start",
    queue: "galand-nlp-server",
  }
};

const defaultAdminPassword = process.env.DEFAULT_ADMIN_PASSWORD || "123456";
const kibanaSecret = process.env.KIBANA_SECRET_TOKEN;
const trainingFilesPath = "training";
const sentimentFilesPath = "sentiment";
const newsFilesPath = "news";
const predictApi = "http://nlp-scheduler/predict";
const customDictionariesApi = "http://custom-dictionaries/search-occurence";
const hateApi = "http://hate/predict";
const sentimentApi = "http://sentiment/predict";
const detoxifyApi = "http://detoxify/predict";

module.exports = {
  kibanaStatUrl,
  kibanaSecret,
  defaultAdminPassword,
  blockRegistration,
  smtp,
  changeAddrUrl,
  UrlLifeDuration,
  mailOptions,
  SECRET,
  rabbitMQ,
  rabbitQueues,
  uploadDestination,
  mailOptionsRecover,
  mailOptionsBanned,
  mailNotifyOption,
  recoverUrl,
  trainingFilesPath,
  sentimentFilesPath,
  newsFilesPath,
  predictApi,
  customDictionariesApi,
  hateApi,
  sentimentApi,
  external_token,
  detoxifyApi
};
