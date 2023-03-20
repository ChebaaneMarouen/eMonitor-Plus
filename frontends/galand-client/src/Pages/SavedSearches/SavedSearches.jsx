import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Content, Row, Col, Box } from "adminlte-2-react";
import SavedSearchesList from "./components/SavedSearchesList";

class SavedSearchesComponent extends Component {
  render() {
    const { t, permission } = this.props;
    return (
      <Content
        title={t("TITLE_GESTION_DES_SEARCHES")}
        browserTitle={t("TITLE_GESTION_DES_SEARCHES")}
      >
        <Box>
          <SavedSearchesList permission={permission} />
        </Box>
      </Content>
    );
  }
}

export default withTranslation()(SavedSearchesComponent);
