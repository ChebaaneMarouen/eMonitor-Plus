import React, { Component } from "react";
import { Button, ButtonGroup } from "reactstrap";
import LogsModal from "./LogsModal";

export class ActionButton extends Component {
  constructor(props) {
    super(props);
    this.state = {
      disabled: false
    };
    this.onClick = this.onClick.bind(this);
  }

  componentWillReceiveProps(nextProps) {
    if (this.props.status !== nextProps.status) {
      this.setState({
        disabled: false
      });
    }
  }

  onClick(actionType) {
    const { containerId } = this.props;
    const { action } = this.props;

    if (actionType === "remove") {
      const c = confirm("Are you sure you want to remove " + containerId);
      if (!c) return; //cancel action
    }
    this.setState({
      disabled: true
    });
    action(containerId, actionType);
  }

  render() {
    const { status, containerId } = this.props;
    const { disabled } = this.state;

    if (status)
      return (
        <ButtonGroup>
          <Button
            disabled={disabled}
            onClick={() => this.onClick("stop")}
            outline
            size="sm"
            color="danger"
          >
            Stop
          </Button>
          <Button
            disabled={disabled}
            onClick={() => this.onClick("restart")}
            outline
            size="sm"
            color="primary"
          >
            Restart
          </Button>
        </ButtonGroup>
      );

    return (
      <ButtonGroup>
        <Button
          disabled={disabled}
          outline
          onClick={() => this.onClick("start")}
          size="sm"
          color="success"
        >
          Start
        </Button>
        <Button
          disabled={disabled}
          outline
          onClick={() => this.onClick("remove")}
          size="sm"
          color="danger"
        >
          remove
        </Button>
      </ButtonGroup>
    );
  }
}

export default ActionButton;
