import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import SweetAlert from "sweetalert-react";
import { User } from "modules/ressources";
import { getKeyByValue, RolesEnum, UserStatusEnum } from "../../../Enums";

class BanUserModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      ...this.props.user,
      status:
        this.props.user.status === UserStatusEnum.BANNED.label
          ? UserStatusEnum.ACTIVE.value
          : UserStatusEnum.BANNED.value,
      roles: getKeyByValue(
        RolesEnum,
        null,
        this.props.user.roles,
        null,
        "value"
      ),
      showAlertConfirm: false
    };
    console.log(this.state);
    this.submit = this.submit.bind(this);
  }
  submit() {
    const { onSubmit } = this.props;
    onSubmit(this.state);
  }
  render() {
    const { t } = this.props;
    const { email } = this.props.user.email;
    return (
      <div className={"inline"}>
        <Button
          onClick={() => this.setState({ showAlertConfirm: true })}
          className={"margin-r-5"}
          size={"xs"}
          icon={
            this.props.user.status === UserStatusEnum.BANNED.label
              ? "fa-user-plus"
              : "fa-user-slash"
          }
          type={
            this.props.user.status === UserStatusEnum.BANNED.label
              ? "success"
              : "primary"
          }
        />
        <SweetAlert
          showCancelButton
          show={this.state.showAlertConfirm}
          title={t("TITLE_CETTE_ACTION_EST_IRRÉVERSIBLE")}
          text={
            t("TEXT_ÊTES-VOUS_SÛR_DE_VOULOIR_") +
            (this.props.user.status === UserStatusEnum.BANNED.label
              ? t("TEXT_GRACIER")
              : t("TEXT_BANIR")) +
            " " +
            email +
            " ?"
          }
          type="warning"
          confirmButtonText={t("BTN_CONFIRMER")}
          cancelButtonText={t("BTN_ANNULER")}
          confirmButtonColor="#00a65a"
          onCancel={() => {
            this.setState({ showAlertConfirm: false });
          }}
          onConfirm={() => {
            this.submit();
            this.setState({ showAlertConfirm: false });
          }}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: data => dispatch(User.update(data, err => {}))
  };
}
export default withTranslation()(
  connect(
    null,
    mapDispatchToProps
  )(BanUserModal)
);
