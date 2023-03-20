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
  if (data.cPassword !== data.password){
    return alerts.addAlert({
      message: "MESSAGE_LES_DEUX_MOTS_DE_PASS_NE_SONT_PAS_IDENTIQUES",
      type: "error"
    });
  }

    return Auth.register(data);
}
const userFields = [
  {
    name: "lName",
    placeholder: "LABEL_NOM",
    icon: "fa-address-card"
  },
  {
    name: "fName",
    placeholder: "LABEL_PRENOM",
    icon: "fa-address-card"
  },
  {
    name: "phone",
    placeholder: "LABEL_NUMÉRO_DE_TÉLÉPHONE",
    icon: "fa-address-card"
  },
  {
    name: "company",
    placeholder: "LABEL_ÉTABLISSEMENT",
    icon: "fa-building"
  },
  {
    name: "password",
    placeholder: "LABEL_PASSWORD",
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
    welcomeMsg:
      "MESSAGE_MERCI_DE_REMPLIRE_LES_INFORMATIONS_POUR_COMPLETER_VOTRE_PROFILE",
    submitButtonText: "BTN_ACTIVER_LE_COMPTE",
    submitButtonIcon: "fas-sign-in-alt",
    headerText: "TEXT_COMPLÉTER_VOTRE_PROFILE",
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
