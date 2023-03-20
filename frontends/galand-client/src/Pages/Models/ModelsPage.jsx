import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import ModelsForm from "./components/ModelsForm";
import ModelStatus from "./components/ModelStatus";
import ModelDebug from "./components/ModelDebug";
import ActivateButton from "./components/ActivateButton";
import TrainButton from "./components/TrainButton";
import _ from "lodash";
import { Models, Classification } from "modules/ressources";

function mapStateToProps(state) {
  return {
    data: state.data.models ? state.data.models.filter(el => el.source !== "sentiment") : []
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initFunction: () => {
      dispatch(Classification.get());
    },
    insert: (data, toggleModal) => {
      dispatch(
        Models.insert({...data, source:"classification"}, err => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      );
    },
    update: (data, toggleModal) =>
      dispatch(
        Models.update({...data, source:"classification"}, err => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      ),
    remove: data => dispatch(Models.remove({...data, source:"classification"}))
  };
}
const ModelsCrudPage = withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CrudPage)
);

class ModelsPage extends Component {
  constructor(props) {
    super(props);
  }

  getColumns(t) {
    return [
      {
        label: t("LABEL_NOM"),
        field: "name",
        sort: "asc"
      },
      {
        label: t("LABEL_CREATED_AT"),
        field: "created",
        sort: "asc",
        getter: item => new Date(item.created).toISOString().replace("T", " ")
      },
      {
        label: t("LABEL_STATUS"),
        field: "status",
        getter: item => <ModelStatus {...item} />
      },
      {
        label: t("LABEL_SECONDARY_ACTIONS"),
        field: "secondaryActions",
        sort: "disabled",
        getter: item => (
          <div>
            {!_.isEmpty(item) && <ModelDebug {...item.debug} />}
            <ActivateButton model={item} />
            <TrainButton model={item} />
          </div>
        )
      },
      {
        label: t("LABEL_ACTIONS"),
        field: "actions",
        sort: "disabled"
      }
    ];
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <ModelsCrudPage
          title={t("TITLE_GESTION_DES_MODELS")}
          browserTitle={t("TITLE_GESTION_DES_MODELS")}
          columns={this.getColumns(t)}
          Form={ModelsForm}
          permission={this.props.permission}
          t={t}
        />
      </div>
    );
  }
}

export default withTranslation()(ModelsPage);
