import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button, Modal, ModalHeader, ModalBody, ModalFooter } from "reactstrap";
import "./LogsModal.css";

class LogsModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      logs: props.logs || false
    };
    this.toggle = this.toggle.bind(this);
  }

  toggle() {
    const { removeContainerLogs, containerId } = this.props;
    removeContainerLogs();
    this.setState(prevState => ({
      modal: !prevState.modal
    }));
  }

  componentDidUpdate() {
    if (this.modalBody) {
      this.modalBody.scrollIntoView({ behavior: "smooth" });
    }
  }

  render() {
    const { openContainer, logs } = this.props;
    const isOpen = Boolean(openContainer);
    return (
      <div>
        <Modal
          size="xl"
          isOpen={isOpen}
          toggle={this.toggle}
          className={this.props.className}
        >
          <ModalHeader className="shell-top-bar" toggle={this.toggle}>
            Logs: {openContainer}
          </ModalHeader>
          <ModalBody
            style={{
              fontSize: "16px",
              maxHeight: "750px",
              overflowY: "auto"
            }}
            className="log"
          >
            {logs.length ? (
              logs.map((log, i) => (
                <span key={log + i}>
                  {log} <br />
                </span>
              ))
            ) : (
              <div>
                <div class="spinner-border text-info"> </div> Loading{" "}
              </div>
            )}
            <div
              style={{ float: "left", clear: "both" }}
              ref={node => {
                this.modalBody = node;
              }}
            />
          </ModalBody>
        </Modal>
      </div>
    );
  }
}
LogsModal.defaultProps = {
  logs: []
};
export default LogsModal;
