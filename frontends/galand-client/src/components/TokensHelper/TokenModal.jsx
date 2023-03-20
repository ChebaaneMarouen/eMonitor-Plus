import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { Content } from "adminlte-2-react";

class TokenModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
    token: PropTypes.object
  };
  static defaultProps = {
    token: {
      data_access_expiration_time: new Date().getTime()
    }
  };

  constructor(props) {
    super(props);
    this.state = {
      showModal: false
    };
  }

  componentDidUpdate(prevProps, prevState) {
    if (prevProps.token !== this.props.token) {
      this.setState({
        showModal: true
      });
    }
  }
  toggle = () => {
    this.setState({
      showModal: !this.state.showModal
    });
  };

  render() {
    const { t, token } = this.props;
    const { showModal } = this.state;
    return (
      <Content
        show={showModal}
        onHide={this.toggle}
        modal
        title={t("TITLE_REQUESTED_TOKENS")}
      >
        <div>
          <dt>{t("LABEL_TOKEN_TYPE")}</dt>
          <dd>{token.type}</dd>
        </div>
        <div>
          <dt>{t("LABEL_ACCESS_TOKEN")}</dt>
          <dd style={{ wordBreak: "break-all" }}>{token.accessToken}</dd>
        </div>
        <div>
          <dt>{t("LABEL_TOKEN_EXPIRATION")}</dt>
          <dd>
            {token["data_access_expiration_time"] &&
              new Date(token["data_access_expiration_time"] * 1000)
                .toISOString()
                .replace("T", " ")}
          </dd>
        </div>
      </Content>
    );
  }
}

export default withTranslation()(TokenModal);
