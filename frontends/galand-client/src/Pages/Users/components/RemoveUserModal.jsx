import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import SweetAlert from "sweetalert-react";
import { User } from "modules/ressources";

class RemoveUserModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      showAlertConfirm: false
    };
  }

  render() {
    const { user, removeUser, t } = this.props;
    const { email } = this.props.user;
    return (
      <div className={"inline"}>
        <Button
          onClick={() => this.setState({ showAlertConfirm: true })}
          className={"margin-r-5"}
          size={"xs"}
          icon={"fa-trash"}
          type="danger"
        />
        <SweetAlert
          showCancelButton
          show={this.state.showAlertConfirm}
          title={t("TITLE_CETTE_ACTION_EST_IRRÉVERSIBLE")}
          text={t("TEXT_ÊTES-VOUS_SÛR_DE_VOULOIR_SUPPRIMER_") + email + " ?"}
          type="warning"
          confirmButtonText={t("BTN_CONFIRMER")}
          cancelButtonText={t("BTN_ANNULER")}
          confirmButtonColor="#00a65a"
          onCancel={() => {
            this.setState({ showAlertConfirm: false });
          }}
          onConfirm={() => {
            removeUser(user);
            this.setState({ showAlertConfirm: false });
          }}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeUser: user => dispatch(User.remove(user))
  };
}
export default withTranslation()(
  connect(
    null,
    mapDispatchToProps
  )(RemoveUserModal)
);
