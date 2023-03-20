import React, { useEffect } from "react";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import { Link } from "react-router-dom";
import { Col, SimpleTable, Box } from "adminlte-2-react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { Medias } from "modules/ressources";

function DataSources({ t, medias, getMedias }) {
  useEffect(() => {
    getMedias();
  }, []);
  const createIcons = (media) => {
    return (
      <span>
        {media.links.map((el,i) => {
          {
            let source = el.source.toLowerCase().trim();
            return (
              <span className={"datasources-icons"} key={i}>
                {(source == "facebook" && (
                  <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fab-facebook")} />
                )) ||
                  (source == "twitter" && (
                    <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fab-twitter")} />
                  )) ||
                  (source == "website" && (
                    <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fa-globe")} />
                  )) ||
                  (source == "rss" && (
                    <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fa-rss")} />
                  )) ||
                  (source == "youtube" && (
                    <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fab-youtube")} />
                  )) ||
                  (source == "instagram" && (
                    <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fab-instagram")} />
                  )) ||
                  (source == "sitemap" && (
                    <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fa-sitemap")} />
                  ))}
              </span>
            );
          }
        })}
      </span>
    );
  };
  const getColumns = (t) => {
    return [
      { title: t("LABEL_NOM"), data: "name" },
      { title: t("LABEL_RÉSEAUX"), data: "sources" },
      { title: t("LABEL_ARTICLES"), data: "countArticles" },
      { title: t("LABEL_INFRACTIONS"), data: "countInfractions" },
    ];
  };

  const mediaData = medias.slice(0, 7).map((media) => ({
    ...media,
    sources: createIcons(media),
  }));

  return (
    <Box
      collapsable={false}
      border={false}
      type={"warning"}
      header={
        <div>
          <h4 className={"text-center text-lg"}>{t("TITLE_GESTION_DES_MÉDIAS")}</h4>
        </div>
      }
      footer={
        <Link to="/manage-medias" className={"small-box-footer"}>
          {t("TEXT_VOIR_TOUTES_LES_MEDIAS")}{" "}
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
        data={mediaData}
      />
    </Box>
  );
}

DataSources.propTypes = {
  medias: PropTypes.arrayOf(PropTypes.object),
};

DataSources.defaultProps = {
  medias: [],
};

function mapStateToProps(state) {
  return {
    medias: state.data.medias,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMedias: () => {
      dispatch(Medias.get());
    },
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(DataSources));
