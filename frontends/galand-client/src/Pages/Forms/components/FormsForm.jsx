import "./FormsForm.css";
import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import InputGroupForm from "./InputGroupForm";
import Upload from "@shared/Components/Upload";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import { Inputs } from "adminlte-2-react";
import Select from "components/Select";
import { Form } from "reactstrap";
import { trainingPath } from "modules/ressources";
import { FormEnum } from "Enums";
const { Text } = Inputs;

class FormsForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);
    this.isUpdate = this.isUpdate.bind(this);
  }

  isUpdate() {
    const { item } = this.props;
    return Boolean(item._id);
  }

  render() {
    const { t, item, onChange } = this.props;
    const { name, theme, title, inputs } = item;
    console.log("inputs", inputs)
    return (
      <Form className={"form-horizontal"} 
      onDragOver={(e)=>e.preventDefault()}>
        <Text
          onChange={this.props.onChange}
          name={"name"}
          labelClass={"required"}
          sm={8}
          labelSm={4}
          label={t("LABEL_NAME") + ":"}
          placeholder={t("LABEL_NAME")}
          value={name || ""}
          disabled={this.isUpdate()}
        />
        <Text
          onChange={this.props.onChange}
          name={"theme"}
          labelClass={"required"}
          sm={8}
          labelSm={4}
          label={t("LABEL_THEME") + ":"}
          placeholder={t("LABEL_THEME")}
          value={theme || ""}
        />
        <Text
          onChange={this.props.onChange}
          name={"title"}
          labelClass={"required"}
          sm={8}
          labelSm={4}
          label={t("LABEL_TITLE") + ":"}
          placeholder={t("LABEL_TITLE")}
          value={title || ""}
        />
        <ClonableInputs
          maxElements={100}
          minElements={0}
          initButtonText={t("BTN_ADD_INPUT_GROUP")}
          value={inputs}
          name="inputs"
          defaultValue={{ options: [null] }}
          onChange={onChange}
          className="DynamicForm"
        >
          <InputGroupForm />
        </ClonableInputs>
      </Form>
    );
  }
}
FormsForm.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired
};
FormsForm.defaultProps = {
  item: {}
};

export default withTranslation()(FormsForm);
