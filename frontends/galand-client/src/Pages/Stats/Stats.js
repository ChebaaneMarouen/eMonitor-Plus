import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Content, Row, Col } from "adminlte-2-react";
class Stats extends Component {
  render() {
    const { t } = this.props;
    return (
      <div className="embed-responsive embed-responsive-4by3">
        <iframe
          src="/stats"
          className="embed-responsive-item"
          style={{ Border: "none", Overflow: "hidden" }}
          scrolling={"yes"}
          frameBorder={"0"}
          allowTransparency="true"
          allow="encrypted-media"
        />
      </div>
    );
  }
}

export default withTranslation()(Stats);
