import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Link } from "react-router-dom";

class CountBox extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const { t } = this.props;
    return (
      <div className={this.props.className}>
        <div className={"small-box " + this.props.color}>
          <div className="inner">
            <h3>{this.props.count}</h3>

            <p className="ellepsis">{this.props.text}</p>
          </div>
          <div className="icon">
            <FontAwesomeIcon icon={splitIcon(this.props.icon)} />
          </div>
          <Link to={this.props.link} className={"small-box-footer"}>
            {t("TEXT_PLUS_DINFORMATIONS")} <FontAwesomeIcon icon={splitIcon("fa-arrow-circle-right")} />
          </Link>
        </div>
      </div>
    );
  }
}

export default withTranslation()(CountBox);
