import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import "modules/i18n";
import { withTranslation } from "react-i18next";
import AdminLTE from "adminlte-2-react";
import { BrowserRouter as Router, Route, Switch } from "react-router-dom";
import { Projects, Notifications } from "modules/ressources";
import LoadingScreen from "components/LoadingScreen";
import Users from "./Pages/Users/Users";
import Login from "Pages/Login";
import Register from "Pages/Register";
import ForgetPwd from "Pages/ForgetPassword";
import SavedSearches from "Pages/SavedSearches/SavedSearches";
import Logout from "Pages/Logout/Logout";
import NavBar from "components/Navbar";
import AddNews from "./Pages/News/AddNews";
import ListNews from "./Pages/News/NewsList/VewsListNewsPage";
import SingleNewsPage from "./Pages/News/SingleNews/ViewSingleNewsPage";
import Stats from "./Pages/Stats/Stats";
import nav, { getSideBar } from "./nav";
import * as socket from "modules/socket";
import EventsHandler from "@shared/Components/EventsHandler";
import MyNotifications from "@shared/Components/MyNotifications";
import TokensHelper from "components/TokensHelper";
import AdminSettings from "@shared/Pages/adminSettings";
import ScrappingListView from "./Pages/Scrapping/ListView";
import ViewDashboard from "./Pages/Dashboard/ViewDashboard";
import ResetPass from "./Pages/ResetPass";
import VideosPreprocessing from "Pages/Videos/VideoPage";
import ProjectsComponent from "Pages/Projects/ProjectsPage";
import ModelsPage from "Pages/Models/ModelsPage";
import SentimentModelsPage from "Pages/SentimentModels/ModelsPage";
import RolesComponent from "Pages/Roles/RolesPage";
import AddCustDict from "./Pages/CustomDictionaries/CustomDictionariesPage";
import ManageMedias from "./Pages/Medias/MediasPage";
import Classifications from "Pages/Classifications/ClassificationsPage";
import SentimentClassifier from "Pages/SentimentClassifier/SentimentClassifier";
import AddDict from "./Pages/Dictionaries/DictionariesPage";
import ScrappingConfig from "Pages/ScrappingConfig/ScrappingConfigPage";
import TagsComponent from "./Pages/Tags/TagsPage";
import FakenewsInfractionsPage from "./Pages/News/InfractionPage/FakenewsInfractionsPage";
import MonitoringInfractionsPage from "./Pages/News/InfractionPage/MonitoringInfractionsPage";
import FormsPage from "./Pages/Forms/FormsPage";
import logo from "./assests/default-logo.png";
import ScrollArrow from "./components/ScrollArrow";
import "./App.css";
import ActorsPage from "Pages/Actors/ActorsPage";
import Program from "Pages/AudioVisual/Program";
import ElectoralIrregularities from "Pages/AudioVisual/ElectoralIrregularities";
import Plurality from "Pages/AudioVisual/Plurality";
import PartyLists from "Pages/ListsParty/PartyLists";
import CivilSocietyPage from "Pages/CivilSociety/CivilSocietyPage";
import ConstituencyPage from "Pages/Constituency/ConstituencyPage";
class App extends Component {
  constructor(props) {
    super(props);
    this.socket = socket.getSocket();
    this.state = {
      notifications: [],
      activated : "en"
    };

    if (this.props.isAuthenticated) socket.start();
    this.socket.on("notif-user-affected", ({ idNew, seen, title }) => {
      this.setState({
        notifications: [{ idNew, seen, title }].concat(this.state.notifications),
      });
      setTimeout(() => {
        props.getNotifications(props.userId);
      }, 2000);
    });
    this.changeLang = this.changeLang.bind(this);
  }

  componentDidMount() {
    const { getProjects, getNotifications, userId, lang } = this.props;
    this.changeLang(lang);
    getProjects();
    getNotifications(userId);
    this.setState({
      activated : lang
    })
  }

  componentDidUpdate(prevProps) {
    const { isAuthenticated, notifications } = prevProps;
    if (isAuthenticated !== this.props.isAuthenticated) {
      if (this.props.isAuthenticated) socket.start();
    }
    if (notifications !== this.props.notifications) {
      this.setState({
        notifications: this.props.notifications,
      });
    }
  }

  changeLang(value) {
    console.log(value);
    const { changeLang, i18n } = this.props;
    changeLang(value);
    i18n.changeLanguage(value);
    this.setState({
      activated : value
    })
  }

  Logout = () =>{
    const {Logout} = this.props;
    Logout()
  }

  changeNotifState = (newNotif) => {
    let newTabNotif = [newNotif].concat(
      this.state.notifications.filter((el) => el._id !== newNotif._id)
    );
    this.setState({
      notifications: newTabNotif,
    });
  };

  sideBar = [];
  render() {
    const { t, lang, permissions, isAuthenticated, projects, userId, fName, lName } = this.props;
    const { notifications } = this.state;
    let content = (
      <Router>
        <Switch>
          <Route path="/register/:token?" component={Register} />
          <Route path="/reset-password/:token?" component={ResetPass} />
          <Route path="/forgot-password" component={ForgetPwd} />
          <Route component={Login} />
        </Switch>
      </Router>
    );
    if (isAuthenticated) {
      const navFilter = nav(permissions, t);
      const sideBar = getSideBar(navFilter, t, projects, userId, fName, lName);

      content = (
        <div className={lang}>
          <AdminLTE
            title={<img src={logo} className="navBar-title-lg" />}
            titleShort={<img src={logo} className="navBar-title-sm" />}
            theme="red"
            direction={lang === "ar" ? "rtl" : "ltr"}
            sidebar={sideBar}
          >
            {NavBar({
              changeLang: this.changeLang,
              notifications,
              lang : lang,
              Logout:this.Logout,
              t,
              changeParentState: this.changeNotifState,
              activated : this.state.activated
            })}
            <ViewDashboard path="/dashboard" projects={projects}/>
            <FormsPage path="/forms" permission={permissions["P_FORM"]} />
            <TagsComponent path="/sujets" permission={permissions["P_TAGS"]} />
            <TagsComponent isCategory path="/categories" permission={permissions["P_TAGS"]} />
            <ActorsPage path="/actors" permission={permissions["P_TAGS"]} />
            <CivilSocietyPage path="/civils" permission={permissions["P_TAGS"]} />
            <ConstituencyPage path="/constituency" permission={permissions["P_TAGS"]} />
            <PartyLists path="/lists" permission={permissions["P_TAGS"]} />
            <Users path="/Users" permission={permissions["P_USERS"]} />
            <AddNews path="/AddNews" permission={permissions["P_FAKENEWS"]} />
            <ListNews path="/news/added" type="added" />
            <ListNews path="/news/fakenews" type="fakenews" />
            <ListNews path="/news/assigned" type="assigned" permission={permissions["P_GET_ASSIGNED"]} />
            <SingleNewsPage path="/news/:id" />
            <ListNews path="/news" type="all" />
            <FakenewsInfractionsPage
              path="/infractions"
              permission={permissions["P_FAKENEWS_INFRACTIONS"]}
            />
            <MonitoringInfractionsPage
              path="/monitoring-infractions"
              permission={permissions["P_MONITORING_INFRACTIONS"]}
            />
            <AdminSettings
              customOptions={<TokensHelper />}
              loadingScreen={<LoadingScreen title={t("TEXT_LOADING_SETTINGS")} />}
              title={t("NAV_SETTINGS_PARSER")}
              browserTitle={t("NAV_SETTINGS_PARSER")}
              path="/ParserSettings"
              filter="parser"
              t={t}
            />
            <AdminSettings
              customOptions={<TokensHelper />}
              loadingScreen={<LoadingScreen title={t("TEXT_LOADING_SETTINGS")} />}
              path="/CrawlerSettings"
              filter="crawler"
              title={t("NAV_SETTINGS_CRAWLER")}
              browserTitle={t("NAV_SETTINGS_CRAWLER")}
              t={t}
            />
            <AdminSettings
              customOptions={<TokensHelper />}
              loadingScreen={<LoadingScreen title={t("TEXT_LOADING_SETTINGS")} />}
              path="/DisplaySettings"
              filter="display"
              title={t("NAV_SETTINGS_DISPLAY")}
              browserTitle={t("NAV_SETTINGS_DISPLAY")}
              t={t}
            />
            <AdminSettings
              customOptions={<TokensHelper />}
              loadingScreen={<LoadingScreen title={t("TEXT_LOADING_SETTINGS")} />}
              path="/MoreSettings"
              title={t("NAV_SETTINGS_MORE")}
              browserTitle={t("NAV_SETTINGS_MORE")}
              t={t}
              filter="more"
            />
            <ScrappingConfig
              path="/scrapping-config"
              permission={permissions["P_WEB_SCRAPPING_RULES"]}
            />
            <VideosPreprocessing path="/videos-preprocessing" permission={permissions["P_VIDEO"]} />
            <ListNews
              path="/projects/:projectId"
              type="projects"
              permission={permissions["P_PROJECT"]}
            />
            <ProjectsComponent path="/projects" permission={permissions["P_PROJECT"]} />
            <SavedSearches path="/custom-search" permission={permissions["P_CUSTOM_SEARCH"]} />
            <Logout path="/logout" />
            <ManageMedias path="/manage-medias" permission={permissions["P_MEDIA"]} />
            <Stats path="/statistique" />
            <SentimentClassifier permission={permissions["P_CLASSIFICATION"]} path="/sentiment-manager" />
            <SentimentModelsPage permission={permissions["P_MACHINE_LEARNING_MODELS"]} path="/sentiment-models" />
            <AddDict path="/add-dictionary" permission={permissions["P_DICTIONNARY"]} />
            <AddCustDict path="/add-custom-dictionary" permission={permissions["P_DICTIONNARY"]} />
            <ScrappingListView path="/scraping-fakenews" permission={permissions["P_FAKENEWS"]} />
            <ScrappingListView
              path="/view-scrapping-list/:postId?"
              permission={permissions["P_ACCESS_SCRAPPING"]}
              showProjectPanel
            />
            <RolesComponent path="/roles" permission={permissions["P_ROLES"]} />
            <Classifications path="/classifications" permission={permissions["P_CLASSIFICATION"]} />
            <ModelsPage path="/models" permission={permissions["P_MACHINE_LEARNING_MODELS"]} />
            <Program path="/monitoring-program"/>
            <ElectoralIrregularities path="/monitoring-electoral-irregularities"/>
            <Plurality path="/monitoring-plurality"/>
            <ViewDashboard path="/"  projects={projects}/>
          </AdminLTE>
        </div>
      );
    }
    return (
      <>
        <MyNotifications t={t} socket={this.socket} />
        <EventsHandler socket={this.socket} />
        {content}
        <ScrollArrow lang={lang}/>
      </>
    );
  }
}

App.propTypes = {
  projects: PropTypes.array,
};

App.defaultProps = {
  projects: [],
  permissions: {},
};

function mapStateToProps(state) {
  return {
    isAuthenticated: state.persistedData.isAuthenticated,
    permissions: state.persistedData.permissions,
    userId: state.persistedData._id,
    fName : state.persistedData.fName,
    lName : state.persistedData.lName,
    lang: state.persistedData.lang,
    projects: state.data.projects,
    notifications: state.data.notifications,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    Logout: () =>
      dispatch({
        type: "authLogin",
        isAuthenticated: false,
        roles: null
      }),
    changeLang: (lang) => dispatch({ type: "userSettings", payload: { lang } }),
    getProjects: () => dispatch(Projects.get()),
    getNotifications: (id) => dispatch(Notifications(id).get()),
  };
}
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(App));
