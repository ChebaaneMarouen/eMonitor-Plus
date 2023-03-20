import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TypedNews, Tags } from "modules/ressources";
import { Box, Col, Row } from "adminlte-2-react";
import { Link } from "react-router-dom";
import {
  getKeyByValue,
  NewsStateENum,
  NewsTypeEnum,
  PrioriteEnum,
  ImpactEnum,
} from "Enums";
import Label from "reactstrap/es/Label";
import Tag from "components/Tags";
import "../../News.css";

class NewsList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { getTags, getNews, type } = this.props;
    getTags();
    getNews(type);
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
    let { news, t } = this.props;

    return news.map((item) => (
      <Col key={item._id} sm={12} md={this.props.displayType}>
        <Box
          collapsed={true}
          collapsable={true}
          className={"box-header-100-px box-body-500-px box-footer-70-px"}
          border={true}
          type={getKeyByValue(NewsStateENum, item.status, null, null, "key")}
          header={
            <div>
              <h4 className={"text-center text-lg"}>
                <Link to={"/news/" + item._id}>
                  {item.title || t("TEXT_NO_TITLE")}
                </Link>
              </h4>
              {item.priority ? (
                <span
                  key={"priority"}
                  className={"label margin-r-5 label-" + item.priority}
                >
                  {t("PRIORITY")}
                  {t(
                    getKeyByValue(
                      PrioriteEnum,
                      item.priority,
                      null,
                      null,
                      "label"
                    )
                  )}
                </span>
              ) : (
                <span className={"label margin-r-5 label-default"}>
                  {t("TEXT_PAS_DE_PRIORITÉ")}
                </span>
              )}
              {item.impact ? (
                <span
                  key={"impact"}
                  className={"label margin-r-5 label-" + item.impact}
                >
                  {t("LABEL_IMPACT")}
                  {t(
                    getKeyByValue(ImpactEnum, item.impact, null, null, "label")
                  )}
                </span>
              ) : (
                <span className={"label margin-r-5 label-default"}>
                  {t("TEXT_PAS_DIMPACT")}
                </span>
              )}

              <span key={"time"} className={"text-muted text-sm pull-right"}>
                {NewsList.formatDate(item.created)}
              </span>
            </div>
          }
          footer={[
            item.subjects.map((tag) => <Tag tag={tag} key={tag} />),
          ].concat([item.categories.map((tag) => <Tag tag={tag} key={tag} />)])}
        >
          {item.newsType === NewsTypeEnum.PRESSE ? (
            <iframe
              title={item.title}
              src={item.link}
              width="100%"
              style={{ Border: "none", Overflow: "hidden" }}
              allow="encrypted-media"
            />
          ) : null}
          <hr className={"divider"} />
          <Label>{t("LABEL_DESCRIPTION")}</Label>
          <p className={"text-muted"}>{item.text}</p>
          <Row>
            {item.files.map((fileItem) => (
              <Col md={4} sm={6} key={"img-" + fileItem}>
                <img
                  key={fileItem}
                  className="img-thumbnail"
                  src={fileItem}
                  alt={item.title}
                />
              </Col>
            ))}
          </Row>
        </Box>
      </Col>
    ));
  }
}

NewsList.propTypes = {
  className: PropTypes.string,
  news: PropTypes.arrayOf(PropTypes.object),
};

NewsList.defaultProps = {
  news: [],
};

function mapStateToProps(state) {
  return {
    news: state.data.news,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNews: (type) => dispatch(TypedNews(type).get()),
    getTags: () => dispatch(Tags.get()),
  };
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(NewsList)
);
