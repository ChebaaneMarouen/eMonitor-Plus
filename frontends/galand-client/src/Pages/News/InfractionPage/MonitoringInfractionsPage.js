import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import PropTypes from "prop-types";
import { Link } from "react-router-dom";
import { News, NewsChanges, TypedNews, infractionsFilePath } from "modules/ressources";
import InfractionWidget from "../SingleNews/components/InfractionWidget";
import FileComponent from "components/File";
import InfractionToPrint from "../SingleNews/components/InfractionToPrint";
import cliTruncate from 'cli-truncate';

// not this

const NEWS = TypedNews("projects", "", "projectsInfractions");

function mapStateToProps(state) {
  return {
    data: state.data.projectsInfractions,
    itemsCount: state.data.itemsCount,
    fromInfraction : true
    
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initFunction: () => {
      dispatch(
        NEWS.search(
          {
            filter: { "after_infraction.status": "1" },
            sort: [{}],
          },
          { page: 0, size: 10 }
        )
      );
      dispatch(NEWS.count({ filter: { "after_infraction.status": "1" } }));
    },
  };
}

const NewsCrudPage = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrudPage));

class MonitoringInfractionsPage extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };
  constructor(props) {
    super(props);
    this.state = {
      data: [],
    };
    this.change = this.change.bind(this);
    this.updateData = this.updateData.bind(this);
    this.getCurrentPage = this.getCurrentPage.bind(this);
    this.changeData = this.changeData.bind(this);
  }

  change(news, id) {
    const { UpdateSingleNews } = this.props;
    return (data) => {
      news["infraction"] = {
        ...news["infraction"],
        ...data,
      };
      news["actions"] = [];
      UpdateSingleNews(news, this.updateData(id));
      this.forceUpdate()
    };
  }

  getCurrentPage(e) {
    let { selected } = e;
    this.setState({ page: selected });
    this.props.filterNews(selected, this.state.text);
  }

  updateData(id) {
    setTimeout(() => {
      const { getChanges, getSingleNews } = this.props;
      if (id) {
        getSingleNews(id);
        getChanges(id);
      }
    }, 1000);
  }

  changeData(text) {
    this.setState({ text, page: 0 });
    let filter = text
      ? { filter: { "after_infraction.status": "1", all_text: text } }
      : { filter: { "after_infraction.status": "1" } };
    this.props.itemsCount(filter);
    this.props.filterNews(this.state.page, text);
  }

  getColumns(t) {
    return [
      {
        label: t("LABEL_MONITOR_NAME"),
        field: "creatorInfo",
        width : 100,
        getter: (news) =>(news.creatorInfo.fName + " " + news.creatorInfo.lName),
      },
      {
        label: t("INFRACTIONS_TITLE"),
        field: "title",
        width : 300,
        getter: (news) => (
          <Link to={"/news/" + news._id} /*fromPage={true}*/>
            {news.title}
          </Link>
        ),
      },
      {
        label: t("INFRACTIONS_STATUS"),
        field: "infractionStatus",
        width : 150,
        getter: (news) =>
          (news.infraction.status == 1 && (
            <span className={"label margin"} style={{ backgroundColor: "orange" }}>
              {t("INFRACTION_A_VALIDER")}
            </span>
          )) ||
          (news.infraction.status == 2 && (
            <span className={"label margin"} style={{ backgroundColor: "green" }}>
              {t("INFRACTION_VALIDE")}
            </span>
          )),
      },
      {
        label: t("INFRACTIONS_TYPE"),
        field: "infractionType",
        width : 100,
        getter: (news) => news.infraction.infractionType,
      },
      {
        label: t("INFRACTIONS_COMMENT"),
        field: "infractionComment",
        width : 300,
        getter: (news) => news.infraction.comment,
      },
      {
        label: t("LABEL_RESPONSIBLE"),
        field: "responsible",
        width : 100,
        getter: (news) => news.infraction.responsible,
      },
      {
        label: t("LABEL_INFRACTION_DATE"),
        field: "infraction_date",
        width : 100,
        getter: (news) => news.infraction.infraction_date,
      },
      {
        label: t("LABEL_CREATION_DATE"),
        field: "createdAt",
        width : 100,
        getter: (news) => new Date(news.infraction.createdAt),
      },
      {
        label: t("LABEL_PREUVES"),
        field: "files",
        width : 200,
        getter: (news) =>
          news.infraction.files.map((fileItem) => (
            <FileComponent file={fileItem} key={fileItem.serverId} staticPath={infractionsFilePath} />
          )),
      },
      {
        label: t("LABEL_LINK"),
        field: "link",
        width : 200,
        getter: (news) => (
          <a style={{ display: "table-cell" }} target="_blank" href={news.infraction.link}>
            {cliTruncate(news.infraction.link,30)}
          </a>
        ),
      },
      {
        label: t("CONFIRMATION_COMMENT"),
        field: "confirmComment",
        width : 200,
        getter: (news) => news.infraction.confirmComment,
      },
      {
        label: t("LABEL_ACTIONS"),
        width : 100,
        field: "actions",
        sort: "disabled",
      },
    ];
  }

  render() {
    const { t, news, permission } = this.props;
    return (
      <div>
        <NewsCrudPage
          title={t("TITLE_INFRACTIONS_PAGE")}
          browserTitle={t("TITLE_INFRACTIONS_PAGE")}
          columns={this.getColumns(t)}
          t={t}
          getCurrentPage={this.getCurrentPage}
          data={news}
          displayEntries={false}
          changeData={this.changeData}
          permission={permission}
          page={this.state.page}
          printable={true}
          additionalActions={[
            (item) => (
              <InfractionWidget
                monitor={item.monitor}
                infraction={item.infraction}
                updateInfraction={this.change(item, item._id)}
                fromPage={true}
              />
            ),
            (item) => <InfractionToPrint news={item} t={t} />,
          ]}
        />
      </div>
    );
  }
}
MonitoringInfractionsPage.propTypes = {
  className: PropTypes.string,
  news: PropTypes.arrayOf(PropTypes.object),
};

MonitoringInfractionsPage.defaultProps = {
  news: [],
  permissions: {},
  items: 0,
};

function mapDispatchToProps2(dispatch) {
  return {
    UpdateSingleNews: (news, cb) => dispatch(News.update(news, cb)),
    getSingleNews: (id) => dispatch(News.getOne(id, "singleNews")),
    getChanges: (id) => dispatch(NewsChanges(id).get()),
    filterNews: (page, text = "") =>
      dispatch(
        NEWS.search(
          {
            filter: { "after_infraction.status": "1", all_text: text },
            sort: [{}],
          },
          { page, size: 10 }
        )
      ),
    itemsCount: (filter) => dispatch(NEWS.count(filter)),
  };
}

function mapStateToProps2(state) {
  return {
    permissions: state.persistedData.permissions,
    news: state.data.projectsInfractions,
    items: state.data.itemsCount,
  };
}

export default withTranslation()(
  connect(mapStateToProps2, mapDispatchToProps2)(MonitoringInfractionsPage)
);
