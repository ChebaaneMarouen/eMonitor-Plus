import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Select from "components/Select";
import { connect } from "react-redux";
import { Button, Row } from "adminlte-2-react";
import { CustomSearch, Projects } from "modules/ressources";

class ProjectSelector extends Component {
  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
    this.clearProject = this.clearProject.bind(this);
  }

  componentDidMount() {
    const { getProjects, getCustomSearches } = this.props;
    getProjects();
    getCustomSearches();
  }

  clearProject() {
    const { selectProject } = this.props;
    selectProject({
      project: "",
      models: [], // clear models
      filter: {},
    });
  }

  getFirstCustomSearch(id) {
    let cs = this.props.customSearches.filter((el) => el._id == id);
    console.log(cs[0].search);
    return cs[0].search;
  }

  onChange(e) {
    const { value } = e.target;
    const { selectProject } = this.props;
    selectProject({ project: value });
    // if there's a custom search assigned to the project
    if (value.customSearches[0]) {
      let filter = this.getFirstCustomSearch(value.customSearches[0]);
      console.log({ ...filter, models: value.models });
      selectProject({ ...filter, models: value.models });
    } else if (value) {
      selectProject({
        filter: {
          multi_media: value.media,
          after_created: value.startProject ? value.startProject : "",
          before_created: value.endProject ? value.endProject : "",
        },
        models: value.models,
      });
    }
  }

  render() {
    const { t, projects, project } = this.props;
    const options = projects.map((pj) => ({ label: pj.title, value: pj }));
    const resetButton = project ? (
      <Button text={t("BTN_CLEAR_PROJECT")} onClick={this.clearProject} type="danger" />
    ) : null;

    return (
      <Row>
        <Select
          name="customSearch"
          onChange={this.onChange}
          options={options}
          value={project}
          labelSm={0}
          sm={12}
          placeholder={t("LABEL_SELECT_PROJECT")}
          buttonRight={resetButton}
        />
      </Row>
    );
  }
}

ProjectSelector.propTypes = {
  projects: PropTypes.array,
  projectId: PropTypes.oneOfType([PropTypes.string, PropTypes.oneOf([null, undefined])]),
  customSearches: PropTypes.array,
};
ProjectSelector.defaultProps = {
  projects: [],
  projectId: "",
  customSearches: [],
};

function mapStateToProps(state) {
  return {
    projects: state.data.projects,
    customSearches: state.data.customSearches,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getProjects: () => dispatch(Projects.get()),
    getCustomSearches: () => dispatch(CustomSearch.get()),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ProjectSelector));
