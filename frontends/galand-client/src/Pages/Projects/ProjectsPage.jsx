import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import ProjectForm from "./components/ProjectForm";
import { Projects } from "modules/ressources";
import { Medias, Monitors, CustomSearch, FormRessource } from "modules/ressources";
import { Link } from "react-router-dom";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function mapStateToProps(state) {
  return {
    data: state.data.projects,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initFunction: () => {
      dispatch(Projects.get());
      dispatch(Medias.get());
      dispatch(Monitors.get());
      dispatch(CustomSearch.get());
      dispatch(FormRessource.get());
    },
    insert: (data, toggleModal) =>
      dispatch(
        Projects.insert(data, (err) => {
          if (!err) toggleModal();
        })
      ),
    remove: (project) => dispatch(Projects.remove(project)),
    update: (data, toggleModal) =>
      dispatch(
        Projects.update(data, (err) => {
          if (!err) toggleModal();
        })
      ),
  };
}

const ProjectsCrudPage = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrudPage));

class ProjectsPage extends Component {
  constructor(props) {
    super(props);
  }

  getColumns(t) {
    return [
      {
        label: t("LABEL_TITLE"),
        field: "title",
        sort: "asc",
        getter: (prj) => <Link to={"/projects/" + prj._id}>{prj.title}</Link>,
      },
      {
        label: t("LABEL_THÉME"),
        field: "theme",
      },
      {
        label: t("LABEL_STATUS"),
        field: "status",
        getter: (prj) =>
          prj.endProject < Date.now()
            ? `${t("PROJECT_CLOSED")} (${new Date(prj.endProject).toLocaleString(
                this.props.lang == "ar" ? "fr" : this.props.lang
              )})`
            : new Date(prj.endProject).toLocaleString(this.props.lang == "ar" ? "fr" : this.props.lang),
      },
      {
        label: t("LABEL_ACTIONS"),
        field: "actions",
        sort: "disabled",
      },
    ];
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <ProjectsCrudPage
          title={t("TITLE_GESTION_DES_PROJETS")}
          browserTitle={t("TITLE_GESTION_DES_PROJETS")}
          columns={this.getColumns(t)}
          Form={ProjectForm}
          t={t}
          permission={this.props.permission}
          addTitle={t("BTN_AJOUTER")}
        />
      </div>
    );
  }
}

mapStateToProps = (state) => {
  return {
    lang: state.persistedData.lang,
  };
};

export default withTranslation()(connect(mapStateToProps, null)(ProjectsPage));
