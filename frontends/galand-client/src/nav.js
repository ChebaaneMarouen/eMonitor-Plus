import React from "react";
import { Sidebar } from "adminlte-2-react";

const { Item, UserPanel } = Sidebar;
export default function getNav(permissions) {
  return function (page) {
    // TODO take care of roles
    switch (page) {
      case "dashboard":
        return true;
      case "news":
        return permissions["P_FAKENEWS"];
      case "assignedNews":
        return permissions["P_GET_ASSIGNED"];
      case "media":
        return permissions["P_MEDIA"];
      case "videos":
        return permissions["P_VIDEO"];
      case "scrapping":
        return permissions["P_ACCESS_SCRAPPING"];
      case "addDictionary":
        return permissions["P_DICTIONNARY"];
      case "projects":
        return permissions["P_PROJECT"];
      case "tags":
        return permissions["P_TAGS"];
      case "fakenewsInfractions":
        return permissions["P_FAKENEWS_INFRACTIONS"];
      case "monitoringInfractions":
        return permissions["P_MONITORING_INFRACTIONS"];
      case "rules":
        return permissions["P_RULES"];
      case "roles":
        return permissions["P_ROLES"];
      case "users":
        return permissions["P_USERS"];
      case "settings":
        return permissions["P_EDIT_SYSTEM_SEETINGS"];
      case "customSearch":
        return permissions["P_CUSTOM_SEARCH"];
      case "stats":
        return permissions["P_ACCESS_STATISTICS"];
      case "models":
        return permissions["P_MACHINE_LEARNING_MODELS"];
      case "classifications":
        return permissions["P_CLASSIFICATION"];
      case "forms":
        return permissions["P_FORM"];

      default:
        return true;
    }
  };
}
export function getSideBar(navFilter, t, projects, userId, fName, lName) {
  return [
    <UserPanel username={fName + " " + lName} 
    key="user-pannel"
              imageUrl={"https://icon-library.com/images/default-user-icon/default-user-icon-4.jpg"}
              status={t("LABEL_CONNECTED")}
              statusType={"success"}/>,
    navFilter("dashboard") && (
      <Item key="dashboard" text={t("NAV_DASHBOARD")} icon="fa-tachometer-alt" to="/dashboard" />
    ),
    navFilter("assignedNews") >= 1 && (
      <Item
        key="view-list-assigned"
        text={t("NAV_FAKENEWS_ASSIGNÉ")}
        icon="fa-tasks"
        to="/news/assigned"
      />
    ),
    <Item key="view-list-added" text={t("NAV_FAKENEWS_AJOUTÉ")} icon="fa-list" to="/news/added" />,
    <Item key="view-list-fakenews" text={t("NAV_FAKE_NEWS")} icon="fa-list" to="/news/fakenews" />,

    <li className="header" key="fakeNews">
      {t("NAV_FAKENEWS")}
    </li>,

    navFilter("news") >= 2 && (
      <Item key="add-news" text={t("NAV_AJOUTER_UNE_FAKENEWS")} icon="fa-plus-square" to="/AddNews" />
    ),
    navFilter("news") >= 1 && (
      <Item key="view-list" text={t("NAV_LISTE_DES_FAKENEWS")} icon="fa-newspaper" to="/news" />
    ),
    navFilter("fakenewsInfractions") >= 1 && (
      <Item key="infractions-list" text={t("NAV_INFRACTIONS")} icon="fa-times-circle" to="/infractions" />
    ),
    navFilter("news") >= 1 && (
      <Item
        key="scrapping-fn"
        text={t("NAV_LISTE_DES_ARTICLES")}
        icon="fa-th-list"
        to="/scraping-fakenews"
      />
    ),
    /*<li className="header">{t("NAV_SOCIAL_MEDIA_MONITORING")}</li>,
    navFilter("projects") && (
      <Item key="projects" text={t("NAV_PROJECTS")} icon="fa-project-diagram">
        <Item key="manage-projects" text={t("NAV_GESTION_DES_PROJECTS")} icon="fa-pen" to="/projects" />
        {projects
        .filter(pro=>pro.assignees.find(assig=> assig === userId) !== undefined)
        .map((pr) => (
          <Item
            key={pr._id}
            text={`${pr.title} ${pr.endProject < Date.now() ? "*" : ""}`}
            icon={pr.endProject < Date.now() ? "fa-exclamation-triangle" : "fa-tasks"}
            to={"/projects/" + pr._id}
          />
        ))}
      </Item>
    ),
    navFilter("forms") && <Item key="forms" text={t("NAV_FORMS")} icon="fa-align-left" to="/forms" />,
    navFilter("monitoringInfractions") >= 1 && (
      <Item
        key="monitoring-infractions"
        text={t("NAV_INFRACTIONS")}
        icon="fa-times-circle"
        to="/monitoring-infractions"
      />
    ),
    navFilter("scrapping") && (
      <Item
        key="ViewScrappingList"
        text={t("NAV_LISTE_DES_ARTICLES")}
        icon="fa-th-list"
        to="/view-scrapping-list"
      />
    ),*/
    <li className="header" key="NAV_AUTOMATIC_ANALYSIS">{t("NAV_AUTOMATIC_ANALYSIS")}</li>,
    navFilter("videos") && (
      <Item
        key="manage-videos"
        text={t("NAV_GESTION_DES_VIDEOS")}
        icon="fab-youtube"
        to="/videos-preprocessing"
      />
    ),

    (navFilter("models") || navFilter("classifications")) && (
      <Item key="classification" text={t("NAV_CLASSIFICATIONS")} icon="fa-poll-h">
        {navFilter("classifications") >= 1 && (
          <Item
            key="classifications"
            text={t("NAV_CLASSIFICATIONS")}
            icon="fa-server"
            to="/classifications"
          />
        )}

        {navFilter("models") && (
          <Item key="Models" text={t("NAV_MODELS")} icon="fa-laptop-code" to="/models" />
        )}
      </Item>
    ),
    (navFilter("sentimentModels") || navFilter("sentiment")) && (
      <Item key="sentiment-all" text={t("NAV_SENTIMENTS")} icon="fa-poll">
        {navFilter("sentiment") >= 1 && (
          <Item
            key="sentiment"
            text={t("NAV_SENTIMENTS")}
            icon="fa-server"
            to="/sentiment-manager"
          />
        )}

        {navFilter("sentimentModels") && (
          <Item key="sentimentModels" text={t("NAV_MODELS")} icon="fa-laptop-code" to="/sentiment-models" />
        )}
      </Item>
    ) 
    ,
    navFilter("addDictionary") >= 1 && (
      <Item key="AddDict" text={t("NAV_DICTIONNAIRE")} icon="fa-book" to="/add-dictionary" />
    ),
    navFilter("addDictionary") >= 1 && (
      <Item
        key="AddCustDict"
        text={t("NAV_CUST_DICTIONNAIRE")}
        icon="fa-atlas"
        to="/add-custom-dictionary"
      />
    ),

    <li className="header" key={"NAV_CONFIGURATIONS"}> {t("NAV_CONFIGURATIONS")}</li>,
    navFilter("media") && (
      <Item
        key="manage-medias"
        text={t("NAV_GESTION_DES_MÉDIAS")}
        icon="fab-searchengin"
        to="/manage-medias"
      />
    ),

    navFilter("rules") >= 1 && (
      <Item key="rules" text={t("NAV_RULES")} icon="fa-file-word" to="/scrapping-config" />
    ),
    navFilter("customSearch") >= 1 && (
      <Item key="customSearches" text={t("NAV_CUSTOM_SEARCH")} icon="fa-save" to="/custom-search" />
    ),
    navFilter("tags") && (
      <Item key="sujets" text={t("NAV_GESTION_DES_SUJETS")} icon="fa-spell-check" to="/sujets" />
    ),
    navFilter("tags") && (
      <Item key="categories" text={t("NAV_GESTION_DES_CATEGORIES")} icon="fa-copyright" to="/categories" />
    ),
    navFilter("tags") && (
      <Item key="actors" text={t("NAV_GESTION_DES_ACTEURS")} icon="fa-users-cog" to="/actors" />
    ),
    navFilter("tags") && (
      <Item key="lists" text={t("NAV_GESTION_DES_LIST")} icon="fa-users-cog" to="/lists" />
    ),
    navFilter("tags") && (
      <Item key="civils" text={t("NAV_GESTION_DES_SOCIETE_CIVIL")} icon="fa-users-cog" to="/civils" />
    ),
    navFilter("tags") && (
      <Item key="constituency" text={t("NAV_GESTION_DES_CIRCONSCRIPTION")} icon="fa-users-cog" to="/constituency" />
    ),
    navFilter("settings") && (
      <Item key="settings" text={t("NAV_SETTINGS")} icon="fa-laptop-code">
        {navFilter("settings") && (
          <Item
            key="settings-parsers"
            text={t("NAV_SETTINGS_PARSER")}
            icon="fa-laptop-code"
            to="/ParserSettings"
          />
        )}
        {navFilter("settings") && (
          <Item
            key="settings-crawlers"
            text={t("NAV_SETTINGS_CRAWLER")}
            icon="fa-laptop-code"
            to="/CrawlerSettings"
          />
        )}
        {navFilter("settings") && (
          <Item
            key="settings-displays"
            text={t("NAV_SETTINGS_DISPLAY")}
            icon="fa-laptop-code"
            to="/DisplaySettings"
          />
        )}
        {navFilter("settings") && (
          <Item
            key="settings-more"
            text={t("NAV_SETTINGS_MORE")}
            icon="fa-laptop-code"
            to="/MoreSettings"
          />
        )}
      </Item>
    ),
    navFilter("stats") && (
      <Item key="stats" text={t("NAV_STATISTIQUES")} icon="fa-chart-area" to="/statistique" />
    ),
    <li className="header" key={"NAV_AUDIO_VISUAL_MONITORING"}> {t("NAV_AUDIO_VISUAL_MONITORING")}</li>,
    <Item key="NAV_MONITORING_PROGRAM" text={t("NAV_MONITORING_PROGRAM")} icon="fa-laptop-code" to="/monitoring-program" />,
    <Item key="NAV_MONITORING_PLURALITY" text={t("NAV_MONITORING_PLURALITY")} icon="fa-laptop-code" to="/monitoring-plurality" />,
    <Item key="NAV_MONITORING_ELECTORAL_IRREGULARITIES" text={t("NAV_MONITORING_ELECTORAL_IRREGULARITIES")} icon="fa-laptop-code" to="/monitoring-electoral-irregularities" />,
    <li className="header" key={"NAV_USER_SETTINGS"}> {t("NAV_USER_SETTINGS")}</li>,
    navFilter("roles") && (
      <Item key="roles" text={t("NAV_GESTION_DES_ROLES")} icon="fa-users" to="/roles" />
    ),
    navFilter("users") && (
      <Item key="users" text={t("NAV_GESTION_DES_UTILISATEURS")} icon="fa-users-cog" to="/Users" />
    )
    // <Item key="logout" text={t("NAV_SE_DECONNECTER")} icon="fa-sign-out-alt" to="/logout" />

  ].filter(Boolean);
}
