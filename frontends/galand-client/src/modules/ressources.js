import { Ressource, alerts } from "@shared/redux";
import { apiEndpoint } from "config";

export const Auth = new Ressource(apiEndpoint + "auth", "auth", {
  actions: {
    login: {
      path: "login",
      method: "post",
      success: ({ user }) => {
        return {
          type: "authLogin",
          isAuthenticated: true,
          authErrorMessage: null,
          switch_home : false,
          ...user
        };
      },
      fail: ({ message }) =>
        alerts.addAlert({
          message,
          type: "danger"
        })
    },
    sendRecoverMail: {
      method: "post",
      path: "recover",
      success: ({ user }) =>
        alerts.addAlert({
          message: "Un email a été envoyer",
          type: "success"
        }),
      fail: ({ message }) =>
        alerts.addAlert({
          message,
          type: "danger"
        })
    },

    recoverPassword: {
      method: "post",
      path: "change",
      success: ({ user }) => ({
        type: "authLogin",
        isAuthenticated: true,
        authErrorMessage: null,
        ...user
      }),
      fail: ({ message }) =>
        alerts.addAlert({
          message,
          type: "danger"
        })
    },
    register: {
      method: "post",
      path: "register",
      success: ({ user }) => ({
        type: "authLogin",
        isAuthenticated: false,
        authErrorMessage: null,
        switch_home : true,
        ...user
      }),
      fail: ({ message }) =>
        alerts.addAlert({
          message,
          type: "danger"
        })
    }
  }
});

export const User = new Ressource(apiEndpoint + "users", "users");
export const Models = new Ressource(apiEndpoint + "models", "models");

export const Classification = new Ressource(
  apiEndpoint + "classification",
  "classifications"
);

export const Sentiment = new Ressource(
  apiEndpoint + "sentiment",
  "sentiment"
);

export const Role = new Ressource(apiEndpoint + "roles", "roles", {
  actions: {
    describe: {
      path: "description",
      method: "get",
      success: description => {
        return {
          type: "description",
          rolesDescription: description
        };
      }
    }
  }
});
export const News = new Ressource(apiEndpoint + "news", "news", {
  actions: {
    describe: {
      path: "description",
      method: "get",
      success: description => {
        return {
          type: "description",
          newsDescription: description
        };
      }
    }
  }
});
export const SimilarNews = new Ressource(
  apiEndpoint + "similar-news",
  "similarNews"
);

export const Indicators = new Ressource(
  apiEndpoint + "stats/indicators",
  "indicators"
);

//all,assigned,added
export const TypedNews = (type, projectId = "", dataType = "news") =>
  new Ressource(apiEndpoint + "news/" + type + "/" + projectId, dataType, {
    actions: {
      count: {
        path: "count",
        method: "post",
        success: count => {
          return {
            type: "count",
            itemsCount: count
          };
        }
      }
    }
  });

export const NewsChanges = id =>
  new Ressource(apiEndpoint + "news/" + id + "/changes", "changes");

export const Notifications = id =>
new Ressource(apiEndpoint + "notifications/" + id , "notifications");

export const Monitors = new Ressource(apiEndpoint + "monitors", "monitors");

export const staticFiles = apiEndpoint + "static";
export const newsFilePath = staticFiles + "/news";
export const infractionsFilePath = staticFiles + "/infractions";
export const coverImagesPath = staticFiles + "/cover";
export const trainingPath = staticFiles + "/trainingFiles";
export const sentimentPath = staticFiles + "/sentimentFiles";

export const Tags = new Ressource(apiEndpoint + "tags", "tags");
export const Medias = new Ressource(apiEndpoint + "media", "medias");
export const Videos = new Ressource(apiEndpoint + "videos", "videos");
export const Projects = new Ressource(apiEndpoint + "projects", "projects");
export const Dictionaries = new Ressource(
  apiEndpoint + "dictionaries",
  "dictionaries"
);
export const CustomDictionaries = new Ressource(
  apiEndpoint + "custom-dictionaries",
  "customDictionaries"
);
export const CustomSearch = new Ressource(
  apiEndpoint + "custom-search",
  "customSearches"
);
export const Feed = new Ressource(apiEndpoint + "feed", "feed", {
  actions: {
    getDisplayConfig: {
      path: "display",
      method: "get",
      success: description => {
        return {
          type: "description",
          feedDisplayDescription: description
        };
      }
    },
    describe: {
      path: "description",
      method: "get",
      success: description => {
        return {
          type: "description",
          feedDescription: description
        };
      }
    }
  }
});
export const FeedForExcel = new Ressource(apiEndpoint + "feed", "feedForExcel", {
  actions: {
    getDisplayConfig: {
      path: "display",
      method: "get",
      success: description => {
        return {
          type: "description",
          feedDisplayDescription: description
        };
      }
    },
    describe: {
      path: "description",
      method: "get",
      success: description => {
        return {
          type: "description",
          feedDescription: description
        };
      }
    }
  }
});
export const Rules = new Ressource(apiEndpoint + "rules", "rules");
export const Optimize = new Ressource(apiEndpoint + "optimize", "optimize");
export const FormRessource = new Ressource(apiEndpoint + "form", "forms");
export const ActorRessource = new Ressource(apiEndpoint + "actor", "actors");
export const CivilSocietyRessource = new Ressource(apiEndpoint + "civil", "civils");
export const PartyRessource = new Ressource(apiEndpoint + "party", "partys");
export const ConstituencyRessource = new Ressource(apiEndpoint + "constituency", "constituencys");