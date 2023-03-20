import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { User } from "modules/ressources";
import _ from "lodash";
import UpdateUserModal from "./UpdateUserModal";
import RemoveUserModal from "./RemoveUserModal";
import BanUserModal from "./BanUserModal";
import { MDBDataTable } from "mdbreact";
import { getKeyByValue, UserStatusEnum } from "../../../Enums";
import parseMilliseconds from "parse-ms";

class UsersList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { getUsers } = this.props;
    getUsers();
  }
  parseLastLogin = (time, t) =>{
    const parsedTime = parseMilliseconds(time);
    let timeString = "";
    if(parsedTime["days"] > 0){
      timeString += (parsedTime["days"] + " " +  t("DAY(S)") + " ");
    }
    if(parsedTime["hours"] > 0){
      timeString += (parsedTime["hours"] + " " + t("HOUR(S)") + " ");
    }
    if(parsedTime["minutes"] > 0){
      timeString += (parsedTime["minutes"] + " " + t("MINUTES(S)") + " ");
    }

    return timeString ? timeString : t("LABEL_FEW_SECONDS");
  }
  getColumns(t) {
    return [
      {
        label: t("LABEL_EMAIL"),
        field: "email",
        sort: "asc",
      },
      {
        label: t("LABEL_NOM"),
        field: "lName",
      },
      {
        label: t("LABEL_PRENOM"),
        field: "fName",
      },
      {
        label: t("LABEL_RÔLE"),
        field: "role",
      },
      {
        label: t("LABEL_NUMÉRO_DE_TÉLÉPHONE"),
        field: "phone",
      },
      {
        label: t("LABEL_ETAT"),
        field: "status",
      },
      {
        label: t("LABEL_ÉTABLISSEMENT"),
        field: "company",
      },
      {
        label: t("LABEL_LAST_LOGIN"),
        field: "lastLogin",
      },
      {
        label: t("LABEL_ACTIONS"),
        field: "actions",
        sort: "disabled",
      },
    ];
  }

  createActions(user) {
    if (this.props.permission >= 2)
      return [
        <UpdateUserModal
          key={user._id}
          user={_.pick(user, ["_id", "email", "role", "fName", "lName", "phone", "company"])}
        />,
        <BanUserModal key={user._id + " BAN"} user={_.pick(user, ["_id", "email", "role", "status"])} />,
        <RemoveUserModal key={user._id + "REMOVE"} user={_.pick(user, ["_id", "email"])} />,
      ];
  }

  render() {
    let { users, t, roles } = this.props;
    const fields = this.getColumns(t).map((c) => c.field);

    users = users
      .map((user) => {
        const role = roles ? roles.filter((role) => user.role === role._id)[0] : [];
        return {
          ...user,
          role: role && role.name,
        };
      })
      .map((user) => ({
        ...user,
        status: t(getKeyByValue(UserStatusEnum, user.status, null, null, "label")),
      }))
      .map((user) => ({ ...user, actions: this.createActions(user), lastLogin : t("LABEL_ABOUT") + " " + this.parseLastLogin( Date.now() - user.lastLogin , t) }))
      .map((user) => _.pick(user, fields));

    const data = {
      columns: this.getColumns(t),
      rows: users,
    };
    return (
      <MDBDataTable
        striped
        bordered
        hover
        data={data}
        responsive
        autoWidth
        entriesLabel={t("TEXT_AFFICHER_LES_RÉSULTATS")}
        infoLabel={[t("TEXT_AFFICHAGE"), t("TEXT_DE"), t("TEXT_SUR"), t("TEXT_RESULTAT")]}
        paginationLabel={[t("TEXT_PRECEDENT"), t("TEXT_SUIVANT")]}
        searchLabel={t("TEXT_RECHERCHE")}
      />
    );
  }
}

UsersList.propTypes = {
  className: PropTypes.string,
  users: PropTypes.arrayOf(PropTypes.object),
  roles: PropTypes.array,
};

UsersList.defaultProps = {
  users: [],
  roles: [],
};

function mapStateToProps(state) {
  return {
    users: state.data.users,
    roles: state.data.roles,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => dispatch(User.get()),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(UsersList));
