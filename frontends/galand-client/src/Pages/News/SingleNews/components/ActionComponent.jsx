import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import { Box, Button } from "adminlte-2-react";
import "../../News.css";
import { NewsStateENum } from "Enums";
import ConfirmModal from "@shared/Components/ConfirmModal";
import { Feed } from "modules/ressources";

class ActionComponent extends Component {
  constructor(props) {
    super(props);
    this.wasAffected = this.wasAffected.bind(this);
    this.canRefuse = this.canRefuse.bind(this);
    this.canVerify = this.canVerify.bind(this);
    this.canValidate = this.canValidate.bind(this);
    this.canPublish = this.canPublish.bind(this);
    this.removeNews = this.removeNews.bind(this);
  }
  wasAffected() {
    return true;
  }
  canRefuse() {
    const { status, permissions } = this.props;
    return status !== NewsStateENum.NON_APPROUVER.value && permissions["P_FAKENEWS_REJECTION"];
  }
  canVerify() {
    const { status, permissions } = this.props;
    return (
      (status === NewsStateENum.VERIFICATION.value && this.wasAffected()) ||
      ((status === NewsStateENum.VERIFICATION.value || status === NewsStateENum.NON_APPROUVER.value) &&
        permissions["P_NEWS_VERIFICATION"])
    );
  }
  canValidate() {
    const { permissions, status } = this.props;
    return status === NewsStateENum.VALIDATION.value && permissions["P_FAKENEWS_VALIDATION"];
  }
  canPublish() {
    const { permissions, status, isProject } = this.props;
    return status === NewsStateENum.PUBLICATION.value && permissions["P_FAKENEWS_PUBLISH"] && !isProject;
  }
  canDelete() {
    const { permissions } = this.props;
    return permissions["P_FAKENEWS_DELETE"];
  }

  removeNews() {
    const { news, updateFeed, getFeed, removeNews } = this.props;
    getFeed(news.originalArticle).then((feed) => {
      if (feed) {
        let selectedFor = feed.selectedFor ? feed.selectedFor : [];
        let occ = selectedFor ? selectedFor.filter((el) => el.newsId != news._id) : [];
        console.log(occ);
        updateFeed(
          {
            ...feed,
            selectedFor: occ,
          },
          removeNews
        );
      }
    });
  }

  render() {
    const { t, isProject } = this.props;
    const labelType = isProject ? "ARTICLES" : "FAKENEWS";
    return (
      <Box title={t("LABEL_ACTIONS")} type="info">
        {this.canRefuse() && (
          <Button
            block={true}
            type={"NON_APPROUVER"}
            text={t("BTN_ANNULER_LA_" + labelType)}
            onClick={() => this.props.onSubmit(NewsStateENum.NON_APPROUVER.value)}
          />
        )}
        {this.canVerify() && (
          <Button
            block={true}
            type={"VERIFICATION"}
            text={t("BTN_VERIFIER_LA_" + labelType)}
            onClick={() => this.props.onSubmit(NewsStateENum.VALIDATION.value)}
          />
        )}

        {this.canValidate() && (
          <Button
            key={"Valider la fakenews"}
            block={true}
            type={"VALIDATION"}
            text={t("BTN_VALIDER_LA_" + labelType)}
            onClick={() => this.props.onSubmit(NewsStateENum.PUBLICATION.value)}
          />
        )}
        {this.canPublish() && (
          <Button
            block={true}
            type={"CLASSIFIER"}
            text={t("BTN_PUBLIÉ_LA_" + labelType)}
            onClick={() => this.props.onSubmit(NewsStateENum.ARCHIVED.value)}
          />
        )}
        {this.canDelete() && (
          <ConfirmModal action={this.removeNews} buttonText={t("BTN_SUPPRIMER_LA_" + labelType)} />
        )}
      </Box>
    );
  }
}
function mapStateToProps(state) {
  return {
    permissions: state.persistedData.permissions,
    currentUserId: state.persistedData._id,
  };
}

function mapDispatchToProps(dispatch) {
  return {
    updateFeed: (data, cb) => dispatch(Feed.update(data), cb()),
    getFeed: (id) => dispatch(Feed.getOne(id, "singleFeed")),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ActionComponent));
