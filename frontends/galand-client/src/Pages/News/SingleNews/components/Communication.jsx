import React, { Component } from "react";
import _ from "lodash";
import { withTranslation } from "react-i18next";
import { Inputs, Button } from "adminlte-2-react";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import Form from "reactstrap/es/Form";
import { DecisionEnum } from "Enums";
import { Editor } from "react-draft-wysiwyg";
import "react-draft-wysiwyg/dist/react-draft-wysiwyg.css";
import "./Communication.css";
import { stateFromHTML } from "draft-js-import-html";
import { stateToHTML } from "draft-js-export-html";
import { EditorState } from "draft-js";
import Select from "components/Select";
const { Text } = Inputs;

class Communication extends Component {
  constructor(props) {
    super(props);

    this.submit = this.submit.bind(this);
    this.onEditorStateChange = this.onEditorStateChange.bind(this);
    const text = _.get(props, "communication.text");
    if (text) {
      this.state = {
        editorState: EditorState.createWithContent(stateFromHTML(text)),
      };
    } else {
      this.state = {
        editorState: EditorState.createEmpty(),
      };
    }
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
  }

  componentDidUpdate(prevProps) {
    const { communication } = this.props;
    if (communication && _.get(prevProps, "communication.text") !== communication.text) {
      this.setState({
        editorState: EditorState.createWithContent(stateFromHTML(communication.text)),
      });
    }
  }

  onEditorStateChange(editorState) {
    this.setState({
      editorState,
    });
    console.log(stateToHTML(this.state.editorState.getCurrentContent()));
  }

  submit() {
    const { onChange, submit } = this.props;
    const { editorState } = this.state;
    onChange(
      {
        target: {
          name: "text",
          value: stateToHTML(editorState.getCurrentContent()),
        },
      },
      submit
    );
  }

  render() {
    const { editorState } = this.state;
    let { t, canEdit, communication, onChange } = this.props;

    return (
      <Form onSubmit={this.submit} className={"form-horizontal form-grid"}>
        <Select
          isDisabled={!canEdit}
          labelClass="required"
          name={"decision"}
          placeholder={t("LABEL_DÉCISION")}
          iconLeft={"fa-exclamation"}
          options={Object.values(DecisionEnum)
            .filter((de) => typeof de === "object")
            .map((decisionEnum) => ({
              label: t(decisionEnum.label),
              value: decisionEnum.value,
            }))}
          sm={8}
          labelSm={4}
          label={t("LABEL_DÉCISION") + ":"}
          value={communication.decision}
          onChange={onChange}
        />
        <Editor
          editorState={editorState}
          readOnly={!canEdit}
          toolbarClassName={canEdit ? "toolbarClass" : "hidden"}
          wrapperClassName="editor-wrapper"
          editorClassName="editor"
          onEditorStateChange={this.onEditorStateChange}
        />
        <br />

        <ClonableInputs
          disabled={!canEdit}
          maxElements={10}
          minElements={0}
          value={communication.links || [""]}
          initButtonText={t("BTN_AJOUTER_UN_LIEN")}
          name="links"
          defaultValue=""
          onChange={onChange}
        >
          <Text
            disabled={!canEdit}
            iconLeft={"fa-link"}
            placeholder={"https://exemple.com/"}
            md={8}
            sm={8}
            labelSm={4}
            inputType="url"
            label={t("LABEL_URL") + ":"}
          />
        </ClonableInputs>
        <br />
        <br />
        {canEdit && (
          <Button
            onClick={this.submit}
            className={"col-md-6"}
            pullRight={true}
            type="success"
            text={t("BTN_CONFIRMER")}
          />
        )}
      </Form>
    );
  }
}

Communication.defaultProps = {
  communication: {},
};
export default withTranslation()(Communication);
