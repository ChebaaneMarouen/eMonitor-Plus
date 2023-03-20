import Page from "@shared/Pages/SingleFormPanelPage";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";

import { alerts } from "@shared/redux";
import { Auth } from "modules/ressources";

function onMount() {
  // define registration token as Url parameter
  const { token } = this.props.match.params;
  if (!token) window.location.href = "/";
  // add this to the form to be sent
  this.setState({
    _id: token
  });
}

function validatePassword(data) {
  if (data.cPassword !== data.password)
    return alerts.addAlert({
      message: "MESSAGE_LES_DEUX_MOTS_DE_PASS_NE_SONT_PAS_IDENTIQUES",
      type: "error"
    });
  return Auth.recoverPassword(data);
}
const userFields = [
  {
    name: "password",
    placeholder: "LABEL_NEW_PASSWORD",
    type: "password",
    icon: "fa-lock"
  },
  {
    name: "cPassword",
    placeholder: "LABEL_CONFIRM_PASSWORD",
    type: "password",
    icon: "fa-lock"
  }
];

function mapStateToProps(state) {
  return {
    welcomeMsg: "MESSAGE_MERCI_DE_CREÉR_UN_NOUVEAU_MOT_DE_PASSE",
    submitButtonText: "BTN_CHANGER_LE_MOT_DE_PASSE",
    submitButtonIcon: "fas-sign-in-alt",
    headerText: "TEXT_CHANGER_LE_MOT_DE_PASSE",
    onMount,
    userFields
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: data => dispatch(validatePassword(data))
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Page)
);
