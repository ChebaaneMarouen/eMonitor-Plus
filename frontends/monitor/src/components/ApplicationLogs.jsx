import React, { Component } from "react";
import PropTypes from "prop-types";
import { Col } from "reactstrap";
import AppLogDataGrid from "./Applogs-data-grid";

class ApplicationLogs extends Component {
  constructor(props) {
    super(props);
    this.state = {
      data: []
    };
    const { socket } = this.props;
    socket.on("appLogData", newData => {
      this.setState({
        data: this.state.data.concat(newData).sort((b, a) => a.time - b.time)
      });
    });
  }

  componentDidMount() {
    const { socket } = this.props;
    socket.emit("loadAppLogData");
  }

  render() {
    const { data } = this.state;
    return <AppLogDataGrid data={data} />;
  }
}

ApplicationLogs.propTypes = {
  socket: PropTypes.object
};

ApplicationLogs.defaultProps = {};

export default ApplicationLogs;
