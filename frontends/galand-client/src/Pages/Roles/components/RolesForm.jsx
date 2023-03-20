import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import _ from "lodash";
import { Form, FormGroup, Label, Input, Row, Col } from "reactstrap";
import "./RolesForm.css";
import { connect } from "react-redux";
import { Role } from "modules/ressources";
const { Text } = Inputs;

class RolesForm extends Component {
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { getRoles } = this.props;
    getRoles();
  }
  getPermissionsDescription = () => {
    const { description } = this.props;
    return description
      .filter((p) => p.key.indexOf("permissions.") === 0) // filter non relevant permissions
      .map((p) => ({
        ressource: p.key.replace("permissions.", ""),
        numberOfOptions: p.type === "boolean" ? 1 : 2,
      }));
  };

  permissionChange = (name, value) => {
    const { onChange, item } = this.props;
    console.log(name, value);
    const { permissions = {} } = item;
    const newPermissions = {
      ...permissions,
      [name]: permissions[name] ^ value,
    };
    onChange({
      target: {
        name: "permissions",
        value: newPermissions,
      },
    });
  };

  render() {
    const permissionsDescription = this.getPermissionsDescription();
    const { t, item, onChange } = this.props;
    const { name, permissions = {} } = item;
    return (
      <Form className={"form-horizontal"}>
        <div className="rolesForm">
          <Text
            onChange={onChange}
            name="name"
            labelClass={"required"}
            iconLeft={"fa-at"}
            sm={8}
            labelSm={4}
            label={t("LABEL_NAME")}
            placeholder={t("LABEL_ROLE_NAME")}
            value={name}
          />
          {permissionsDescription.map((p) => {
            return (
              <Row style={{ padding: "4px", borderBottom: "1px solid #e4e4e4" }}>
                <Col
                  sm={4}
                  style={{
                    textAlign: "left",
                    fontWeight: "bold",
                  }}
                >
                  {t(p.ressource)}
                </Col>
                <Col sm={8}>
                  <FormGroup check>
                    {_.range(p.numberOfOptions).map((_, i) => {
                      return (
                        <Label check>
                          <Input
                            onChange={() => this.permissionChange(p.ressource, i + 1)}
                            type="checkbox"
                            checked={permissions[p.ressource] >= i + 1}
                          />
                          {i === 0
                            ? p.numberOfOptions === 2
                              ? t("LABEL_READ")
                              : t("LABEL_AUTHORIZE")
                            : t("LABEL_WRITE")}
                        </Label>
                      );
                    })}
                  </FormGroup>
                </Col>
              </Row>
            );
          })}
        </div>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  return {
    description: state.data.rolesDescription,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    getRoles: () => {
      dispatch(Role.describe());
      dispatch(Role.get());
    },
  };
}

RolesForm.propTypes = {
  item: PropTypes.object,
  onChange: PropTypes.func.isRequired,
  description: PropTypes.array,
};

RolesForm.defaultProps = {
  item: { permissions: {} },
  description: [],
};

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(RolesForm));
