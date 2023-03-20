import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Form } from "reactstrap";
import { Button, Inputs } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";
import { CustomSearch } from "modules/ressources";
const { Text } = Inputs;

class AddCustomSearch extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      name: ""
    };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  submit(toggle) {
    const { onSubmit } = this.props;
    const { search, searchType } = this.props;
    const { name } = this.state;
    onSubmit({ search, name, searchType }, toggle);
  }

  render() {
    const { name } = this.state;
    const { t } = this.props;
    return (
      <MyModal
        submitText={t("BTN_AJOUTER")}
        submit={this.submit}
        title={t("BTN_SAVE_CUSTOM_SEARCH")}
        className="mr-5"
        button={
          <Button
            flat
            block={true}
            pullRight={true}
            icon={"fa-save"}
            type="success"
          />
        }
      >
        <Form className={"form-horizontal"}>
          <Text
            onChange={this.onChange}
            name={"name"}
            labelClass={"required"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_NAME")}
            placeholder={t("LABEL_NAME")}
            value={name || ""}
          />
        </Form>
      </MyModal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (data, toggleModal) =>
      dispatch(
        CustomSearch.insert(data, err => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      )
  };
}

export default withTranslation()(
  connect(
    null,
    mapDispatchToProps
  )(AddCustomSearch)
);
