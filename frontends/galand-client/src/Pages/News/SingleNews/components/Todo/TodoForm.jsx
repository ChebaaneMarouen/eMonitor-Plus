import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
import "./Todo.css";
import { ImportanceEnum } from "Enums";
import Select from "components/Select";
const { Text } = Inputs;
class TodoForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
  }

  render() {
    const { t } = this.props;
    return (
      <Form className={"form-horizontal"}>
        <Text
          name={"title"}
          onChange={this.props.onChange}
          value={this.props.currentAction.title || ""}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          placeholder={t("LABEL_TITLE")}
          sm={8}
          labelSm={4}
          label={t("LABEL_TITLE") + ":"}
        />
        <Select
          name={"importance"}
          onChange={this.props.onChange}
          value={this.props.currentAction.importance}
          labelClass={"required "}
          placeholder={t("LABEL_IMPORTANCE")}
          iconLeft={"fa-exclamation"}
          options={Object.values(ImportanceEnum)
            .filter(v => v.label)
            .map(v => ({
              label: t(v.label),
              value: v.value
            }))}
          sm={8}
          labelSm={4}
          label={t("LABEL_IMPORTANCE") + ":"}
        />

        <Text
          name={"additionalInfo"}
          onChange={this.props.onChange}
          value={this.props.currentAction.additionalInfo || ""}
          labelClass={"required"}
          sm={8}
          labelSm={4}
          placeholder={t("LABEL_COMMUNIQUÉ_CONSOLIDÉ")}
          label={t("LABEL_COMMUNIQUÉ_CONSOLIDÉ") + ":"}
          rows={4}
          inputType={"textarea"}
        />
      </Form>
    );
  }
}
export default withTranslation()(TodoForm);
