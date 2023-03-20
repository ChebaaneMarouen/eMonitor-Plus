import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Col, Content, Row, TabContent, Tabs, Box, Inputs  } from "adminlte-2-react";
import "../News.css";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { News, NewsChanges, Projects, Role } from "modules/ressources";
import * as socket from "modules/socket";
import { StatusEnum, NewsStateENum } from "Enums";
import NewsForm from "../components/NewsForm";
import PriorityImpactComponent from "./components/PriorityImpactComponent";
import AffectationComponent from "./components/AffectationComponent";
import ActionComponent from "./components/ActionComponent";
import InformationsComponents from "./components/InformationsComponents";
import ActionsCount from "./components/ActionsCount";
import InfractionWidget from "./components/InfractionWidget";
import ActionPlanComponents from "./components/ActionPlanComponents";
import TimeLineComponent from "./components/TimeLineComponent";
import StatusComponent from "./components/StatusComponent";
import Communication from "./components/Communication";
import VideoTracking from "./components/VideoTracking";
import AnalysisTab from "./components/AnalysisTab";
import Infraction from "./components/Infraction";
import HateSpeechComponent from "./components/HateSpeechComponent";
import WomenPresence from "./components/WomenPresence";

const { Checkbox } = Inputs;

class SingleNewsPage extends Component {
  constructor(props) {
    super(props);
    this.socket = socket.getSocket();
    this.state = {
      currentAction: {}
    };

    this.socket.on("user-comment-added", ()=>{
      this.updateData()
    })

    this.onChange = this.onChange.bind(this);
    this.onActionChange = this.onActionChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.onSubmitActions = this.onSubmitActions.bind(this);
    this.change = this.change.bind(this);
    this.changeStatus = this.changeStatus.bind(this);
    this.changeActionStatus = this.changeActionStatus.bind(this);
    this.updateData = this.updateData.bind(this);
    this.onChangeCom = this.onChangeCom.bind(this);
    this.removeNews = this.removeNews.bind(this);
  }
  componentDidMount() {
    const { id } = this.props.match.params;
    const { getSingleNews } = this.props;
    if (id) {
      getSingleNews(id);
    }
    const { getRoles } = this.props;
    getRoles();
  }

  onChangeCom(e, cb) {
    const { name, value } = e.target;
    const { communication } = this.state;
    this.setState(
      {
        communication: {
          ...communication,
          [name]: value
        }
      },
      () => {
        if (typeof cb === "function") cb();
      }
    );
  }

  updateData() {
    setTimeout(() => {
      const { id } = this.props.match.params;
      const { getChanges, getSingleNews } = this.props;
      if (id) {
        getSingleNews(id);
        getChanges(id);
      }
    }, 1000);
  }

  removeNews() {
    const { removeNews, singleNews } = this.props;
    if (singleNews) var { projectId } = singleNews;
    removeNews(this.state, () => {
      if (projectId) {
        this.props.history.replace("/projects/" + projectId);
      } else {
        this.props.history.replace("/news/");
      }
    });
  }

  componentDidUpdate(prevProps, prevState) {
    const { singleNews, getProject } = this.props;
    if (this.props.singleNews !== prevProps.singleNews) {
      this.setState(this.props.singleNews);
      if (singleNews.projectId) getProject(singleNews.projectId);
    }

    const { id } = this.props.match.params;
    if (prevProps.match.params.id !== id) {
      const { getSingleNews } = this.props;
      if (id) {
        getSingleNews(id);
      }
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    const { UpdateSingleNews } = this.props;
    if (name === "files") {
      this.setState(
        {
          files: [...this.state.files, value]
        },
        () => UpdateSingleNews(this.state, () => this.updateData())
      );
    } else {
      this.setState({
        [name]: value
      });
    }
  }

  onActionChange(e) {
    const { name, value } = e.target;
    this.setState({
      currentAction: { ...this.state.currentAction, [name]: value }
    });
  }

  onSubmit(e) {
    let value, name;
    e ? ({ value, name } = e.target) : (value = "");
    const { UpdateSingleNews } = this.props;
    if (name == "videoTrackComment") {
      this.setState(
        {
          videoTrackComments: [
            ...this.props.singleNews.videoTrackComments,
            {
              videoTrackComment: this.state.videoTrackComment,
              videoTrackTime: this.state.videoTrackTime
            }
          ],
          videoTrackComment: "",
          videoTrackTime: ""
        },
        () => UpdateSingleNews(this.state, this.updateData)
      );
    } else if (name == "removeVideoTrackTime") {
      let filteredComments = this.props.singleNews.videoTrackComments.filter(
        com => com.videoTrackComment != e.target.value
      );
      this.setState({ videoTrackComments: filteredComments }, () =>
        UpdateSingleNews(this.state, this.updateData)
      );
    } else if (value === "AFFECT") {
      this.setState({ status: NewsStateENum.VERIFICATION.value }, () =>
        UpdateSingleNews(this.state, this.updateData)
      );
    } else if (value === "userComment") {
      if (this.state.userComment){
        this.socket.emit("user-add-comment");
        this.setState(
          {
            comments: [...this.state.comments, this.state.userComment],
            userComment: ""
          },
          () => UpdateSingleNews(this.state, this.updateData)
        );
      }

    } else UpdateSingleNews(this.state, this.updateData);
  }

  onSubmitActions(cb) {
    const { UpdateSingleNews } = this.props;
    this.setState(
      {
        currentAction: {
          ...this.state.currentAction,
          status: StatusEnum.NONE.value
        }
      },
      () =>
        this.setState(
          { actionPlan: [...this.state.actionPlan, this.state.currentAction] },
          () =>
            UpdateSingleNews(this.state, err => {
              if (!err) {
                cb();
              }
              this.updateData();
            })
        )
    );
  }

  change(type) {
    const { UpdateSingleNews } = this.props;
    return data => {
      this.setState(
        {
          [type]: {
            ...this.state[type],
            ...data
          }
        },
        () => UpdateSingleNews(this.state, this.updateData)
      );
    };
  }

  changeStatus(value) {
    const { UpdateSingleNews } = this.props;

    this.setState({ status: value }, () =>
      UpdateSingleNews(this.state, this.updateData)
    );
  }

  changeActionStatus(id, actionUpdate, crudUpdate, comment) {
    const { UpdateSingleNews, userName, userId } = this.props;
    if (crudUpdate === "DELETE") {
      let array = [...this.state.actionPlan];
      array.splice(id, 1);
      return this.setState({ actionPlan: array }, () =>
        UpdateSingleNews(this.state, this.updateData)
      );
    }
    let array = [...this.state.actionPlan];
    const comments = array[id].comments || [];

    array[id] = {
      ...array[id],
      status: actionUpdate,
      comments: comments.concat([
        {
          date: Date.now(),
          userId,
          userName,
          comment,
          actionUpdate
        }
      ])
    };

    this.setState({ actionPlan: array }, () =>
      UpdateSingleNews(this.state, this.updateData)
    );
  }

  render() {
    const { userComment, videoTrackComment, videoTrackTime, form, fakeNews } = this.state;

    const { t, selectedProject, singleNews, permissions, userId, persistedData, roles, lang } = this.props;

    console.log("fakeNews", fakeNews)
    console.log("this.state", this.state)

    let journaliste = roles ? roles.filter(el => el.name === "Journaliste" )[0] : {};
    if (!singleNews) return null;
    const formInfos = selectedProject.forms;
    const { projectId } = singleNews;
    const labelType = projectId ? "ARTICLES" : "FAKENEWS";
    const isProject = Boolean(projectId);
    const title = projectId
      ? selectedProject.title
      : t("TITLE_VISULAISER_FAKENEWS");
    return (
      <Content title={title} browserTitle={this.state.title}>
        <Row>
          <Col sm={12} md={3}>
            {isProject ? null :  <StatusComponent isProject={isProject} status={this.state.status} /> }
            {isProject ? null : 
            <Box title={t("TITLE_CONSEDIRING_NEWS_AS")} type="info">
            <center className="text-primary" style={{ fontSize: "18px" }}>
            <Checkbox
              text={t("TEXT_FAKE_NEWS")}
              sm={12}
              labelSm={0}
              name="fakeNews"
              value={!!fakeNews}
              onChange={() =>
                this.onChange({
                  target: { name: "fakeNews", value: !fakeNews }
                })
              }
            />
            </center>
          </Box>}
            { isProject ? null :  <PriorityImpactComponent
              priority={this.state.priority}
              impact={this.state.impact}
              onChange={this.onChange}
              onSubmit={this.onSubmit}
            />}
            {isProject ? null :  
              <Box title={t("TITLE_CREATOR_INFO")} type="info">
              <center className="text-primary" style={{ fontSize: "18px" }}>
                {this.state.creatorInfo? this.state.creatorInfo.fName + " " + this.state.creatorInfo.lName :null}
              </center>
            </Box>
              }
            {// projects does not have assignments
            permissions["P_AFFECT_FAKENEWS"] && (
              <AffectationComponent
                monitor={this.state.monitor}
                dueDate={this.state.dueDate}
                currentDueDate={singleNews.dueDate}
                currentMonitor={singleNews.monitor}
                status={this.state.status}
                onChange={this.onChange}
                onSubmit={this.onSubmit}
              />
            )}
            {((isProject && permissions["P_MONITORING_INFRACTIONS"]) ||
              (!isProject && permissions["P_FAKENEWS_INFRACTIONS"])) && (
              <InfractionWidget
                singleNews={singleNews}
                monitor={this.state.monitor}
                infraction={this.state.infraction}
                updateInfraction={this.change("infraction")}
              />
            )}
            {permissions["P_ACTION_PLANS"] &&
             (
              <ActionComponent
                isProject={isProject}
                removeNews={this.removeNews}
                status={this.state.status}
                monitor={this.state.monitor}
                onSubmit={this.changeStatus}
                news={singleNews}
              />
            )}

            <ActionsCount actions={singleNews.actionPlan} />
          </Col>
          <Col sm={12} md={9}>
            <Tabs
              onSelect={this.updateData}
              defaultActiveKey={"Informations"}
              title={this.state.title}
            >
              {[
                <TabContent
                key={t("TITLE_INFORMATIONS")}
                  eventKey={"Informations"}
                  title={t("TITLE_INFORMATIONS")}
                >
                  <InformationsComponents
                    news={this.state}
                    userComment={userComment}
                    onChange={this.onActionChange}
                    onChangeComment={this.onChange}
                    onSubmit={this.onSubmit}
                  >
                    {this.state.videoUrl && (
                      <VideoTracking
                        video_url={this.state.videoUrl}
                        t={t}
                        news={singleNews}
                        videoTrackComment={videoTrackComment}
                        videoTrackTime={videoTrackTime}
                        onSubmit={this.onSubmit}
                        onChange={this.onChange}
                      />
                    )}
                  </InformationsComponents>
                </TabContent>,
                <TabContent
                  eventKey={"Hate_speech"}
                  title={t("TITLE_HATE_SPEECH")}
                  key={t("TITLE_HATE_SPEECH")}
                >
                  <HateSpeechComponent
                    t={t}
                    news={this.state}
                    onChange={this.onChange}
                  />
                </TabContent>,
                <TabContent
                  eventKey={"woman_presence"}
                  title={t("TITLE_WOMAN_PRESENCE")}
                  key={t("TITLE_WOMAN_PRESENCE")}
                >
                  <WomenPresence
                    t={t}
                    news={this.state}
                    onChange={this.onChange}
                  />
                </TabContent>,
                <TabContent
                  eventKey={"Historique"}
                  title={t("TITLE_HISTORIQUE")}
                  key={t("TITLE_HISTORIQUE")}
                >
                  <TimeLineComponent newsId={singleNews._id} />
                </TabContent>,
                singleNews.infraction.status && (
                  <TabContent
                    eventKey={"Infraction"}
                    title={t("TITLE_INFRACTION")}
                    key={t("TITLE_INFRACTION")}
                  >
                    <Infraction news={singleNews} t={t} />
                  </TabContent>
                ),
                formInfos.length && (
                  <TabContent eventKey={"Analysis"} title={t("TITLE_ANALYSIS")} key={t("TITLE_ANALYSIS")}>
                    <AnalysisTab
                      form={form}
                      formInfos={formInfos}
                      onChange={this.onChange}
                      onSubmit={this.onSubmit}
                    />
                  </TabContent>
                ),

                (permissions["P_GLOBAL_FAKENEWS"] >= 2 ||
                  this.state.creator === userId) && (
                  <TabContent
                    eventKey={"Modification"}
                    title={t("TITLE_MODIFICATION")}
                    key={t("TITLE_MODIFICATION")}
                  >
                    <NewsForm
                      news={singleNews}
                      onChange={this.onChange}
                      onSubmit={this.onSubmit}
                    />
                  </TabContent>
                ),

                (this.state.status === NewsStateENum.PUBLICATION.value ||
                  this.state.status === NewsStateENum.ARCHIVED.value) &&
                  permissions["P_ACTION_PLANS"] >= 1  ?
                  journaliste["_id"] === persistedData["role"] && userId !== singleNews["monitor"]?
                  null : (
                    <TabContent
                      className={"disabled"}
                      eventKey={"Actions"}
                      title={t("TITLE_PLAN_DACTIONS")}
                      key={t("TITLE_PLAN_DACTIONS")}
                    >
                      <ActionPlanComponents
                        {...this.state}
                        lang={lang}
                        onChange={this.onActionChange}
                        onSubmit={this.onSubmitActions}
                        changeActionStatus={this.changeActionStatus}
                      />
                    </TabContent>
                  ):null,

                 (this.state.status === NewsStateENum.PUBLICATION.value ||
                   this.state.status === NewsStateENum.ARCHIVED.value) && !isProject ?
                   journaliste["_id"] === persistedData["role"] && userId !== singleNews["monitor"]?
                   null : (
                   <TabContent
                     eventKey={"communication"}
                     title={t("TITLE_COMMUNIQUÉ_OFFICIEL")}
                     key={t("TITLE_COMMUNIQUÉ_OFFICIEL")}
                   >
                     <Communication
                       submit={this.onSubmit}
                       canEdit={
                         permissions["P_STATEMENT"] >= 2 ||
                         userId === this.state.monitor
                       }
                       communication={this.state.communication}
                       onChange={this.onChangeCom}
                     />
                   </TabContent>
                 ):null
              ].filter(Boolean)}
            </Tabs>
          </Col>
        </Row>
      </Content>
    );
  }
}
SingleNewsPage.propTypes = {
  className: PropTypes.string,
  singleNews: PropTypes.object
};

SingleNewsPage.defaultProps = {
  singleNews: null,
  permissions: {},
  selectedProject: {
    forms: []
  }
};
function mapStateToProps(state) {
  return {
    singleNews: state.data.singleNews,
    selectedProject: state.data.selectedProject,
    permissions: state.persistedData.permissions,
    userId: state.persistedData._id,
    userName: state.persistedData.fName + " " + state.persistedData.lName,
    persistedData : state.persistedData,
    roles: state.data.roles,
    lang : state.persistedData.lang
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getSingleNews: id => dispatch(News.getOne(id, "singleNews")),
    getProject: id => dispatch(Projects.getOne(id, "selectedProject")),
    getChanges: id => dispatch(NewsChanges(id).get()),
    UpdateSingleNews: (news, cb) => dispatch(News.update(news, cb)),
    removeNews: (news, cb) => dispatch(News.remove(news, cb)),
    getRoles: () => {
      dispatch(Role.describe());
      dispatch(Role.get());
    },
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(SingleNewsPage)
);
