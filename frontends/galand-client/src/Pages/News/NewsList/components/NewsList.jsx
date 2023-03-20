import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TypedNews, Tags } from "modules/ressources";
import { Box, Col } from "adminlte-2-react";
import { Link } from "react-router-dom";
import FileComponent from "components/File";
import { getKeyByValue, NewsStateENum, PrioriteEnum, ImpactEnum } from "Enums";
import Label from "reactstrap/es/Label";
import Tag from "components/Tags";
import "../../News.css";
import CoverImage from "../../components/CoverImage";
import { newsFilePath } from "modules/ressources";

class NewsList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      news : []
    }
  }

  componentDidMount() {
    const { getTags, getNews, type, projectId, news } = this.props;
    getTags();
    getNews(type, projectId);
    this.setState({
      news
    })
  }
  componentDidUpdate(prevProps){
    if(this.props.news !== prevProps.news){
      this.setState({
        news : this.props.news
      })
    }
  }
  static formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }

  render() {
    let { t, permissions } = this.props;
    let {news } = this.props;

    return (
      news.length != 0 &&
      news.map((item) => (
        <Box
          collapsed={true}
          collapsable={true}
          className={"box-header-100-px box-body-500-px box-footer-70-p special-col"}
          border={true}
          type={getKeyByValue(NewsStateENum, item.status, null, null, "key")}
          header={
            <div>
              <h4 className={"text-center text-lg article-title"}>
                <Link to={"/news/" + item._id} className="article-title">
                  {item.title || t("TEXT_NO_TITLE")}
                </Link>
              </h4>
              <span className={"label margin-r-5 label-info label-output"}>
                {t(NewsStateENum[item.status])}
              </span>
              {item.priority ? (
                <span key={"priority"} className={"label margin-r-5 label-" + item.priority}>
                  {t("LABEL_PRIORITÉ")}
                  {t(getKeyByValue(PrioriteEnum, item.priority, null, null, "label"))}
                </span>
              ) : (
                <span className={"label margin-r-5 label-default"}>{t("TEXT_PAS_DE PRIORITÉ")}</span>
              )}
              {item.impact ? (
                <span key={"impact"} className={"label margin-r-5 label-" + item.impact}>
                  {t("LABEL_IMPACT")} {t(getKeyByValue(ImpactEnum, item.impact, null, null, "label"))}
                </span>
              ) : (
                <span className={"label margin-r-5 label-default"}>{t("TEXT_PAS_DIMPACT")}</span>
              )}
              <br />
              <br/>
              <span
                key={"time"}
                className={"text-muted text-sm pull-right"}
                style={{ paddingTop: "5px" }}
              >
                {NewsList.formatDate(item.created)}
              </span>
              <span
                key={"creator"}
                className={"text-muted text-sm pull-left"}
                style={{ paddingTop: "5px" }}
              >
                {item.creatorInfo.fName + " " + item.creatorInfo.lName}
              </span>
            </div>
          }
          footer={
            permissions["P_TAGS"] && item.categories.length
              ? [item.subjects.map((tag) => <Tag tag={tag} key={tag} />)].concat([
                  item.categories.map((tag) => <Tag tag={tag} key={tag} />),
                ])
              : t("MISSING_TAGS_PERMISSION")
          }
        >
          <CoverImage news={item} />
          <hr className={"divider"} />
          <Label>{t("LABEL_DESCRIPTION")}</Label>
          <p className={"text-muted"}>{item.text}</p>
          <hr className={"divider"} />
          {item.files.length != 0 && (
            <>
              <Label>{t("LABEL_PREUVES")}</Label>
              <div>
                {item.files.map((fileItem) => (
                  <FileComponent file={fileItem} key={fileItem.serverId} staticPath={newsFilePath} />
                ))}
              </div>
            </>
          )}
        </Box>
      ))
    );
  }
}

NewsList.propTypes = {
  className: PropTypes.string,
  news: PropTypes.arrayOf(PropTypes.object),
  projectId: PropTypes.string,
};

NewsList.defaultProps = {
  news: [],
  projectId: "",
};

function mapStateToProps(state, ownProps) {
  return {
    news: ownProps.news || state.data.news,
    permissions: state.persistedData.permissions,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNews: (type, projectId) => dispatch(TypedNews(type, projectId).get()),
    getTags: () => dispatch(Tags.get()),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(NewsList));
