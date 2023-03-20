import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";
import { NewsTypeEnum } from "Enums";
import { News, Feed, Tags } from "modules/ressources";
import NewsForm from "Pages/News/components/NewsForm";

class AddNewsModal extends Component {
  constructor(props) {
    super(props);
    this.updateFeed = this.updateFeed.bind(this);
    
  }
  closeModal=()=>{
    document.querySelector("div.fade.in.modal > div > div > div.modal-header > button").click()
  }
  updateFeed(data) {
    if(data && data.news){
      const {_id, title} = data.news;
      const { project, news, updateFeed } = this.props;
      const type = project ? project._id ? "monitoring" : "fakenews":"fakenews";
      const name = project ? project._id ? project.title : "fakenews" : "fakenews";
      let { selectedFor = [] } = news;
      selectedFor.push({ newsId: _id, newsTitle: title, type, name });
      updateFeed({
        ...news,
        selectedFor,
      }, this.closeModal);
    }    
  }

  render() {
    const { news, t, project, permissions, showAddFakeNewsButton, fromProject } = this.props;
    const projectId = fromProject ? this.props.projectId : project._id;
    const projectName = project.title;
    console.log("========********========\n", news)
    const newsToAdd = {
      title: news.title ? news.title : news.url,
      link: news.url,
      videoUrl: news.video_url,
      coverImage: news.image_url,
      text: news.text,
      analyse : news.analyse,
      media : news.media,
      source : news.source,
      like_count : news.source === "twitter" ? news.like_count: news.source === "youtube" ? news.likes : news.source === "facebook" ? news.likes_count : 0,
      nbre_share : news.source === "twitter" ? news.retweet_count : news.source === "facebook" ? news.shares :0,
      firstCrawlTime : new Date(news.firstCrawlTime),
      author : news.author,
      reactions : {
        count_angry : news.count_angry,
        count_care: news.count_care,
        count_comments: news.count_comments,
        count_haha: news.count_haha,
        count_love: news.count_love,
        count_sad: news.count_sad,
        count_wow: news.count_wow
      },
      projectId,
      originalArticle: String(news._id),
      data_comments :  news.comments
    };
    console.log("project********", project, fromProject)
    // if we are in the frame of a project
    const isProject = Boolean(projectId);

    if (!isProject && !showAddFakeNewsButton) return null;

    const title = projectId
      ? `${t("TITLE_AJOUTER_AU_PROJECT")} ${projectName ? projectName : t("PROJECT")}`
      : t("TITLE_CREÉR_FAKENEWS");
    return (
      permissions["P_FAKENEWS"] >= 2 && (
        <MyModal
          submitText={fromProject && t("BTN_AJOUTER")}
          hideSubmit={true}
          submit={this.submit}
          title={title}
          size="xl"
          button={
            fromProject ? (
              <button className="rounded-add-btn">+</button>
            ) : (
              <Button block={true} pullRight={true} icon={"fa-plus"} type="success" text={title} />
            )
          }
        >
          <NewsForm
            isProject={isProject}
            projectName={projectName}
            fixedNewsType={true}
            news={newsToAdd}
            isNew={true}
            callBack={this.updateFeed}
          />
        </MyModal>
      )
    );
  }
}

AddNewsModal.propTypes = {
  showAddFakeNewsButton: PropTypes.bool,
};

AddNewsModal.defaultProps = {
  existingTags: [],
  project: {},
  news: {},
  showAddFakeNewsButton: false,
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
    updateFeed: (data, toggleModal) =>
      dispatch(
        Feed.update(data, (err) => {
          if (!err) toggleModal();
        })
      ),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AddNewsModal));
