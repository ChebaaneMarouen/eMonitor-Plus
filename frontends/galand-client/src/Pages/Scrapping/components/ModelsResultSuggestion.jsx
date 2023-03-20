import React, { Component } from "react";
import PropTypes from "prop-types";
import MyModal from "@shared/Components/MyModal";
import { withTranslation } from "react-i18next";
import { Button, Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
const { Text } = Inputs;

class ModelsResultSuggestion extends Component {
  constructor(props) {
    super(props);
    this.state = {
      prediction: props.prediction
    };
    this.submit = this.submit.bind(this);
  }
  submit(toggle) {
    toggle();
    const { submit } = this.props;
    submit(this.state.prediction);
  }

  onChange = e => {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  };

  render() {
    const { t } = this.props;
    const { prediction } = this.state;
    return (
      <MyModal
        button={<Button size="xs" type="info" text={prediction} />}
        title={t("TITLE_SUGGEST_PREDICTION")}
        inline
        submitText={t("BTN_SUBMIT")}
        submitType={"success"}
        submit={this.submit}
      >
        <Form className={"form-horizontal"}>
          <Text
            name={"prediction"}
            iconLeft={"fa-pen"}
            value={prediction}
            onChange={this.onChange}
            sm={8}
            labelSm={4}
            label={t("LABEL_SUGGESTION") + ":"}
            placeholder={t("LABEL_SUGGESTION")}
          />
        </Form>
      </MyModal>
    );
  }
}

ModelsResultSuggestion.defaultProps = {
  t: String
};

ModelsResultSuggestion.propTypes = {
  prediction: PropTypes.string.isRequired,
  submit: PropTypes.func.isRequired,
  t: PropTypes.func
};

export default withTranslation()(ModelsResultSuggestion);
