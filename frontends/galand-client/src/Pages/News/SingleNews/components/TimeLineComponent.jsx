import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "../../News.css";
import { Timeline, TimeLineItem, TimeLineLabelItem } from "../../../../components/Timeline/TimeLineItem";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { NewsChanges } from "modules/ressources";
import { connect } from "react-redux";
import FileComponent from "components/File";
import { getKeyByValue, ImpactEnum, NewsStateENum, PrioriteEnum } from "Enums";
import { newsFilePath } from "modules/ressources";

class TimeLineComponent extends Component {
  sortedChanges;
  constructor(props) {
    super(props);
    this.state = {
      isUpdated: false,
    };
  }
  componentDidUpdate(prevProps, prevState, snapshot) {
    const { t } = this.props;
    if (prevProps.newsId !== this.props.newsId) {
      const id = this.props.newsId;
      if (id)
        this.setState({
          _id: id,
        });
      const { getChanges } = this.props;
      getChanges(id);
    }
    if (prevProps.changes !== this.props.changes) {
      this.setState({ isUpdated: true });
      this.sortedChanges = this.props.changes;
      this.sortedChanges.sort((a, b) => (a.created < b.created ? 1 : -1));
      console.log(this.sortedChanges);
      this.sortedChanges.forEach((item, key) => {
        if (!this.props.infractionOnly)
          switch (item.changedKey) {
            case "comments":
              item["color"] = "bg-aqua";
              item["icon"] = "fa-comments";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_AJOUTÉ_UN_COMMENTAIRE");
              item["content"] = (
                <p>
                  {item.newValue[item.newValue.length - 1] &&
                    item.newValue[item.newValue.length - 1].text}
                </p>
              );
              break;
            case "title":
              item["color"] = "bg-light-blue";
              item["icon"] = "fa-pen";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_CHANGÉ_LE_TITRE");
              item["content"] = (
                <span>
                  <p>
                    <strong>{t("TEXT_LE_TITRE_A_ÉTÉ_CHANGÉE_DE")}:</strong>
                  </p>
                  <p>{item.oldValue}</p>
                  <p>
                    <strong> {t("TEXT_À")}:</strong>
                  </p>
                  <p>{item.newValue}</p>
                </span>
              );
              break;
            case "created":
              item["color"] = "bg-navy";
              item["icon"] = "fa-flag";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_CRÉE_LA_FAKENEWS");
              item["content"] = null;
              break;
            case "monitor":
              item["color"] = "bg-teal";
              item["icon"] = "fa-user-tag";
              item["title"] =
                item.userId.fName +
                " " +
                item.userId.lName +
                " " +
                t("TEXT_A_AFFÉCTÉ_LA_NEWS_À_") +
                item.newValue.fName +
                " " +
                item.newValue.lName +
                ".";
              item["content"] = null;
              break;
            case "text":
              item["color"] = "bg-olive";
              item["icon"] = "fa-comment-alt";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_MODIFIÉ_LA_DESCRIPTION");
              item["content"] = (
                <span>
                  <p>
                    <strong>{t("TEXT_LA_DESCRIPTION_A_ÉTÉ_CHANGÉE_DE")}:</strong>
                  </p>
                  <p>{escapedNewLineToLineBreakTag(item.oldValue)}</p>
                  <p>
                    <strong>{t("TEXT_À")}:</strong>
                  </p>
                  <p>{escapedNewLineToLineBreakTag(item.newValue)}</p>
                </span>
              );
              break;
            case "additionalLinks":
              item["color"] = "bg-lime";
              item["icon"] = "fa-link";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_AJOUTÉ_UN_LIEN");
              item["content"] = (
                <p>
                  <a href={item.newValue}>
                    <FontAwesomeIcon icon={["fas", "link"]} /> {item.newValue}
                  </a>
                </p>
              );
              break;
            case "priority":
              item["color"] = "bg-fuchsia";
              item["icon"] = "fa-exclamation";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_CHANGÉ_LA_PRIORITÉ");
              item["content"] =
                t("TEXT_LA_PRIORITÉ_A_ÉTÉ_CHANGÉE_DE") +
                ":" +
                t(getKeyByValue(PrioriteEnum, item.oldValue, null, null, "label")) +
                " " +
                t("TEXT_À") +
                " " +
                t(getKeyByValue(PrioriteEnum, item.newValue, null, null, "label")) +
                '".';
              break;
            case "impact":
              item["color"] = "bg-purple";
              item["icon"] = "fa-chart-bar";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_CHANGÉ_LIMPACT");
              item["content"] =
                t("TEXT_LIMPACT_A_ÉTÉ_CHANGÉ_DE") +
                ': "' +
                t(getKeyByValue(ImpactEnum, item.oldValue, null, null, "label")) +
                '" ' +
                t("TEXT_À") +
                ' "' +
                t(getKeyByValue(ImpactEnum, item.newValue, null, null, "label")) +
                '".';

              break;
            case "status":
              item["color"] = "bg-maroon";
              item["icon"] = "fa-check-circle";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_CHANGÉ_LE_STATUS");
              item["content"] =
                t("TEXT_LE_STATUS_A_ÉTÉ_CHANGÉ_DE") +
                ': "' +
                t(getKeyByValue(NewsStateENum, item.oldValue, null, null, "label")) +
                '" ' +
                t("TEXT_À") +
                ' "' +
                t(getKeyByValue(NewsStateENum, item.newValue, null, null, "label")) +
                '".';
              break;
            case "link":
              item["color"] = "bg-black";
              item["icon"] = "fa-link";
              item["title"] =
                item.userId.fName +
                " " +
                item.userId.lName +
                " " +
                t("TEXT_A_CHANGÉ_LE_LIEN__DE_LARTICLE");
              item["content"] = (
                <p>
                  {t("TEXT_LE_LIEN_A_ÉTÉ_CHANGÉ_DE")} : <br />
                  <a href={item.oldValue}>
                    <FontAwesomeIcon icon={["fas", "link"]} /> {item.oldValue}
                  </a>
                  <br /> {t("TEXT_À")}: <br />
                  <a href={item.newValue}>
                    <FontAwesomeIcon icon={["fas", "link"]} /> {item.newValue}
                  </a>
                </p>
              );

              break;
            case "files":
              item["color"] = "bg-aqua-active";
              item["icon"] = "fa-photo-video";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_AJOUTÉ_DES_PREUVES");
              item["content"] = (
                <div>
                  {item.newValue.map((fileItem) => (
                    <FileComponent file={fileItem} key={fileItem.serverId} staticPath={newsFilePath} />
                  ))}
                </div>
              );

              break;
            case "newsType":
              item["color"] = "bg-light-blue-active";
              item["icon"] = "fa-sliders-h";
              item["title"] =
                item.userId.fName +
                " " +
                item.userId.lName +
                " " +
                t("TEXT_A_MODIFIÉ_LE_TYPE_DARTICLE_À") +
                " " +
                item.newValue +
                ".";
              break;
            case "categories":
              item["color"] = "bg-navy-active";
              item["icon"] = "fa-tags";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_MODIFIÉ_LES_CATEGORIES");
              item["content"] = item.newValue.map((tag) => (
                <span className={"label margin-r-5 "} style={{ backgroundColor: tag.color }}>
                  {tag.label}
                </span>
              ));
              break;
            case "subjects":
              item["color"] = "bg-navy-active";
              item["icon"] = "fa-tags";
              item["title"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_MODIFIÉ_LES_SUJECTS");
              item["content"] = item.newValue.map((tag) => (
                <span className={"label margin-r-5 "} style={{ backgroundColor: tag.color }}>
                  {tag.label}
                </span>
              ));
              break;
            case "actionPlan":
              item["icon"] = "fa-info";
              item["color"] = "bg-light-blue-active";
              item["content"] =
                item.userId.fName +
                " " +
                item.userId.lName +
                " " +
                t("TEXT_A_MODIFIÉ_LES_PLANS_DACTION");
              return;
            case "dueDate":
              item["color"] = "bg-olive-active";
              item["icon"] = "fa-clock";
              item["content"] =
                item.userId.fName + " " + item.userId.lName + " " + t("TEXT_A_MODIFIÉ_LA_DATE_LIMITE");
              return;
            default:
              item["icon"] = "fa-info";
              item["color"] = "bg-light-blue-active";
              item["content"] =
                item.userId.fName +
                " " +
                item.userId.lName +
                " " +
                t("TEXT_A_MODIFIÉ") +
                " " +
                item.changedKey;
          }
        else {
          switch (item.changedKey) {
            case "infraction":
              item["icon"] = "fa-info";
              item["color"] = "bg-light-blue-active";
              item["content"] =
                item.userId.fName +
                " " +
                item.userId.lName +
                " " +
                t("TEXT_A_MODIFIÉ") +
                " " +
                item.changedKey;
              break;
          }
        }
      });
    }
  }

  componentDidMount() {
    const id = this.props.newsId;
    if (id)
      this.setState({
        _id: id,
      });
    const { getChanges } = this.props;
    getChanges(id);
  }

  differentDay(d1, d2) {
    d1 = new Date(d1);
    d2 = new Date(d2);
    return (
      d1.getFullYear() !== d2.getFullYear() ||
      d1.getMonth() !== d2.getMonth() ||
      d1.getDate() !== d2.getDate()
    );
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
  formatTime(date) {
    let d = new Date(date),
      hours = "" + d.getHours(),
      minutes = "" + d.getMinutes();

    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;

    return [hours, minutes].join(":");
  }
  render() {
    if (!this.sortedChanges) return null;
    return (
      <Timeline>
        {this.sortedChanges.map((item, key, list) => (
          <span key={key}>
            {((key > 0 && this.differentDay(item["created"], list[key - 1]["created"])) ||
              key === 0) && (
              <TimeLineLabelItem className={"bg-purple"}>
                {this.formatDate(item.created)}
              </TimeLineLabelItem>
            )}
            {item.content && (
              <TimeLineItem
                iconClass={item.color}
                icon={item.icon}
                time={this.formatTime(item.created)}
                title={item.title}
              >
                {item.content && item.content}
              </TimeLineItem>
            )}
          </span>
        ))}
      </Timeline>
    );
  }
}
TimeLineComponent.defaultProps = {
  changes: [],
};
function mapStateToProps(state) {
  return {
    changes: state.data.changes,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getChanges: (id) => dispatch(NewsChanges(id).get()),
  };
}
export const escapedNewLineToLineBreakTag = (string) =>
  string.split("\n").map((item, index) => (index === 0 ? item : [<br key={index} />, item]));

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(TimeLineComponent));
