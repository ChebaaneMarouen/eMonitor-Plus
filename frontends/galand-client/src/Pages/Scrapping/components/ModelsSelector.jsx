import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Form, FormGroup, Input, Label } from "reactstrap";

class ModelsSelector extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { models, selected, t, onChange } = this.props;
    if (!models.length) return <h4> {t("MESSAGE_NO_MODELS_DEFINED")}</h4>;
    return (
      <Form>
        {models.map(model => {
          const isSelected = selected.indexOf(model._id) >= 0;
          const onChangeValue = isSelected
            ? selected.filter(id => id !== model._id)
            : [model._id].concat(selected);
          return (
            <FormGroup check>
              <Label check>
                <Input
                  type="checkbox"
                  value={isSelected}
                  onChange={() =>
                    onChange({
                      target: { name: "models", value: onChangeValue }
                    })
                  }
                  name={model._id}
                />
                {model.name} ({new Date(model.created).toLocaleDateString()})
              </Label>
            </FormGroup>
          );
        })}
      </Form>
    );
  }
}

ModelsSelector.propTypes = {
  models: PropTypes.arrayOf(PropTypes.object),
  selected: PropTypes.arrayOf(PropTypes.string),
  t: PropTypes.func,
  onChange: PropTypes.func.isRequired
};

ModelsSelector.defaultProps = {
  models: [],
  selected: [],
  t: String
};

function mapStateToProps(state) {
  return {
    models: state.data.models
  };
}
export default withTranslation()(connect(mapStateToProps)(ModelsSelector));
