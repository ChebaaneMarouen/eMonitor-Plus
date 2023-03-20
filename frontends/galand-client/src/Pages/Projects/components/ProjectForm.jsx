import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Select from "components/Select";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
import { connect } from "react-redux";
const { Text, DateTime } = Inputs;

class ProjectsForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);
  }

  render() {
    const {
      t,
      onChange,
      monitors,
      definedDictionaries,
      definedCustomDictionaries,
      definedCustomSearches,
      definedForms,
      item,
      medias,
      definedModels
    } = this.props;
    const {
      title,
      theme,
      startProject,
      media,
      endProject,
      customDictionaries,
      customSearches,
      dictionaries,
      assignees,
      models,
      forms,
      _id
    } = item;

    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={this.props.onChange}
          name={"title"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_TITLE") + ":"}
          placeholder={t("LABEL_TITLE")}
          value={title}
        />
        <Text
          onChange={this.props.onChange}
          name={"theme"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_THÉME")}
          placeholder={t("LABEL_THÉME")}
          value={theme}
        />

        <DateTime
          iconLeft={"far-calendar"}
          small={true}
          startDate={"01/01/2019"}
          timeFormat={"HH:mm"}
          sm={8}
          labelSm={4}
          label={t("LABEL_DÉBUT_PROJECT")}
          onChange={d => {
            onChange({
              target: { name: "startProject", value: d.valueOf() }
            });
          }}
          name="startProject"
          placeholder={t("LABEL_DÉBUT_PROJECT")}
          value={startProject}
        />
        <DateTime
          iconLeft={"far-calendar"}
          small={true}
          startDate={"01/01/2019"}
          timeFormat={"HH:mm"}
          sm={8}
          labelSm={4}
          label={t("LABEL_FIN_PROJECT")}
          onChange={d => {
            onChange({
              target: { name: "endProject", value: d.valueOf() }
            });
          }}
          name="endProject"
          placeholder={t("LABEL_FIN_PROJECT")}
          value={endProject}
        />
        <Select
          placeholder={t("LABEL_MÉDIAS")}
          iconLeft={"fab-searchengin"}
          name="media"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_MÉDIAS")}
          multiple={true}
          value={media}
          options={medias.map(m => ({ label: m.name, value: m._id }))}
        />
        <Select
          placeholder={t("LABEL_DICTIONAIRES")}
          iconLeft={"fab-searchengin"}
          name="dictionaries"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_DICTIONAIRES")}
          multiple={true}
          value={dictionaries}
          options={definedDictionaries.map(m => ({
            label: m.name,
            value: m._id
          }))}
        />
        <Select
          placeholder={t("LABEL_CUSTOM_SEARCHES")}
          iconLeft={"fab-searchengin"}
          name="customSearches"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_CUSTOM_SEARCHES")}
          multiple={true}
          value={customSearches}
          options={definedCustomSearches.map(m => ({
            label: m.name,
            value: m._id
          }))}
        />
        <Select
          placeholder={t("LABEL_CUSTOM_DICTIONAIRES")}
          iconLeft={"fab-searchengin"}
          name="customDictionaries"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_CUSTOM_DICTIONAIRES")}
          multiple={true}
          value={customDictionaries}
          options={definedCustomDictionaries.map(m => ({
            label: m.name,
            value: m._id
          }))}
        />
        <Select
          placeholder={t("LABEL_MODELS")}
          iconLeft={"fa-computer"}
          name="models"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_MODELS")}
          multiple={true}
          value={models}
          options={definedModels.map(m => ({
            label: m.name,
            value: m._id
          }))}
        />
        <Select
          placeholder={t("LABEL_FORMS")}
          iconLeft={"fa-left-align"}
          name="forms"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_FORMS")}
          multiple={true}
          value={forms}
          options={definedForms.map(m => ({
            label: m.name,
            value: m.name
          }))}
        />
        <Select
          placeholder={t("LABEL_MONITORS")}
          iconLeft={"fab-searchengin"}
          name="assignees"
          onChange={onChange}
          sm={8}
          labelSm={4}
          label={t("LABEL_MONITORS")}
          multiple={true}
          value={assignees}
          options={monitors.map(monitor => ({
            label: monitor.fName + " " + monitor.lName,
            value: monitor._id
          }))}
        />
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    medias: state.data.medias,
    definedModels: state.data.models,
    monitors: state.data.monitors,
    definedDictionaries: state.data.dictionaries,
    definedCustomDictionaries: state.data.customDictionaries,
    definedCustomSearches: state.data.customSearches,
    definedForms: state.data.forms
  };
}

ProjectsForm.propTypes = {
  className: PropTypes.string,
  medias: PropTypes.array,
  models: PropTypes.array,
  definedDictionaries: PropTypes.array,
  definedCustomDictionaries: PropTypes.array,
  definedCustomSearches: PropTypes.array,
  definedForms: PropTypes.array
};

ProjectsForm.defaultProps = {
  medias: [],
  models: [],
  definedDictionaries: [],
  definedCustomDictionaries: [],
  definedModels: [],
  definedCustomSearches: [],
  definedForms: []
};
export default withTranslation()(
  connect(
    mapStateToProps,
    null
  )(ProjectsForm)
);
