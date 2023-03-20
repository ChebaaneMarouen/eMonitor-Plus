import React, { Component } from "react";
import PropTypes from "prop-types";
import _ from "lodash";
import { connect } from "react-redux";
import { FacebookProvider, LoginButton } from "react-facebook";
import { withTranslation } from "react-i18next";
import { Button } from "reactstrap";

class AddInstagramToken extends Component {
  static propTypes = {
    onResponse: PropTypes.func.isRequired
  };

  constructor(props) {
    super(props);
  }

  handleResponse = data => {
    const { onResponse } = this.props;
    onResponse(data && data.tokenDetail);
    console.log(data);
  };

  handleError = error => {
    this.setState({ error });
  };

  render() {
    const { appId, t } = this.props;

    if (!appId) {
      return <div>{t("MESSAGE_SET_APPID_IN_INSTAGRAM_CRAWLER_TO_ENABLE")}</div>;
    }
    console.log("APP ID", appId);
    return (
      <div>
        <FacebookProvider appId={appId}>
          <LoginButton
            scope="instagram_basic,instagram_manage_insights,pages_show_list,manage_pages"
            onCompleted={this.handleResponse}
            onError={this.handleError}
          >
            <span>Get Instagram Access Token</span>
          </LoginButton>
        </FacebookProvider>
      </div>
    );
  }
}

function mapStateToProps(state) {
  const { settings } = state.data;
  // extract insta settings from list of settings
  const instaSettings = Array.isArray(settings)
    ? settings.filter(s => s._id === "Instagram Crawler")[0]
    : {};

  return {
    settings,
    appId: _.get(instaSettings, "appId.value", "")
  };
}
export default withTranslation()(connect(mapStateToProps)(AddInstagramToken));
