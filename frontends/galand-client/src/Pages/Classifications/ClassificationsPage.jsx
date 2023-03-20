import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import ClassificationsForm from "./components/ClassificationsForm";
import { Classification } from "modules/ressources";
import _ from "lodash";
import { ClassificationEnum } from "Enums";
import PropTypes from "prop-types";

function mapStateToProps(state) {
    return {
        data: state.data.classifications,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(Classification.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                Classification.insert(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
        remove: (classification) => dispatch(Classification.remove(classification)),
        update: (data, toggleModal) =>
            dispatch(
                Classification.update(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
    };
}

const ClassificationsCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class ClassificationsPage extends Component {
    constructor(props) {
        super(props);
        this.state = { fields: this.getColumns(this.props.t).map((c) => c.field) };
    }

    getColumns(t) {
        return [
            {
                label: t("LABEL_NAME"),
                field: "name",
                sort: "asc",
            },
            {
                label: t("LABEL_CLASSIFICATION_TYPE"),
                field: "classificationTypeStr",
                getter: (classification) => t(ClassificationEnum[classification.classificationType]),
            },
            {
                label: t("LABEL_NUMBER_OF_TRAINING_FILES"),
                field: "numTrainingFiles",
                getter: (classification) => classification.trainingFiles.length,
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
                <ClassificationsCrudPage
                    title={t("TITLE_GESTION_DES_CLASSIFICATIONS")}
                    browserTitle={t("TITLE_GESTION_DES_CLASSIFICATIONS")}
                    columns={this.getColumns(t)}
                    Form={ClassificationsForm}
                    permission={this.props.permission}
                    t={t}
                    addTitle={t("BTN_CREER_UNE_CLASSIFICATION")}
                />
            </div>
        );
    }
}

ClassificationsPage.propTypes = {
    className: PropTypes.string,
    classifications: PropTypes.arrayOf(PropTypes.object),
};

ClassificationsPage.defaultProps = {
    classifications: [],
};

export default withTranslation()(ClassificationsPage);
