import React from "react";
import { withTranslation } from "react-i18next";
import Page from "@shared/Pages/SingleFormPanelPage";
import { connect } from "react-redux";
import { Auth } from "modules/ressources";

const footer = <a href="/forgot-password">Mot de passe oublié ?</a>;
const userFields = [
  {
    name: "email",
    placeholder: "LABEL_ADRESSE_EMAIL",
    icon: "fa-at",
    type: "email"
  },
  {
    name: "password",
    placeholder: "LABEL_PASSWORD",
    type: "password",
    icon: "fa-lock"
  }
];
function mapStateToProps(state) {
  return {
    welcomeMsg: "MESSAGE_CONNECTEZ-VOUS_POUR_COMMENCER_VOTRE_SESSION",
    submitButtonText: "BTN_CONNECTER",
    submitButtonIcon: "fa-sign-in-alt",
    headerText: "BTN_CONNECTER",
    userFields,
    footer
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: data => dispatch(Auth.login(data))
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Page)
);
