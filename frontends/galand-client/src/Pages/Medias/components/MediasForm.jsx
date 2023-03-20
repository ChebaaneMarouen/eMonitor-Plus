import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import MediaUrlForm from "./MediaUrlForm";
import { Form } from "reactstrap";
import "../Medias.css";
import Select from "components/Select";
import { connect } from "react-redux";

const { Text } = Inputs;

class MediasForm extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.mediaList = [
      "facebook",
      "twitter",
      "youtube",
      "instagram",
      "sitemap",
      "rss",
      "website",
    ];
  }

  render() {
    console.log(this.props);
    const { t, onChange, item } = this.props;
    const { links, name, type } = item;
    let DataSourcesTypes = this.props.settings.filter(
      (setting) => setting._id == "Data Sources Types"
    )[0]
      ? this.props.settings.filter(
          (setting) => setting._id == "Data Sources Types"
        )[0].DataSourceType.value
      : [];
    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={onChange}
          name={"name"}
          labelClass={"required"}
          iconLeft={"fa-pen"}
          sm={8}
          labelSm={4}
          label={t("LABEL_NOM") + ":"}
          placeholder={t("LABEL_NOM")}
          value={name || ""}
        />
        <Select
          placeholder={t("LABEL_TYPE")}
          label={t("LABEL_TYPE")}
          iconLeft={"fas-share-alt"}
          name="type"
          sm={8}
          labelSm={4}
          onChange={onChange}
          value={type || ""}
          options={DataSourcesTypes.map((v) => ({
            label: v.name,
            value: v.name,
          }))}
        />
        <ClonableInputs
          maxElements={10}
          minElements={0}
          value={links || []}
          initButtonText={t("BTN_AJOUTER_UN_LIEN")}
          name="links"
          defaultValue={{}}
          onChange={onChange}
        >
          <MediaUrlForm mediaList={this.mediaList} />
        </ClonableInputs>
      </Form>
    );
  }
}
MediasForm.propTypes = {
  settings: PropTypes.array,
};

MediasForm.defaultProps = {
  settings: [],
};

function mapStateToProps(state) {
  return {
    settings: state.data.settings,
  };
}

export default withTranslation()(connect(mapStateToProps, null)(MediasForm));
