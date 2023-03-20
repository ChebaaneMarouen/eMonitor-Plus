import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import SweetAlert from "sweetalert-react";

class ConfirmModal extends Component {
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
    const { action, buttonText, text } = this.props;
    return (
      <div className={"inline"}>
        <Button
          onClick={() => this.setState({ showAlertConfirm: true })}
          className={"margin-r-5"}
          block
          icon={"fa-trash"}
          text={buttonText}
          type="danger"
        />
        <SweetAlert
          showCancelButton
          show={this.state.showAlertConfirm}
          title="Cette action est irréversible"
          text={"Êtes-vous sûr de vouloir de continuer l'action ?"}
          type="warning"
          confirmButtonText="Confirmer"
          cancelButtonText="Annuler"
          confirmButtonColor="#00a65a"
          onCancel={() => {
            this.setState({ showAlertConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showAlertConfirm: false });
            action();
          }}
        />
      </div>
    );
  }
}

export default ConfirmModal;
