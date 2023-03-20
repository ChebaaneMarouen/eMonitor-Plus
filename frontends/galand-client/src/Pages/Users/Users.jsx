import React, { Component } from "react";
import { connect } from "react-redux";
import { withTranslation } from "react-i18next";
import { Content, Row, Col, Box } from "adminlte-2-react";
import { Role } from "modules/ressources";
import AddUserModal from "./components/AddUserModal";
import UsersList from "./components/UsersList";
import "./Users.css";

class Users extends Component {
  componentDidMount() {
    const { getRoles } = this.props;
    getRoles();
  }

  render() {
    const { t, permission } = this.props;
    return (
      permission >= 1 && (
        <div>
          <Content
            title={t("TITLE_GESTION_DES_UTILISATEURS")}
            browserTitle={t("TITLE_GESTION_DES_UTILISATEURS")}
          >
            <Box footer={this.props.permission >= 2 && <AddUserModal />}>
              <UsersList permission={permission} />
            </Box>
          </Content>
        </div>
      )
    );
  }
}
function mapStateToProps(state) {
  return {
    roles: state.data.roles,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getRoles: () => dispatch(Role.get()),
  };
}
export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(Users));
