import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import Select from "components/Select";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";

const { Text } = Inputs;

class UsersForm extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { t, user, roles, onChange } = this.props;
    const { email, role, fName, lName, phone, company } = user;
    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={onChange}
          name="email"
          inputType={"email"}
          labelClass={"required"}
          iconLeft={"fa-at"}
          sm={8}
          labelSm={4}
          label={t("LABEL_EMAIL")}
          placeholder={t("LABEL_EMAIL")}
          value={email}
        />
        <Text
          onChange={onChange}
          name="fName"
          inputType={"fName"}
          labelClass={"required"}
          iconLeft={"fa-user"}
          sm={8}
          labelSm={4}
          label={t("LABEL_FNAME")}
          placeholder={t("LABEL_FNAME")}
          value={fName}
        />
        <Text
          onChange={onChange}
          name="lName"
          inputType={"lName"}
          labelClass={"required"}
          iconLeft={"fa-user"}
          sm={8}
          labelSm={4}
          label={t("LABEL_LNAME")}
          placeholder={t("LABEL_LNAME")}
          value={lName}
        />
        <Text
          onChange={onChange}
          name="phone"
          inputType={"phone"}
          labelClass={"required"}
          iconLeft={"fa-phone"}
          sm={8}
          labelSm={4}
          label={t("LABEL_PHONE")}
          placeholder={t("LABEL_PHONE")}
          value={phone}
        />
        <Text
          onChange={onChange}
          name="company"
          inputType={"company"}
          labelClass={"required"}
          iconLeft={"fa-building"}
          sm={8}
          labelSm={4}
          label={t("LABEL_ÉTABLISSEMENT")}
          placeholder={t("LABEL_ÉTABLISSEMENT")}
          value={company}
        />
        <Select
          labelClass={"required"}
          iconLeft={"fa-user-shield"}
          options={roles.map((role) => ({
            label: role.name,
            value: role._id,
          }))}
          onChange={onChange}
          value={role}
          sm={8}
          name="role"
          labelSm={4}
          label={t("LABEL_RÔLE") + ":"}
          placeholder={t("LABEL_RÔLE")}
        />
      </Form>
    );
  }
}

UsersForm.propTypes = {
  roles: PropTypes.array,
  user: PropTypes.object,
  onChange: PropTypes.func.isRequired,
};
UsersForm.defaultProps = {
  user: {},
  roles: [],
};

function mapStateToProps(state) {
  return {
    roles: state.data.roles,
  };
}
export default withTranslation()(connect(mapStateToProps)(UsersForm));
