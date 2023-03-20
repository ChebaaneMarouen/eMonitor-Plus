import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "sweetalert/dist/sweetalert.css";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { ConstituencyRessource} from "modules/ressources";
import _ from "lodash";
import CrudPage from "@shared/Pages/crudPage";
import ConstituencyForm from "./components/ConstituencyForm";
import "./tags.css";

function mapStateToProps(state, ownProps) {
    return {
        data : state.data.constituencys,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        initFunction: () => {
            dispatch(ConstituencyRessource.get());
        },
        insert: (data, toggleModal) =>
            dispatch(
                ConstituencyRessource.insert(data, (err) => {
                    console.log(data, err);
                    if (!err) toggleModal();
                })
            ),
        remove: (actor) => dispatch(ConstituencyRessource.remove(actor)),
        update: (data, toggleModal) =>
            dispatch(
                ConstituencyRessource.update(data, (err) => {
                    if (!err) toggleModal();
                })
            ),
    };
}

const ConstituencyCrudPage = withTranslation()(
    connect(mapStateToProps, mapDispatchToProps)(CrudPage)
);

class ConstituencyPage extends Component {
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
                label: t("LABEL_CATEGORIES"),
                field: "governorate",
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
        const { t } = this.props;
        return (
            <div>
                <ConstituencyCrudPage
                    title={t("NAV_GESTION_DES_CIRCONSCRIPTION")}
                    browserTitle={t("NAV_GESTION_DES_CIRCONSCRIPTION")}
                    columns={this.getColumns(t)}
                    Form={ConstituencyForm}
                    t={t}
                    permission={this.props.permission}
                    addTitle={t("BTN_AJOUTER_UN_CIRCONSCRIPTION")}
                    
                />
            </div>
        );
    }
}

ConstituencyPage.propTypes = {
    className: PropTypes.string,
    actors: PropTypes.arrayOf(PropTypes.object),
};

ConstituencyPage.defaultProps = {
    actors: [],
};
export default withTranslation()(ConstituencyPage);
