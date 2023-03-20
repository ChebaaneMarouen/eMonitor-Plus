import React, { useEffect } from "react";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import { Link } from "react-router-dom";
import { Col, SimpleTable, Box } from "adminlte-2-react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { TypedNews } from "modules/ressources";
import Tag from "../../../components/Tags/Tag";
import { Tags } from "modules/ressources";

const NEWS = TypedNews("all", "", "fakenewsInfractions");

function LatestInfractions({ t, fakenewsInfractions, filterNews, getTags }) {
  useEffect(() => {
    filterNews();
    getTags();
  }, []);
  const getColumns = (t) => {
    return [
      { title: t("LABEL_INFRACTION"), data: "infraction" },
      { title: t("LABEL_STATUS"), data: "status" },
    ];
  };
  const infractionData = fakenewsInfractions.map((n) => ({
    infraction: (
      <div>
        <Link to={"/news/" + n._id} /*fromPage={true}*/>
          {n.title} &nbsp;&nbsp;
        </Link>
        <div style={{ margin: "5px 0" }}>
          {
            (n.subjects.map((tag) => <Tag tag={tag} key={tag} />),
            n.categories.map((tag) => <Tag tag={tag} key={tag} />))
          }
        </div>
      </div>
    ),
    status: (
      <div>
        {(n.infraction.status == 1 && (
          <span className={"label"} style={{ backgroundColor: "orange" }}>
            {t("INFRACTION_A_VALIDER")}
          </span>
        )) ||
          (n.infraction.status == 2 && (
            <span className={"label"} style={{ backgroundColor: "green" }}>
              {t("INFRACTION_VALIDE")}
            </span>
          ))}
      </div>
    ),
  }));

  return (
    <Box
      collapsable={false}
      border={false}
      type={"danger"}
      header={
        <div>
          <h4 className={"text-center text-lg"}>{t("TEXT_LATEST_FAKENEWS_INFRACTIONS")}</h4>
        </div>
      }
      footer={
        <Link to="/infractions" className={"small-box-footer"}>
          {t("TEXT_VOIR_TOUTES_LES_INFRACTIONS")}{" "}
          <FontAwesomeIcon icon={splitIcon("fa-arrow-circle-right")} />
        </Link>
      }
    >
      <SimpleTable
        footer={true}
        hover={true}
        striped={true}
        border={true}
        responsive={true}
        columns={getColumns(t)}
        data={infractionData}
      />
    </Box>
  );
}

LatestInfractions.propTypes = {
  fakenewsInfractions: PropTypes.arrayOf(PropTypes.object),
};

LatestInfractions.defaultProps = {
  fakenewsInfractions: [],
};

function mapDispatchToProps(dispatch) {
  return {
    getTags: () => {
      dispatch(Tags.get());
    },
    filterNews: () =>
      dispatch(
        NEWS.search(
          {
            filter: { "after_infraction.status": "1" },
            sort: [{}],
          },
          { page: 0, size: 4 }
        )
      ),
  };
}
function mapStateToProps(state) {
  return {
    fakenewsInfractions: state.data.fakenewsInfractions,
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(LatestInfractions));
