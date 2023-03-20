import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Monitors } from "modules/ressources";
import { Content, Row, Col, Box } from "adminlte-2-react";
import "./News.css";
import { NewsTypeEnum } from "../../Enums";
import NewsForm from "./components/NewsForm";

class Addnews extends Component {
  constructor(props) {
    super(props);
  }
  componentWillMount() {
    const { getMonitors } = this.props;
    getMonitors();
  }
  render() {
    const { t, permission } = this.props;
    console.log(permission);
    return (
      permission >= 2 && (
        <Content
          title={t("TITLE_AJOUTER_UNE_FAKENEWS")}
          browserTitle={t("TITLE_AJOUTER_UNE_FAKENEWS")}
        >
          <Box typeNews="success">
            <NewsForm newsType={NewsTypeEnum.PRESSE} />
          </Box>
        </Content>
      )
    );
  }
}

function mapDispatchToProps(dispatch) {
  return {
    getMonitors: () => dispatch(Monitors.get())
  };
}
export default withTranslation()(
  connect(
    null,
    mapDispatchToProps
  )(Addnews)
);
