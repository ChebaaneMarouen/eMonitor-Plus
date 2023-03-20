import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import MyModal from "@shared/Components/MyModal";
import { NewsTypeEnum } from "Enums";
import { News, Tags } from "modules/ressources";
import NewsForm from "Pages/News/components/NewsForm";

class AddNewsModal extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  render() {
    const { t, projectId, permissions } = this.props;
    const newsToAdd = {
      newsType: NewsTypeEnum.PRESSE,
      projectId,
    };

    // if we are in the frame of a project
    const isProject = Boolean(projectId);

    const title = projectId
      ? t("TITLE_AJOUTER_AU_PROJECT")
      : t("TITLE_CREÉR_FAKENEWS");

    return (
      permissions["P_FAKENEWS"] >= 2 && (
        <MyModal
          hideSubmit={true}
          submitText={t("BTN_AJOUTER")}
          title={title}
          size="xl"
          button={<button className="rounded-add-btn">+</button>}
        >
          <NewsForm
            isProject={isProject}
            fixedNewsType={true}
            news={newsToAdd}
            isNew={true}
            callBack={this.toggle}
          />
        </MyModal>
      )
    );
  }
}

AddNewsModal.defaultProps = {
  existingTags: [],
  project: {},
};

function mapStateToProps(state) {
  return {
    existingTags: state.data.tags,
    permissions: state.persistedData.permissions,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    onSubmit: (data, toggleModal) =>
      dispatch(
        News.insert(data, (err) => {
          //if no errors we hide the modal
          if (!err) toggleModal();
        })
      ),
    getTags: () => dispatch(Tags.get()),
  };
}

export default withTranslation()(
  connect(mapStateToProps, mapDispatchToProps)(AddNewsModal)
);
