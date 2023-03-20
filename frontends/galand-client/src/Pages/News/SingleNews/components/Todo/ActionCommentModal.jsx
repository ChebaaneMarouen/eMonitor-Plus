import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs, Button } from "adminlte-2-react";
import { Form } from "reactstrap";
import MyModal from "@shared/Components/MyModal";

const { Text } = Inputs;

class ActionCommentModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(toggleModal) {
    const { onSubmit } = this.props;
    onSubmit(this.state, toggleModal);
  }

  onChange(e) {
    const { value, name } = e.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const { comment } = this.state;
    const { actionButton, t } = this.props;
    return (
      <MyModal
        button={actionButton}
        submitText={t("BTN_CONFIRMER")}
        submit={this.submit}
        title={t("TITLE_LAISSER_UN_FEEDBACK")}
      >
        <Form className={"form-horizontal"}>
          <Text
            onChange={this.onChange}
            name="comment"
            labelClass={"required"}
            inputType="textarea"
            iconLeft={"fa-at"}
            sm={8}
            labelSm={4}
            label={t("LABEL_FEEDBACK")+":"}
            placeholder={t("LABEL_LAISSER_UN_FEEDBACK")}
            value={comment}
          />
        </Form>
      </MyModal>
    );
  }
}

export default withTranslation()(ActionCommentModal);
