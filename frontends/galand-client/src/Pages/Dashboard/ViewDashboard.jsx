import React, { Component, Fragment } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Link } from "react-router-dom";
import { Content, Row, Col, SimpleTable, Box } from "adminlte-2-react";
import CountBox from "./components/CountBox";
import { StatusEnum, ImportanceEnum, NewsStateENum } from "Enums";
import "../../App.css";
import { connect } from "react-redux";
import { TypedNews, Indicators } from "modules/ressources";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import DataSources from "./components/DataSources";
import LatestFakenewsInfractions from "./components/LatestFakenewsInfractions";
import LatestMonitoringInfractions from "./components/LatestMonitoringInfractions";
import MonitorsSlider from "./components/MonitorsSlider";

const MyNews = TypedNews("added", "", "myNews");
const ActionNews = TypedNews("required-actions", "", "actionNews");
const ProjectsNews = TypedNews("projects", "", "projectsNews")
const News = TypedNews("all", "", "news");

class ViewDashboard extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { getIndicators } = this.props;
    getIndicators();
  }
  getActionPlanColumns(t) {
    return [
      { title: t("LABEL_TITLE"), data: "title" },
      { title: t("LABEL_IMPORTANCE"), data: "importance" },
      { title: t("LABEL_ACTIONS"), data: "action" },
    ];
  }
  getColumns(t) {
    return [
      { title: t("LABEL_TITLE"), data: "title" },
      { title: t("LABEL_DATE_AJOUT"), data: "created" },
      { title: t("LABEL_ETAT"), data: "status" },
    ];
  }

  getProjectNewsColumns(t) {
    return [
      { title: t("LABEL_TITLE"), data: "title" },
      { title: t("LABEL_DATE_AJOUT"), data: "created" },
      { title: t("LABEL_ETAT"), data: "status" },
      { title: t("LABEL_PROJECT"), data: "project" },
    ];
  }

  formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }
  componentDidMount() {
    const { permissions, getNews, getMyNews, getActionNews, getProjectsNews } = this.props;
    getNews();
    getMyNews();
    getProjectsNews();
    if (permissions["P_ACTION_PLANS"]) getActionNews();
  }

  render() {
    const { permissions, news, myNews, actionNews, indicators, t, userId, projectsNews} = this.props;
    let {projects} = this.props;
    projects = projects.filter(pro=>pro.assignees.find(assig=> assig === userId) !== undefined);
    let projectsNewsAllowed = [] ;
      for (const infraction of projectsNews) {
        for (const project of projects) {   
        if (infraction["projectId"] === project["_id"]){
          projectsNewsAllowed.push({...infraction, project : project["title"]}) ;
        }
      }
      }
    const newsData = myNews
      .map((n) => ({
        ...n,
        title: <Link to={"/news/" + n._id}>{n.title}</Link>,
        status: NewsStateENum[n.status],
        created: this.formatDate(n.created),
      }))
      .map((n) => ({ ...n, status: t(n.status) }));

    const projectNewsData = projectsNewsAllowed
      .map((n) => ({
        ...n,
        title: <Link to={"/news/" + n._id}>{n.title}</Link>,
        status: NewsStateENum[n.status],
        created: this.formatDate(n.created),
        project : <Link to={"/projects/" + n.projectId}>{n.project}</Link>
      }))
      .map((n) => ({ ...n, status: t(n.status) }));

    const actionPlans = actionNews
      .map((n) =>
        n.actionPlan.map((ap) => ({
          ...ap,
          _id: n._id,
        }))
      )
      .reduce((acc, ap) => acc.concat(ap), [])
      .filter((ap) => ap.status === StatusEnum.NONE.value)
      .map((ap) => ({
        ...ap,
        importance: ImportanceEnum[ap.importance],
        action: (
          <Link to={"/news/" + ap._id} className={"btn btn-info"} title={t("TEXT_PLUS_DE_DÉTAILS")}>
            &#x1F441;
          </Link>
        ),
      }))
      .map((ap) => ({ ...ap, importance: t(ap.importance) }));

    return (
      <Content title={t("TITLE_DASHBOARD")} browserTitle={t("TITLE_DASHBOARD")}>
        <Row>
          <CountBox
            className={"col-md-3 col sm-12"}
            color={"bg-aqua-gradient"}
            count={indicators.numAddedNews}
            text={t("TEXT_MES_FAKENEWS")}
            icon={"fa-user"}
            link={"news/added"}
          />
          {permissions["P_GET_ASSIGNED"] ? (
            <CountBox
              className={"col-md-3 col sm-12"}
              color={"bg-purple"}
              count={indicators.numNewsMonitored}
              text={t("TEXT_ASSIGNED_FAKENEWS")}
              icon={"far-newspaper"}
              link={"news/assigned"}
            />
          ) : null}
          {permissions["P_FAKENEWS_INFRACTIONS"] ? (
            <CountBox
              className={"col-md-2 col sm-12"}
              color={"bg-red"}
              count={indicators.numInfractions}
              text={t("TEXT_COUNT_FAKENEWS_INFRACTIONS")}
              icon={"fa-exclamation-triangle"}
              link={"infractions"}
            />
          ) : null}
          {permissions["P_MONITORING_INFRACTIONS"] ? (
            <CountBox
              className={"col-md-2 col sm-12"}
              color={"bg-green"}
              count={indicators.numMonitoringInfractions}
              text={t("TEXT_COUNT_MONITORING_INFRACTIONS")}
              icon={"fa-exclamation-triangle"}
              link={"monitoring-infractions"}
            />
          ) : null}
          {permissions["P_VALIDATE_INFRACTION"] ? (
            <CountBox
              className={"col-md-2 col sm-12"}
              color={"bg-orange"}
              count={indicators.numInfractionsAValider}
              text={t("TEXT_COUNT_INFRACTIONS_TO_VALIDATE")}
              icon={"fa-exclamation-triangle"}
              link={"infractions"}
            />
          ) : null}
          <Col sm={12} md={7}>
            <Box
              collapsable={false}
              border={false}
              type={"primary"}
              header={
                <div>
                  <h4 className={"text-center text-lg"}>{t("TEXT_RECENTLY_ADDED_NEWS")}</h4>
                </div>
              }
              footer={
                <Link to="/news/added" className={"small-box-footer"}>
                  {t("TEXT_VOIR_TOUTES_LES_FAKENEWS_AJOUTÉES")+ " "} 
                  <FontAwesomeIcon icon={splitIcon("fa-arrow-circle-right")} />
                </Link>
              }
            >
              <SimpleTable
                footer={true}
                hover={true}
                striped={true}
                border={true}
                responsive={true}
                columns={this.getColumns(t)}
                data={newsData}
              />
            </Box>
          </Col>
          {permissions["P_MONITORING_INFRACTIONS"] ? (
            <Col sm={12} md={5}>
              <LatestMonitoringInfractions t={t} />
            </Col>
          ) : (
            <Fragment />
          )}
          {permissions["P_FAKENEWS_INFRACTIONS"] ? (
            <Col sm={12} md={5}>
              <LatestFakenewsInfractions t={t} />
            </Col>
          ) : (
            <Fragment />
          )}
          <Col sm={12} md={7}>
            <Box
              collapsable={false}
              border={false}
              type={"info"}
              header={
                <div>
                  <h4 className={"text-center text-lg"}>{t("TEXT_NEWS_RELATED_TO_PROJECTS")}</h4>
                </div>
              }
            >
              <SimpleTable
                footer={true}
                hover={true}
                striped={true}
                border={true}
                responsive={true}
                columns={this.getProjectNewsColumns(t)}
                data={projectNewsData}
              />
            </Box>
          </Col>
          {permissions["P_MEDIA"] ? (
            <Col sm={12} md={5}>
              <DataSources t={t} />
            </Col>
          ) : (
            <Fragment />
          )}
          <Col sm={12} md={7}>
            <Box
              collapsable={false}
              border={false}
              type={"success"}
              header={
                <div>
                  <h4 className={"text-center text-lg"}>{t("TEXT_ACTIONS_À_FAIRE")}</h4>
                </div>
              }
            >
              <SimpleTable
                footer={true}
                hover={true}
                striped={true}
                border={true}
                responsive={true}
                columns={this.getActionPlanColumns(t)}
                data={actionPlans}
              />
            </Box>
          </Col>
          <Col sm={12} md={12}>
              <MonitorsSlider news={news}/>
          </Col>
        </Row>
      </Content>
    );
  }
}

ViewDashboard.propTypes = {
  indicators: PropTypes.shape({
    numAddedNews: PropTypes.number,
    numNewsMonitored: PropTypes.number,
    numInfractions: PropTypes.number,
    numInfractionsAValider: PropTypes.number,
    numMonitoringInfractions: PropTypes.number,
  }),
};

ViewDashboard.defaultProps = {
  indicators: {
    numAddedNews: 0,
    numNewsMonitored: 0,
    numInfractions: 0,
    numInfractionsAValider: 0,
    numMonitoringInfractions: 0,
  },
  permissions: {},
  myNews: [],
  news: [],
  actionNews: [],
  projectsNews : []
};
function mapStateToProps(state) {
  return {
    myNews: state.data.myNews,
    news: state.data.news,
    actionNews: state.data.actionNews,
    projectsNews: state.data.projectsNews,
    indicators: state.data.indicators,
    permissions: state.persistedData.permissions,
    userId: state.persistedData._id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getIndicators: () => dispatch(Indicators.getOne("")),
    getNews: () => dispatch(News.get()),
    getMyNews: () => dispatch(MyNews.get()),
    getActionNews: () => dispatch(ActionNews.get()),
    getProjectsNews : () => dispatch(ProjectsNews.get())
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ViewDashboard));
