import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import MyModal from "@shared/Components/MyModal";
import { Button, Inputs } from "adminlte-2-react";
import { Videos } from "modules/ressources";
import { Form } from "reactstrap";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";

import PropTypes from "prop-types";
const { Text } = Inputs;

class VideoPreprocessingModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      url: props.url,
      postId: props.postId
    };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(toggleModal) {
    console.log(this.state);
    const { onSubmit } = this.props;
    onSubmit(this.state, toggleModal);
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const { url, note, videoSegments } = this.state;
    const { t } = this.props;
    return (
      <MyModal
        className={"inline"}
        button={
          <Button
            onClick={() => this.openModal(false)}
            className={"margin-r-5"}
            size={"xs"}
            icon={"fa-edit"}
            text={"Video Reverse Search"}
            type="info"
          />
        }
        submitText={t("BTN_AJOUTER")}
        submitType={"success"}
        submit={this.submit}
        title={t("TITLE_ADD_VIDEO_TO_BE_PREPROCESSED")}
      >
        <Form className={"form-horizontal"}>
          <Text
            onChange={this.onChange}
            name={"url"}
            labelClass={"required"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_VIDEO_URL") + ":"}
            placeholder={t("LABEL_VIDEO_URL")}
            value={url || ""}
          />
          <Text
            onChange={this.onChange}
            name={"note"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_COMMENT") + ":"}
            placeholder={""}
            value={note || ""}
            inputType={"textarea"}
          />
          <ClonableInputs
            maxElements={50}
            minElements={1}
            initButtonText={t("BTN_ADD_FRAME_TIME")}
            value={videoSegments}
            name="videoSegments"
            defaultValue={""}
            onChange={this.onChange}
          >
            <Text
              iconLeft={"fa-pen"}
              placeholder={t("TEXT_FRAME_FROM_VIDEO")}
              sm={8}
              labelSm={4}
              label={t("LABEL_FRAME") + ":"}
            />
          </ClonableInputs>
        </Form>
      </MyModal>
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (data, toggleModal) =>
      dispatch(
        Videos.insert(data, err => {
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
  )(VideoPreprocessingModal)
);
