import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Content, Row, Col, Box, Button } from "adminlte-2-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class WebCrawlingConfig extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    dispatch: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
    this.state = {};
  }

  render() {
    const { t } = this.props;
    return (
      <div>
        <Content
          title={t("TITLE_WEB_SCRAPPER_PARSING_CONFIG")}
          browserTitle={t("TITLE_WEB_SCRAPPER_PARSING_CONFIG")}
        >
          <Row>
            <Col xs={6} />
            <Col xs={6} />
          </Row>
        </Content>
      </div>
    );
  }
}

function mapStateToProps(state) {
  return {};
}

export default withTranslation()(connect(mapStateToProps)(WebCrawlingConfig));
