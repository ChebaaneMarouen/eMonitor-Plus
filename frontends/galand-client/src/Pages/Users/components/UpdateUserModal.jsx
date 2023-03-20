import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";
import { User } from "modules/ressources";
import UserForm from "./UserFrom";

class UpdateUserModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    let { user } = this.props;
    this.state = { ...user };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(toggleModal) {
    const { onSubmit } = this.props;
    console.log(this.state);
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
        className={"inline"}
        button={
          <Button
            onClick={() => this.openModal(false)}
            className={"margin-r-5"}
            size={"xs"}
            icon={"fa-user-edit"}
            type="warning"
          />
        }
        submitText={t("BTN_MODIFIER")}
        submitType={"warning"}
        submit={this.submit}
        title={t("BTN_MODIFIER_UTILISATEUR") + " " + this.state.email}
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
        User.update(data, err => {
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
  )(UpdateUserModal)
);
