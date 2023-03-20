import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import FormsForm from "./components/FormsForm";
import { FormRessource } from "modules/ressources";
import _ from "lodash";
import { FormEnum } from "Enums";
import PropTypes from "prop-types";

function mapStateToProps(state) {
  return {
    data: state.data.forms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initFunction: () => {
      dispatch(FormRessource.get());
    },
    insert: (data, toggleModal) =>
      dispatch(
        FormRessource.insert(data, err => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      ),
    remove: form => dispatch(FormRessource.remove(form)),
    update: (data, toggleModal) =>
      dispatch(
        FormRessource.update(data, err => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      )
  };
}

const FormsCrudPage = withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(CrudPage)
);

class FormsPage extends Component {
  constructor(props) {
    super(props);
    this.state = { fields: this.getColumns(this.props.t).map(c => c.field) };
  }

  getColumns(t) {
    return [
      {
        label: t("LABEL_NAME"),
        field: "name",
        sort: "asc"
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
        <FormsCrudPage
          title={t("TITLE_GESTION_DES_FORMS")}
          browserTitle={t("TITLE_GESTION_DES_FORMS")}
          columns={this.getColumns(t)}
          Form={FormsForm}
          permission={this.props.permission}
          t={t}
          addTitle={t("TITLE_CREER_UNE_FORM")}
        />
      </div>
    );
  }
}

FormsPage.propTypes = {
  forms: PropTypes.arrayOf(PropTypes.object)
};

FormsPage.defaultProps = {
  forms: []
};

export default withTranslation()(FormsPage);
