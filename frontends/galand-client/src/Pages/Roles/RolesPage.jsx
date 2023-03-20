import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import RolesForm from "./components/RolesForm";
import { Role } from "modules/ressources";
import PropTypes from "prop-types";

function mapStateToProps(state) {
    return {
        data: state.data.roles,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(Role.get());
            dispatch(Role.describe());
        },
        insert: (data, toggleModal) =>
            dispatch(
                Role.insert(data, (err) => {
                    if (!err) toggleModal();
                })
            ),
        remove: (role) => dispatch(Role.remove(role)),
        update: (data, toggleModal) =>
            dispatch(
                Role.update(data, (err) => {
                    if (!err) toggleModal();
                })
            ),
    };
}

const RolesCrudPage = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrudPage));

class RolesPage extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    };
    constructor(props) {
        super(props);
    }

    getColumns(t) {
        return [
            {
                label: t("LABEL_NAME"),
                field: "name",
                sort: "asc",
            },
            {
                label: t("LABEL_NUMBER_OF_ACCORDED_PERMISSIONS"),
                field: "numPermissions",
                getter: (role) => Object.values(role.permissions).reduce((acc, v) => acc + v, 0),
            },
            {
                label: t("LABEL_ACTIONS"),
                field: "actions",
                sort: "disabled",
            },
        ];
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <RolesCrudPage
                    title={t("TITLE_GESTION_DES_ROLES")}
                    browserTitle={t("TITLE_GESTION_DES_ROLES")}
                    columns={this.getColumns(t)}
                    permission={this.props.permission}
                    Form={RolesForm}
                    t={t}
                    addTitle={t("BTN_CREER_UN_ROLE")}
                />
            </div>
        );
    }
}
RolesPage.propTypes = {
    className: PropTypes.string,
    roles: PropTypes.arrayOf(PropTypes.object),
};

RolesPage.defaultProps = {
    roles: [],
};
export default withTranslation()(RolesPage);
