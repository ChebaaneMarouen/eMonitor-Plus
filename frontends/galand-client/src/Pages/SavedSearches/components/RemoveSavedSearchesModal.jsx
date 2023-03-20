import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import SweetAlert from "sweetalert-react";
import { CustomSearch } from "modules/ressources";

class RemoveSavedSearchesModal extends Component {
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
    const { t, customSearch, removeCustomSearch } = this.props;
    const { name } = customSearch;
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
          title={t("MESSAGE_CETTE_ACTION_EST_IRRÉVERSIBLE")}
          text={
            t("MESSAGE_ÊTES-VOUS_SÛR_DE_VOULOIR_SUPPRIMER_LE_") + name + "?"
          }
          type="warning"
          confirmButtonText={t("BTN_CONFIRMER")}
          cancelButtonText={t("BTN_ANNULER")}
          confirmButtonColor="#00a65a"
          onCancel={() => {
            this.setState({ showAlertConfirm: false });
          }}
          onConfirm={() => {
            removeCustomSearch(customSearch);
            this.setState({ showAlertConfirm: false });
          }}
        />
      </div>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    removeCustomSearch: customSearch =>
      dispatch(CustomSearch.remove(customSearch))
  };
}
export default withTranslation()(
  connect(
    null,
    mapDispatchToProps
  )(RemoveSavedSearchesModal)
);
