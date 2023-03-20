import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";
import UserForm from "./UserFrom";
import { User } from "modules/ressources";

class AddUserModal extends Component {
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
    const { t } = this.props;
    return (
      <MyModal
        button={
          <Button
            block={true}
            pullRight={true}
            icon={"fa-user-plus"}
            type="success"
            text={t("BTN_AJOUTER_UN_UTILISATEUR")}
          />
        }
        submitText={t("BTN_AJOUTER")}
        submit={this.submit}
        title={t("BTN_AJOUTER_UN_UTILISATEUR")}
      >
        <UserForm onChange={this.onChange} user={this.state} />
      </MyModal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (data, toggleModal) =>
      dispatch(
        User.insert(data, err => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      )
  };
}
export default withTranslation()(
  connect(
    null,
    mapDispatchToProps
  )(AddUserModal)
);
