import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { TypedNews, Tags } from "modules/ressources";
import { Box, Button, Col, Row } from "adminlte-2-react";
import { Link } from "react-router-dom";
import FileComponent from "components/File";
import {
  getKeyByValue,
  NewsStateENum,
  NewsTypeEnum,
  PrioriteEnum
} from "Enums";
import Label from "reactstrap/es/Label";
import Tag from "components/Tags";
import "../../News.css";
import { ImpactEnum } from "../../../../Enums";
import { MDBDataTable } from "mdbreact";

const columns = [
  {
    title: "Libelle",
    data: "label"
  }
];

class DashboardList extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { getNews, type } = this.props;
    getNews(type);
  }

  render() {
    let { news, t } = this.props;
    const data = { ...this.data, rows: news };

    return (
      <Col sm={12} md={9}>
        <Box
          collapsable={false}
          className={"box-header-100-px box-body-500-px box-footer-70-px"}
          border={true}
          type={"primary"}
          header={
            <div>
              <h4 className={"text-center text-lg"}>
                {t("TITLE_MES_FAKENEWS")}
              </h4>
            </div>
          }
          footer={
            <Button
              size={"xs"}
              className={"margin-r-5"}
              icon={"fa-edit"}
              type="warning"
            />
          }
        >
          <MDBDataTable
            entriesLabel={t("TEXT_AFFICHER_LES_RÉSULTATS")}
            infoLabel={[
              t("TEXT_AFFICHAGE"),
              t("TEXT_DE"),
              t("TEXT_SUR"),
              t("TEXT_RESULTAT")
            ]}
            paginationLabel={[t("TEXT_PRECEDENT"), t("TEXT_SUIVANT")]}
            searchLabel={t("TEXT_RECHERCHE")}
            striped
            bordered
            hover
            data={data}
            responsive
            autoWidth
          />
        </Box>
      </Col>
    );
  }
}

DashboardList.propTypes = {
  className: PropTypes.string,
  news: PropTypes.arrayOf(PropTypes.object)
};

DashboardList.defaultProps = {
  news: []
};

function mapStateToProps(state) {
  return {
    news: state.data.news
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getNews: type => dispatch(TypedNews(type).get())
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(DashboardList)
);
