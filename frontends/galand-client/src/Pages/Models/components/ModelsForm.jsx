import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import Select from "components/Select";
import PropTypes from "prop-types";
import ModelsParametersForm from "./ModelsParametersForm";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
const { Text } = Inputs;

class ModelsForm extends Component {
  constructor(props) {
    super(props);
    this.onParameterChange = this.onParameterChange.bind(this);
    this.getModelsParameters = this.getModelsParameters.bind(this);
    this.onClassificationChange = this.onClassificationChange.bind(this);
    this.onClassificationChange = this.onClassificationChange.bind(this);
  }

  onParameterChange(e) {
    const { onChange, item } = this.props;
    const { name, value } = e.target;
    const parameters = item.parameters || {};
    onChange({
      target: {
        name: "parameters",
        value: {
          ...parameters,
          [name]: value
        }
      }
    });
  }

  isUpdate() {
    const { item } = this.props;
    return Boolean(item._id);
  }

  onClassificationChange(e) {
    // change classificationInfo according to select
    const { classifications, onChange } = this.props;
    const { value } = e.target;
    if (value) {
      // get target classiation based on value
      const classificationInfo = classifications.filter(
        classification => classification.name === value
      )[0];
      if (classificationInfo) {
        onChange({
          target: {
            name: "classificationName",
            value: value
          }
        });
        onChange({
          target: {
            name: "classificationInfo",
            value: classificationInfo
          }
        });
      }
    }
  }

  getModelsParameters(image) {
    const { modelsConfig } = this.props;
    const modelConfig = modelsConfig.filter(mc => mc.image === image)[0];
    if (modelConfig) return modelConfig.parameters;
    return {};
  }

  render() {
    const { t, item, classifications, modelsConfig, onChange } = this.props;
    const { name, classificationName, target, image, parameters } = item;
    const modelParameters = this.getModelsParameters(image);
    return (
      <Form className={"form-horizontal"}>
        <input type="hidden" value="classification" name="source"/>
        <Text
          onChange={this.props.onChange}
          name={"name"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_NAME") + ":"}
          placeholder={t("LABEL_NAME")}
          value={name || ""}
          disabled={this.isUpdate()}
        />

        <Text
          onChange={this.props.onChange}
          name={"target"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_TARGET") + ":"}
          placeholder={t("LABEL_TARGET")}
          value={target}
        />
        <Select
          placeholder={t("LABEL_CLASSIFICATION")}
          iconLeft={"fab-searchengin"}
          name="classificationName"
          onChange={this.onClassificationChange}
          sm={12}
          labelSm={0}
          value={classificationName}
          options={classifications.map(v => ({
            value: v.name,
            label: v.name
          }))}
        />
        <Select
          placeholder={t("LABEL_MODEL")}
          iconLeft={"fab-searchengin"}
          name="image"
          onChange={onChange}
          sm={12}
          labelSm={0}
          value={image}
          options={modelsConfig.map(v => ({
            value: v.image,
            label: v.name
          }))}
        />
        <ModelsParametersForm
          onChange={this.onParameterChange}
          parameters={parameters}
          modelParameters={modelParameters}
        />
      </Form>
    );
  }
}

ModelsForm.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  modelsConfig: PropTypes.array,
  classifications: PropTypes.array
};
ModelsForm.defaultProps = {
  item: {},
  modelsConfig: [],
  classifications: []
};

function mapStateToProps(state) {
  return {
    modelsConfig: state.data.modelsConfig,
    classifications: state.data.classifications
  };
}
export default withTranslation()(connect(mapStateToProps)(ModelsForm));
