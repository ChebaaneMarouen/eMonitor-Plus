import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";
import TodoForm from "./TodoForm";

class AddActionModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
  }
  submit(toggleModal) {
    this.props.onSubmit(toggleModal);
  }
  render() {
    const { t, lang } = this.props;
    return (
      <MyModal
        className={this.props.className}
        button={
          <Button
            block={false}
            pullRight={lang === "ar" ? false : true}
            pullLeft={lang === "ar" ? true : false}
            icon={"fa-plus"}
            type="success"
            text={t("BTN_AJOUTER_UNE_ACTION")}
          />
        }
        submitText={t("BTN_AJOUTER")}
        title={t("TITLE_AJOUTER_LACTION")}
        submit={this.submit}
      >
        <TodoForm {...this.props} />
      </MyModal>
    );
  }
}

export default withTranslation()(AddActionModal);
