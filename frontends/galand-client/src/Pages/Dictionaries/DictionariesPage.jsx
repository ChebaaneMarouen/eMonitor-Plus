import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import DictionaryForm from "./components/DictionaryForm";
import { Dictionaries } from "modules/ressources";
import PropTypes from "prop-types";

function mapStateToProps(state) {
    return {
        data: state.data.dictionaries,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        insert: (data, toggleModal) =>
            dispatch(
                Dictionaries.insert(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
        remove: (dictionary) => dispatch(Dictionaries.remove(dictionary)),
        update: (data, toggleModal) =>
            dispatch(
                Dictionaries.update(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
    };
}

const DictionariesCrudPage = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrudPage));

class DictionariesPage extends Component {
    constructor(props) {
        super(props);
    }

    getColumns(t) {
        return [
            {
                label: t("LABEL_TITLE"),
                field: "name",
                sort: "asc",
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
                <DictionariesCrudPage
                    title={t("TITLE_GESTION_DES_DICTIONNAIRES_PERSONNALISES")}
                    browserTitle={t("TITLE_GESTION_DES_DICTIONNAIRES_PERSONNALISES")}
                    columns={this.getColumns(t)}
                    Form={DictionaryForm}
                    permission={this.props.permission}
                    t={t}
                    addTitle={t("TITLE_AJOUTER_UN_DICTIONAIRE")}
                />
            </div>
        );
    }
}

DictionariesPage.propTypes = {
    className: PropTypes.string,
    dictionaries: PropTypes.arrayOf(PropTypes.object),
};

DictionariesPage.defaultProps = {
    dictionaries: [],
};
export default withTranslation()(DictionariesPage);
