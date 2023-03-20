import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Tags } from "modules/ressources";
import _ from "lodash";
import CrudPage from "@shared/Pages/crudPage";
import TagsForm from "./components/TagsForm";
import "./tags.css";

function mapStateToProps(state, ownProps) {
    var data = state.data.tags
        ? state.data.tags.filter(
              (el) => Boolean(el.isCategory) === Boolean(ownProps.insertAdditionalValues.isCategory)
          )
        : [];
    return {
        data,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(Tags.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                Tags.insert(data, (err) => {
                    console.log(data, err);
                    if (!err) toggleModal();
                })
            ),
        remove: (tag) => dispatch(Tags.remove(tag)),
        update: (data, toggleModal) =>
            dispatch(
                Tags.update(data, (err) => {
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
                label: t("LABEL_LIBELLE"),
                field: "label",
                sort: "asc",
                getter: (tag) => (
                    <span className={"label margin"} style={{ backgroundColor: tag.color }}>
                        {tag.label}
                    </span>
                ),
            },
            {
                label: t("LABEL_NOMBRE_DARTICLES"),
                field: "count",
            },
            {
                label: t("LABEL_ACTIONS"),
                field: "actions",
                sort: "disabled",
            },
        ];
    }

    render() {
        const { t, isCategory } = this.props;
        const type = isCategory ? "CATEGORIES" : "SUJETS";
        console.log(isCategory);
        return (
            <div>
                <ScrappingConfigCrudPage
                    title={t("TITLE_GESTION_DES_" + type)}
                    browserTitle={t("TITLE_GESTION_DES_" + type)}
                    columns={this.getColumns(t)}
                    Form={TagsForm}
                    t={t}
                    permission={this.props.permission}
                    addTitle={t("BTN_AJOUTER_UN_" + type)}
                    insertAdditionalValues={{ isCategory }}
                />
            </div>
        );
    }
}

ScrappingConfigPage.propTypes = {
    className: PropTypes.string,
    tags: PropTypes.arrayOf(PropTypes.object),
};

ScrappingConfigPage.defaultProps = {
    tags: [],
};
export default withTranslation()(ScrappingConfigPage);
