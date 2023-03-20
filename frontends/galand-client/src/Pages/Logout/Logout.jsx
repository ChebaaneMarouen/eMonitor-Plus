import React, { Component } from "react";
import { connect } from "react-redux";

class Logout extends Component {
  componentDidMount() {
    this.props.logout();
    this.props.history.replace("/");
  }
  render() {
    return null;
  }
}

function mapDispatchToProps(dispatch) {
  return {
    logout: () =>
      dispatch({
        type: "authLogin",
        isAuthenticated: false,
        roles: null
      })
  };
}
export default connect(
  null,
  mapDispatchToProps
)(Logout);
