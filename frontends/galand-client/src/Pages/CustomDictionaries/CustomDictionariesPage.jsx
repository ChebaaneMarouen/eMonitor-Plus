import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import DictionaryForm from "./components/DictionaryForm";
import { CustomDictionaries } from "modules/ressources";
import PropTypes from "prop-types";

function mapStateToProps(state) {
    return {
        data: state.data.customDictionaries,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        insert: (data, toggleModal) =>
            dispatch(
                CustomDictionaries.insert(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
        remove: (dictionary) => dispatch(CustomDictionaries.remove(dictionary)),
        update: (data, toggleModal) =>
            dispatch(
                CustomDictionaries.update(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
    };
}

const CustomDictionariesCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class CustomDictionariesPage extends Component {
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
        const { t, permission } = this.props;
        return (
            <div>
                <CustomDictionariesCrudPage
                    title={t("TITLE_GESTION_DES_DICTIONNAIRES_PERSONNALISES")}
                    browserTitle={t("TITLE_GESTION_DES_DICTIONNAIRES_PERSONNALISES")}
                    columns={this.getColumns(t)}
                    Form={DictionaryForm}
                    permission={permission}
                    t={t}
                    addTitle={t("TITLE_AJOUTER_UN_DICTIONAIRE")}
                />
            </div>
        );
    }
}

CustomDictionariesPage.propTypes = {
    className: PropTypes.string,
    customDictionaries: PropTypes.arrayOf(PropTypes.object),
};

CustomDictionariesPage.defaultProps = {
    customDictionaries: [],
};
export default withTranslation()(CustomDictionariesPage);
