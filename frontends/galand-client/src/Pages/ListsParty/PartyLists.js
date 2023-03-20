import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { PartyRessource } from "modules/ressources";
import _ from "lodash";
import CrudPage from "@shared/Pages/crudPage";
import ListsForm from "./components/ListsForm";
import "./tags.css";

function mapStateToProps(state, ownProps) {
    return {
        data : state.data.partys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(PartyRessource.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                PartyRessource.insert(data, (err) => {
                    console.log(data, err);
                    if (!err) toggleModal();
                })
            ),
        remove: (actor) => dispatch(PartyRessource.remove(actor)),
        update: (data, toggleModal) =>
            dispatch(
                PartyRessource.update(data, (err) => {
                    if (!err) toggleModal();
                })
            ),
    };
}

const ListsCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class ListsPage extends Component {
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
                label: t("LABEL_POLITICAL_ACTOR"),
                field: "political_actor",
                getter: (party) => {
                    console.log("partys", party)
                   return party.political_actor.join(", ")
                },
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
                <ListsCrudPage
                    title={t("TITLE_GESTION_DES_PARTY_LIST")}
                    browserTitle={t("TITLE_GESTION_DES_PARTY_LIST")}
                    columns={this.getColumns(t)}
                    Form={ListsForm}
                    t={t}
                    permission={this.props.permission}
                    addTitle={t("BTN_AJOUTER_UN_LIST")}
                    
                />
            </div>
        );
    }
}

ListsPage.propTypes = {
    className: PropTypes.string
};

export default withTranslation()(ListsPage);
