import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import CrudPage from "@shared/Pages/crudPage";
import MediaForm from "./components/MediasForm";
import { Medias } from "modules/ressources";
import "./Medias.css";
import PropTypes from "prop-types";
import _ from "lodash";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";

function createIcons(media) {
  return (
    <span>
      {media.links.map((el) => {
        {
          let source = el.source?el.source.toLowerCase().trim():"";
          return (
            <span className={"datasources-icons"}>
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
}

function mapStateToProps(state) {
  return {
    data: state.data.medias,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    initFunction: () => {
      dispatch(Medias.get());
    },
    insert: (data, toggleModal) => {
      dispatch(
        Medias.insert(data, (err) => {
          if (!err) toggleModal();
        })
      );
    },
    remove: (media) => dispatch(Medias.remove(media)),
    update: (data, toggleModal) => {
      dispatch(
        Medias.update(data, (err) => {
          if (!err) toggleModal();
        })
      );
    },
  };
}

const MediasCrudPage = withTranslation()(connect(mapStateToProps, mapDispatchToProps)(CrudPage));
class MediasPage extends Component {
  constructor(props) {
    super(props);
    this.state = { fields: this.getColumns(this.props.t).map((c) => c.field) };
  }

  getColumns(t) {
    return [
      {
        label: t("LABEL_NOM"),
        field: "name",
        sort: "asc",
      },
      {
        label: t("LABEL_RÉSEAUX"),
        field: "sources",
        getter: (media) => createIcons(media),
      },
      {
        label: t("LABEL_ARTICLES"),
        field: "countArticles",
      },
      {
        label: t("LABEL_FAKE_NEWS"),
        field: "countFakeNews",
      },
      {
        label: t("LABEL_INFRACTIONS"),
        field: "countInfractions",
      },
      {
        label: t("LABEL_ACTIONS"),
        field: "actions",
        sort: "disabled",
      },
    ];
  }

  render() {
    const { t } = this.props;

    return (
      <div>
        <MediasCrudPage
          title={t("TITLE_GESTION_DES_MÉDIAS")}
          browserTitle={t("TITLE_GESTION_DES_MÉDIAS")}
          columns={this.getColumns(t)}
          Form={MediaForm}
          permission={this.props.permission}
          t={t}
          addTitle={t("BTN_AJOUTER_UN_MÉDIA")}
        />
      </div>
    );
  }
}

MediasPage.propTypes = {
  className: PropTypes.string,
  medias: PropTypes.arrayOf(PropTypes.object),
};

MediasPage.defaultProps = {
  medias: [],
};
export default withTranslation()(MediasPage);
