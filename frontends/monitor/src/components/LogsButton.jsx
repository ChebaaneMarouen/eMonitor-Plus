import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";

class LogsButton extends Component {
  

  constructor(props) {
    super(props);
    this.state = {};

    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { getContainerLogs, containerId } = this.props;
    getContainerLogs(containerId);
  }

  render() {
    return (
      <div>
        <Button color="link" onClick={this.toggle}>
          Logs
        </Button>
      </div>
    );
  }
}

export default LogsButton;
