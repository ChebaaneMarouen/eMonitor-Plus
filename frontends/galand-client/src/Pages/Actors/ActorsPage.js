import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ActorRessource } from "modules/ressources";
import _ from "lodash";
import CrudPage from "@shared/Pages/crudPage";
import ActorsForm from "./components/ActorsForm";
import "./tags.css";

function mapStateToProps(state, ownProps) {
    return {
        data : state.data.actors,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(ActorRessource.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                ActorRessource.insert(data, (err) => {
                    console.log(data, err);
                    if (!err) toggleModal();
                })
            ),
        remove: (actor) => dispatch(ActorRessource.remove(actor)),
        update: (data, toggleModal) =>
            dispatch(
                ActorRessource.update(data, (err) => {
                    if (!err) toggleModal();
                })
            ),
    };
}

const ActorsCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class ActorsPage extends Component {
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
                label: t("LABEL_CONSTITUENCY"),
                field: "constituency",
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
                <ActorsCrudPage
                    title={t("TITLE_GESTION_DES_ACTEURS")}
                    browserTitle={t("TITLE_GESTION_DES_ACTEURS")}
                    columns={this.getColumns(t)}
                    Form={ActorsForm}
                    t={t}
                    permission={this.props.permission}
                    addTitle={t("BTN_AJOUTER_UN_ACTEUR")}
                    
                />
            </div>
        );
    }
}

ActorsPage.propTypes = {
    className: PropTypes.string,
    actors: PropTypes.arrayOf(PropTypes.object),
};

ActorsPage.defaultProps = {
    actors: [],
};
export default withTranslation()(ActorsPage);
