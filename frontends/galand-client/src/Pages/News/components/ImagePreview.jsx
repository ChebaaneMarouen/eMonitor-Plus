import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { getCoverImage } from "modules/actions";
import MyModal from "@shared/Components/MyModal.jsx";
import LoadingScreen from "components/LoadingScreen";

import { Button } from "adminlte-2-react";

class ImagePreview extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setCoverImage = this.setCoverImage.bind(this);
    this.getCoverImage = this.getCoverImage.bind(this);
  }

  getCoverImage(modalIsOpen) {
    const { url } = this.props;
    if (modalIsOpen) {
      this.setState({
        searching: true
      });
      getCoverImage(url, ({ imageUrl }) => {
        this.setState({ imageUrl, searching: false });
      });
    }
  }

  setCoverImage(toggleModalState) {
    const { url, onChange, name, addInfraction } = this.props;
    const { imageUrl } = this.state;

    // close modal
    toggleModalState();

    if (imageUrl && !addInfraction)
      onChange({
        target: {
          name,
          value: imageUrl
        }
      });
  }

  render() {
    const { url, t, addInfraction } = this.props;
    const { imageUrl, searching } = this.state;
    if (!url) return null;
    return (
      <MyModal
        title={t("TITLE_IMAGE_PREVIEW")}
        submitText={t("BTN_CONFIRMER")}
        submit={this.setCoverImage}
        onToggle={this.getCoverImage}
        button={<Button text={t("BTN_PREVIEW")} type="primary" />}
      >
        {imageUrl ? (
          <img className="img img-responsive" src={imageUrl} alt="preview" />
        ) : searching ? (
          <LoadingScreen title={t("MESSAGE_EXTRACTING_THUMBNAIL")} />
        ) : (
          <center>
            <h3 className="text-info">{t("MESSAGE_IMAGE_NOT_FOUND")}</h3>
          </center>
        )}
      </MyModal>
    );
  }
}

export default withTranslation()(ImagePreview);
