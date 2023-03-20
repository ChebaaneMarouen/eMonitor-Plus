import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form} from "reactstrap";

import "../tags.css";
const { Text } = Inputs;

class TagsForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
  }
  
  render() {
    const { t, item, onChange } = this.props;
    const { name, head_quarters} = item;
    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={onChange}
          name={"name"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_NAME") + ":"}
          placeholder={t("LABEL_NAME")}
          value={name}
        />
        <Text
            placeholder={t("LABEL_HEADQUARTERS")}
            iconLeft={"fa-user-shield"}
            value={head_quarters}
            sm={8}
            labelSm={4}
            label={t("LABEL_HEADQUARTERS") + ":"}
            name="head_quarters"
            onChange={onChange}
          />
      </Form>
    );
  }
}
export default withTranslation()(TagsForm);
