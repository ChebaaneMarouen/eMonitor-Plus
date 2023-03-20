import React, { Component } from "react";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
const { Text } = Inputs;

class ModelsParametersForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { parameters, modelParameters, onChange } = this.props;
    return (
      <div>
        {Object.keys(modelParameters).map(key => {
          const parameterConfig = modelParameters[key];
          return (
            <Text
              key={key}
              onChange={onChange}
              name={key}
              iconLeft={"fa-pen"}
              sm={8}
              labelSm={4}
              label={parameterConfig.label}
              placeholder={parameterConfig.description}
              title={parameterConfig.description}
              value={parameters[key] || parameterConfig.defaultValue}
            />
          );
        })}
      </div>
    );
  }
}

ModelsParametersForm.defaultProps = {
  parameters: {}
};
export default ModelsParametersForm;
