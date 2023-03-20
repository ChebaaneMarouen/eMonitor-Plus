import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Button, Row, Col } from "adminlte-2-react";
import SimilaritySearchModal from "./SimilaritySearchModal";

class SimilaritySearchTab extends Component {
  constructor(props) {
    super(props);
    this.undoSimilaritySearch = this.undoSimilaritySearch.bind(this);
  }
  undoSimilaritySearch() {
    const { onChangeFilter } = this.props;
    onChangeFilter({ target: { name: "moreLike_", value: undefined } });
  }
  render() {
    const { fields, onChangeFilter, showClearButton, labels, t } = this.props;
    return (
      <Row>
        <Row>
          <center>
            <SimilaritySearchModal
              fields={["title"]}
              label={t("BTN_SEARCH_SIMILAR_TITLES")}
              onSubmit={onChangeFilter}
              size="md"
            />
            <SimilaritySearchModal
              fields={["text"]}
              label={t("BTN_SEARCH_SIMILAR_TEXT")}
              size="md"
              onSubmit={onChangeFilter}
            />
          </center>
        </Row>
        <Row hidden={!showClearButton}>
          <center>
            <Button
              text={t("BTN_UNDO_SIMILATY_SEARCH")}
              onClick={this.undoSimilaritySearch}
              type="danger"
            />
          </center>
        </Row>
      </Row>
    );
  }
}

SimilaritySearchTab.defaultProps = {
  onChangeFilter: PropTypes.func.isRequired,
  showClearButton: PropTypes.bool.isRequired,
  t: PropTypes.func
};

SimilaritySearchTab.defaultProps = {
  t: String
};

export default withTranslation()(SimilaritySearchTab);
