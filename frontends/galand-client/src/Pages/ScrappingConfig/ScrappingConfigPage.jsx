import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Content, Row, Col, Box } from "adminlte-2-react";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Rules } from "modules/ressources";
import _ from "lodash";
import CrudPage from "@shared/Pages/crudPage";
import RulesForm from "./components/RulesForm";

function mapStateToProps(state) {
    return {
        data: state.data.rules,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        insert: (data, toggleModal) =>
            dispatch(
                Rules.insert(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
        remove: (rule) => dispatch(Rules.remove(rule)),
        update: (data, toggleModal) =>
            dispatch(
                Rules.update(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
    };
}

const ScrappingConfigCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class ScrappingConfigPage extends Component {
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
                label: t("LABEL_NOM"),
                field: "name",
                sort: "asc",
            },
            {
                label: t("LABEL_FILTER"),
                field: "urlCondition",
            },
            {
                label: t("LABEL_PRIORITÉ"),
                field: "priority",
                sort: "desc",
            },
            {
                label: t("LABEL_ACTIONS"),
                field: "actions",
                sort: false,
            },
        ];
    }

    render() {
        const { t } = this.props;
        return (
            <div>
                <ScrappingConfigCrudPage
                    title={t("NAV_RULES")}
                    browserTitle={t("NAV_RULES")}
                    columns={this.getColumns(t)}
                    Form={RulesForm}
                    permission={this.props.permission}
                    t={t}
                    addTitle={t("TITLE_AJOUTER_UNE_RÉGLE")}
                />
            </div>
        );
    }
}

ScrappingConfigPage.propTypes = {
    className: PropTypes.string,
    rules: PropTypes.arrayOf(PropTypes.object),
};

ScrappingConfigPage.defaultProps = {
    rules: [],
};
export default withTranslation()(ScrappingConfigPage);
