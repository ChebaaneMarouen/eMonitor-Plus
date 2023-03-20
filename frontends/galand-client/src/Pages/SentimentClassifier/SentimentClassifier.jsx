import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import SentimentForm from "./components/SentimentForm";
import { Sentiment } from "modules/ressources";
import _ from "lodash";
import { ClassificationEnum } from "Enums";
import PropTypes from "prop-types";

function mapStateToProps(state) {
    return {
        data: state.data.sentiment,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(Sentiment.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                Sentiment.insert(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
        remove: (sentiment) => dispatch(Sentiment.remove(sentiment)),
        update: (data, toggleModal) =>
            dispatch(
                Sentiment.update(data, (err) => {
                    //if no errors we hide the modal
                    if (!err) toggleModal();
                })
            ),
    };
}

const SentimentsCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class SentimentsPage extends Component {
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
                field: "numSentimentFiles",
                getter: (sentiment) => sentiment.trainingFiles.length,
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
                <SentimentsCrudPage
                    title={t("TITLE_GESTION_DES_SENTIMENTS")}
                    browserTitle={t("TITLE_GESTION_DES_SENTIMENTS")}
                    columns={this.getColumns(t)}
                    Form={SentimentForm}
                    permission={this.props.permission}
                    t={t}
                    addTitle={t("TITLE_AJOUTER_SENTIMENT_MODEL")}
                />
            </div>
        );
    }
}

SentimentsPage.propTypes = {
    className: PropTypes.string,
    sentiment: PropTypes.arrayOf(PropTypes.object),
};

SentimentsPage.defaultProps = {
    sentiment: [],
};

export default withTranslation()(SentimentsPage);

