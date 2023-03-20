import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import MyModal from "@shared/Components/MyModal";
import { Button, Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";

import PropTypes from "prop-types";
const { Text } = Inputs;

class SimilaritySearchModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      like: props.text,
      fields: props.fields,
      max_query_terms: 30,
      min_word_length: 4,
      min_term_freq: 1,
      min_doc_freq: 1
    };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  submit(toggleModal) {
    console.log(this.state);
    const { onSubmit } = this.props;
    onSubmit({ target: { name: "moreLike_", value: this.state } });
    toggleModal();
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value
    });
  }

  render() {
    const {
      like,
      max_query_terms,
      min_word_length,
      min_term_freq,
      min_doc_freq
    } = this.state;
    const { t, label, size } = this.props;
    return (
      <MyModal
        className={"inline"}
        button={
          <Button
            onClick={() => this.openModal(false)}
            className={"margin-r-5"}
            size={size}
            icon={"fa-search"}
            text={label}
            type="info"
          />
        }
        submitText={t("BTN_SEARCH")}
        submitType={"success"}
        submit={this.submit}
        title={t("TITLE_SIMILARITY_SEARCH")}
      >
        <Form className={"form-horizontal"}>
          <Text
            inputType="textarea"
            onChange={this.onChange}
            name={"like"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_TEXT") + ":"}
            placeholder={t("LABEL_TEXT")}
            value={like}
          />
          <Text
            onChange={this.onChange}
            inputType="number"
            name={"max_query_terms"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_MAX_QUERY_TERMS") + ":"}
            placeholder={t("LABEL_MAX_QUERY_TERMS")}
            value={max_query_terms}
          />
          <Text
            onChange={this.onChange}
            inputType="number"
            name={"min_word_length"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_MIN_WORD_LENGTH") + ":"}
            placeholder={t("LABEL_MIN_WORD_LENGTH")}
            value={min_word_length}
          />
          <Text
            onChange={this.onChange}
            inputType="number"
            name={"min_term_freq"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_MIN_TERM_FREQ") + ":"}
            placeholder={t("LABEL_MIN_TERM_FREQ")}
            value={min_term_freq}
          />
          <Text
            onChange={this.onChange}
            inputType="number"
            name={"min_doc_freq"}
            iconLeft={"fa-pen"}
            sm={8}
            labelSm={4}
            label={t("LABEL_MIN_DOC_FREQ") + ":"}
            placeholder={t("LABEL_MIN_DOC_FREQ")}
            value={min_doc_freq}
          />
        </Form>
      </MyModal>
    );
  }
}

SimilaritySearchModal.propTypes = {
  fields: PropTypes.arrayOf(PropTypes.string).isRequired,
  label: PropTypes.string.isRequired, // submit button label
  text: PropTypes.string,
  t: PropTypes.func,
  size: PropTypes.string
};
SimilaritySearchModal.defaultProps = {
  t: String,
  text: "",
  size: "xs"
};

export default withTranslation()(SimilaritySearchModal);
