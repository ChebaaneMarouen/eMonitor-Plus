import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CivilSocietyRessource } from "modules/ressources";
import _ from "lodash";
import CrudPage from "@shared/Pages/crudPage";
import "./tags.css";
import CivilSocietyForm from "./components/CivilSocietyForm";

function mapStateToProps(state, ownProps) {
    return {
        data : state.data.civils,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(CivilSocietyRessource.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                CivilSocietyRessource.insert(data, (err) => {
                    console.log(data, err);
                    if (!err) toggleModal();
                })
            ),
        remove: (civil) => dispatch(CivilSocietyRessource.remove(civil)),
        update: (data, toggleModal) =>
            dispatch(
                CivilSocietyRessource.update(data, (err) => {
                    if (!err) toggleModal();
                })
            ),
    };
}

const CivilSocietyCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class CivilSocietyPage extends Component {
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
                sort: "asc"
            },
            {
                label: t("LABEL_HEADQUARTERS"),
                field: "head_quarters",
                sort: "asc"
            },
            {
                label: t("LABEL_ACTIONS"),
                field: "actions",
                sort: "disabled",
            },
        ];
    }

    render() {
        const { t} = this.props;
        return (
            <div>
                <CivilSocietyCrudPage
                    title={t("TITLE_GESTION_DES_SOCIETE_CIVIL")}
                    browserTitle={t("TITLE_GESTION_DES_SOCIETE_CIVIL")}
                    columns={this.getColumns(t)}
                    Form={CivilSocietyForm}
                    t={t}
                    permission={this.props.permission}
                    addTitle={t("BTN_AJOUTER_UN_SOCIETE_CIVIL")}
                    
                />
            </div>
        );
    }
}

CivilSocietyPage.propTypes = {
    className: PropTypes.string,
    civils: PropTypes.arrayOf(PropTypes.object),
};

CivilSocietyPage.defaultProps = {
    civils: [],
};
export default withTranslation()(CivilSocietyPage);
