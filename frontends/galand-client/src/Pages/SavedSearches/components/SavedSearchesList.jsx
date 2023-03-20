import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { CustomSearch } from "modules/ressources";
import RemoveSavedSearchesModal from "./RemoveSavedSearchesModal";
import _ from "lodash";

import { MDBDataTable } from "mdbreact";

class SavedSearchesList extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    };

    componentDidMount() {
        const { getCustomSearches } = this.props;
        getCustomSearches();
    }

    getColumns(t) {
        return [
            {
                label: t("LABEL_TITLE"),
                field: "name",
                sort: "asc",
            },
            { label: t("LABEL_CREATED_BY"), field: "creatorName" },
            {
                label: t("LABEL_SEARCH_TYPE"),
                field: "searchType",
            },
            {
                label: t("LABEL_CREATED_AT"),
                field: "createdAt",
            },
            {
                label: t("LABEL_ACTIONS"),
                field: "actions",
                sort: "disabled",
            },
        ];
    }
    createActions(customSearch) {
        if (this.props.permission >= 2)
            return [
                <RemoveSavedSearchesModal
                    key={CustomSearch._id + "REMOVE"}
                    customSearch={customSearch}
                />,
            ];
    }

    render() {
        let { customSearches, t, permission } = this.props;
        const fields = this.getColumns(t).map((c) => c.field);

        customSearches = customSearches
            .map((cs) => ({
                ...cs,
                createdAt: new Date(cs.created).toISOString().replace("T", " ").replace("Z", ""),
                actions: this.createActions(cs),
            }))
            .map((cs) => ({ ...cs, searchType: t(cs.searchType) }))
            .map((cs) => _.pick(cs, fields));

        if (permission < 2) {
            var noActionColumns = this.getColumns(t).filter((el) => el.field != "actions");
            console.log(noActionColumns);
        }
        const data = {
            rows: customSearches,
            columns: noActionColumns ? noActionColumns : this.getColumns(t),
        };

        return (
            <MDBDataTable
                entriesLabel={t("TEXT_AFFICHER_LES_RÉSULTATS")}
                infoLabel={[t("TEXT_AFFICHAGE"), t("TEXT_DE"), t("TEXT_SUR"), t("TEXT_RESULTAT")]}
                paginationLabel={[t("TEXT_PRECEDENT"), t("TEXT_SUIVANT")]}
                searchLabel={t("TEXT_RECHERCHE")}
                striped
                bordered
                hover
                data={data}
                responsive
                autoWidth
            />
        );
    }
}

SavedSearchesList.propTypes = {
    className: PropTypes.string,
    customSearches: PropTypes.arrayOf(PropTypes.object),
};

SavedSearchesList.defaultProps = {
    customSearches: [],
};

function mapStateToProps(state) {
    return {
        customSearches: state.data.customSearches,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getCustomSearches: () =>
            dispatch(
                CustomSearch.get((err, data) => {
                    data ? console.log("data: ", data) : console.log("err", err);
                })
            ),
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(SavedSearchesList));
