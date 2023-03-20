import React from "react";
import { withTranslation } from "react-i18next";
import Page from "@shared/Pages/SingleFormPanelPage";
import { connect } from "react-redux";
import { Auth } from "modules/ressources";

const userFields = [
  {
    name: "email",
    placeholder: "LABEL_ADRESSE_EMAIL",
    icon: "fa-at",
    type: "email"
  }
];

function mapStateToProps(state) {
  return {
    welcomeMsg:
      "MESSAGE_MERCI_DE_SAISIR_VOTRE_ADRESSE_E-MAIL_POUR_RECEVOIR_UN_NOUVEAU_MOT_DE_PASSE",
    submitButtonText: "MESSAGE_ENVOYER_UN_EMAIL_DE_RECUPÉRATION",
    submitButtonIcon: "fa-sign-in-alt",
    headerText: "TITLE_ENVOYER_LE_MAIL",
    userFields
  };
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: data => dispatch(Auth.sendRecoverMail(data))
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(Page)
);
