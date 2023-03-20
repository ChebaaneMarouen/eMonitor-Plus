import React, { Component } from "react";
import PropTypes from "prop-types";
import AddInstagramToken from "./AddInstagramToken";
import TokenModal from "./TokenModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

class TokensHelper extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  constructor(props) {
    super(props);
    this.state = {
      token: {}
    };
  }

  onError = error => {
    alert(JSON.stringify(error, null, 2));
    this.setState({
      error
    });
  };

  onResponse = token => {
    this.setState({
      token: { ...token, type: "instagram" }
    });
  };

  render() {
    const { token } = this.state;
    return (
      <div>
        <div className="btn-group">
          <button
            type="button"
            className="btn btn-box-tool dropdown-toggle"
            data-toggle="dropdown"
          >
            <FontAwesomeIcon icon={"address-book"} />
          </button>
          <ul className="dropdown-menu" role="menu">
            <li>
              <AddInstagramToken
                onError={this.onError}
                onResponse={this.onResponse}
              />
            </li>
            <li>
              <TokenModal token={token} />
            </li>
          </ul>
        </div>
      </div>
    );
  }
}

export default TokensHelper;
