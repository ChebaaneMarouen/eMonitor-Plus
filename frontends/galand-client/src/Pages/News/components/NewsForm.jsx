import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Inputs, Button } from "adminlte-2-react";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import Form from "reactstrap/es/Form";
import { NewsTypeEnum } from "Enums";
import { News, Tags, SimilarNews, ConstituencyRessource, ActorRessource } from "modules/ressources";
import Select from "components/Select";
import Upload from "@shared/Components/Upload";
import { newsFilePath, coverImagesPath } from "modules/ressources";
import ImagePreview from "./ImagePreview";
import LoadingScreen from "components/LoadingScreen";
import SubmitionConfirm from "./SubmitionConfirm";

const { Text, Checkbox, ImportWrapper, Date } = Inputs;

class NewsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: this.props.news,
      step: "addingNews"
    };

    this.submitNews = this.submitNews.bind(this);
    this.cancelNewsCreation = this.cancelNewsCreation.bind(this);
    this.onChange = this.onChange.bind(this);
    this.isUpdate = this.isUpdate.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentWillMount() {
    const { getTags, getActors, getConstituency } = this.props;
    getTags();
    getActors();
    getConstituency()
  }
  componentDidMount(){
    const { news} = this.state;
    const {existingTags} = this.props;
    let initialValueCat, initialValueSub;
    if(existingTags && !news.categories){
          const existingCategories = existingTags.filter(tag => tag.isCategory);
          initialValueCat = existingCategories[0]? existingCategories[0]._id : undefined
          
    }
    if(existingTags && !news.subjects){
      const existingCategories = existingTags.filter(tag => !tag.isCategory);
      initialValueSub = existingCategories[0]? existingCategories[0]._id : undefined
      
    }
    
    this.setState({
            news: { ...news, categories: [initialValueCat], subjects : [initialValueSub]}
          });
  }
  componentDidUpdate(prevProps, prevState) {
    const { news } = this.props;
    if (!_.isEqual(prevProps.news, news)) {
      this.setState({ news });
    }
  }

  getFiablityOptions(t) {
    return [
      {
        label: t("TEXT_PAS_FIABLE"),
        value: 0
      },
      {
        label: t("TEXT_MOYENNEMENT_FIABLE"),
        value: 1
      },
      {
        label: t("TEXT_TRES_FIABLE"),
        value: 2
      }
    ];
  }

  isUpdate() {
    const { isNew, news } = this.props;
    return !Boolean(isNew) && Boolean(news._id);
  }

  initState() {
    if (this.isUpdate()) return this.state;
    return { news: {} };
  }

  onSubmit(e) {
    e.preventDefault();
    const { searchSimilarNews } = this.props;
    const { title, text, link } = this.state.news;
    if (this.isUpdate()) return this.submitNews();
    /*this.setState({
      step: "CHECKING_SIMILARITY"
    });
    searchSimilarNews({ title, text, link }, (err, data) => {
      if (err) {
        console.log(err);
        this.setState({
          step: "START"
        });
      }
      if (data.length) {
        // there is similar news and we should check before submissions
        this.setState({
          step: "CHECK_BEFORE_SHOWING_RESULTS"
        });
      } else {
        // there is no similar news
        this.submitNews();
      }
    });*/
    this.submitNews();
  }

  submitNews() {
    const { insert, update, callBack } = this.props;
    const { news } = this.state;
    const onSubmit = this.isUpdate() ? update : insert;
    onSubmit(news, (err, data) => {
      this.setState({
        step: "START"
      });
      if (!err) {
        this.setState(this.initState());
        console.log("hey data", data)
        if (typeof callBack === "function") callBack(data);
      }
    });
  }

  cancelNewsCreation() {
    const { callBack } = this.props;
    this.setState({
      step: "START"
    });
    if (typeof callBack === "function") callBack();
  }

  onChange(e) {
    const { news } = this.state;
    const { name, value } = e.target;
    this.setState({
      news: { ...news, [name]: value }
    });
  }

  render() {
    const {
      t,
      permissions,
      monitors,
      isProject,
      existingTags,
      currentUserId,
      actors,
      constituencys
    } = this.props;
    const { step, news } = this.state;
    const {
      title,
      link,
      files,
      subjects,
      categories,
      reliability,
      additionalLinks,
      text,
      monitor,
      dueDate,
      userCoverImage,
      videoUrl,
      downloadVideo,
      coverImage,
      downloadImage,
      constituency,
      actor,
      count_comments,
      like_count,
      nbre_share
    } = news;

    console.log("constituency", constituencys)

    if (step === "CHECKING_SIMILARITY")
      return <LoadingScreen title={t("TEXT_CHECKING_SIMILARITY")} />;
    if (step === "CHECK_BEFORE_SHOWING_RESULTS")
      return (
        <SubmitionConfirm
          cancelNewsCreation={this.cancelNewsCreation}
          submitNews={this.submitNews}
        />
      );

    const existingCategories = existingTags.filter(tag => tag.isCategory);
    const existingSubjects = existingTags.filter(tag => !tag.isCategory);

    let selectedCategorie = []

    if(categories) {
      selectedCategorie = existingCategories.filter(el=> el._id === categories[0])
    }
    
    console.log("selectedCategorie", selectedCategorie)

    // will configure whether to use the word "news" of "article"
    const labelType = isProject ? "ARTICLE" : "NEWS";

    const inputSize = { labelMd: 2, md: 10, labelSm: 4, sm: 8 };
    
    return (
      <Form onSubmit={this.onSubmit} className={"form-horizontal form-grid"}>
        <Col xs={12}>
          <Text
            labelClass={"required"}
            iconLeft={"fa-pen"}
            placeholder={t("LABEL_TITLE")}
            {...inputSize}
            value={title || ""}
            name="title"
            onChange={this.onChange}
            label={t("LABEL_TITLE") + ":"}
          />
          <Text
            onChange={this.onChange}
            value={link || ""}
            labelClass={"required"}
            inputType={"url"}
            iconLeft={"fa-link"}
            placeholder={"https://exemple.com/"}
            buttonRight={
              link && (
                <ImagePreview
                  onChange={this.onChange}
                  name={"coverImage"}
                  url={link}
                />
              )
            }
            {...inputSize}
            label={t("LABEL_LIEN_DE_LARTICLE") + ":"}
            name="link"
          />
          <Text
            onChange={this.onChange}
            value={coverImage || ""}
            inputType={"url"}
            iconLeft={"fa-link"}
            placeholder={t("LABEL_IMAGE_URL")}
            {...inputSize}
            label={t("LABEL_IMAGE_URL") + ":"}
            name="coverImage"
          />
          {coverImage && (
            <Checkbox
              text={t("LABEL_DOWNLOAD_IMAGE")}
              value={!!downloadImage}
              onChange={() =>
                this.onChange({
                  target: { name: "downloadImage", value: !downloadImage }
                })
              }
            />
          )}
          <Text
            iconLeft={"fa-video"}
            placeholder={"https://exemple.com/"}
            {...inputSize}
            inputType={"url"}
            value={videoUrl || ""}
            name="videoUrl"
            onChange={this.onChange}
            label={t("LABEL_VIDEO_URL") + ":"}
          />
          {videoUrl && (
            <Checkbox
              text={t("LABEL_DOWNLOAD_VIDEO")}
              value={!!downloadVideo}
              onChange={() =>
                this.onChange({
                  target: { name: "downloadVideo", value: !downloadVideo }
                })
              }
            />
          )}
          <Select
            placeholder={t("LABEL_CHOISIR_UN_DES_SUJETS")}
            iconLeft={"fa-tags"}
            options={existingSubjects.map(t => ({
              label: t.label,
              value: t._id
            }))}
            multiple={true}
            allowClear={true}
            {...inputSize}
            labelClass={"required"}
            label={t("LABEL_SUJETS") + ":"}
            name="subjects"
            value={subjects}
            onChange={this.onChange}
          />
          <Select
            placeholder={t("LABEL_CHOISIR_UN_DES_CATEGORY")}
            iconLeft={"fa-tags"}
            value={categories}
            options={existingCategories.map(t => ({
              label: t.label,
              value: t._id
            }))}
            multiple={true}
            allowClear={true}
            {...inputSize}
            labelClass={"required"}
            label={t("LABEL_CATEGORIES") + ":"}
            name="categories"
            onChange={this.onChange}
          />
          {categories && categories.length && selectedCategorie.length?
            <Select
            placeholder={t("LABEL_CHOISIR_UN_DES_CONSTITUENCY")}
            iconLeft={"fa-tags"}
            value={constituency}
            options={constituencys.filter(el=>el.governorate === selectedCategorie[0].label).map(t => ({
              label: t.name,
              value: t.name
            }))}
            allowClear={true}
            {...inputSize}
            labelClass={"required"}
            label={t("LABEL_CONSTITUENCY") + ":"}
            name="constituency"
            onChange={this.onChange}
          />:null
          }
          {constituency && categories && categories.length?
            <Select
            placeholder={t("LABEL_CHOISIR_UN_DES_ACTORS")}
            iconLeft={"fa-tags"}
            value={actor}
            options={actors.filter(el=>el.constituency === constituency).map(t => ({
              label: t.name,
              value: t.name
            }))}
            allowClear={true}
            {...inputSize}
            labelClass={"required"}
            label={t("LABEL_ACTOR") + ":"}
            name="actor"
            onChange={this.onChange}
          />:null
          }
          <Text
            iconLeft={"fa-comment"}
            placeholder={t("LABEL_COMMENTS_NUMBER")}
            {...inputSize}
            inputType ={"number"}
            value={count_comments || ""}
            name="count_comments"
            onChange={this.onChange}
            label={t("LABEL_COMMENTS_NUMBER") + ":"}
          />
          <Text
            iconLeft={"fa-thumbs-up"}
            placeholder={t("LABEL_LIKES_NUMBER")}
            {...inputSize}
            inputType ={"number"}
            value={like_count || ""}
            name="like_count"
            onChange={this.onChange}
            label={t("LABEL_LIKES_NUMBER") + ":"}
          />
          <Text
            iconLeft={"fa-share-alt"}
            placeholder={t("LABEL_SHARES_NUMBER")}
            {...inputSize}
            inputType ={"number"}
            value={nbre_share || ""}
            name="nbre_share"
            onChange={this.onChange}
            label={t("LABEL_SHARES_NUMBER") + ":"}
          />
          
          <Select
            name="reliability"
            placeholder={t("LABEL_FIABILITÉ")}
            iconLeft={"fa-stamp"}
            value={reliability}
            options={this.getFiablityOptions(t)}
            {...inputSize}
            label={t("LABEL_FIABILITÉ") + ":"}
            onChange={this.onChange}
          />
          <ClonableInputs
            maxElements={4}
            minElements={1}
            value={additionalLinks || [""]}
            name="additionalLinks"
            defaultValue=""
            onChange={this.onChange}
          >
            <Text
              inputType={"url"}
              iconLeft={"fa-link"}
              placeholder={"https://exemple.com/"}
              {...inputSize}
              label={t("LABEL_URL_SUPPLÉMENTAIRE") + ":"}
            />
          </ClonableInputs>
          <Text
            labelClass={null}
            {...inputSize}
            placeholder={t("LABEL_DESCRIPTION_SUPPLÉMENTAIRE")}
            label={t("LABEL_DESCRIPTION_SUPPLÉMENTAIRE") + ":"}
            rows={4}
            inputType={"textarea"}
            onChange={this.onChange}
            name="text"
            value={text || ""}
          />
          {permissions["P_AFFECT_FAKENEWS"] >= 2 && (
            <div>
              <br />
              <Select
                name={"monitor"}
                label={t("LABEL_AFFECTER_LA_NEWS")}
                placeholder={t("LABEL_AFFECTER_LA_NEWS")}
                iconLeft={"fa-user-tag"}
                options={monitors.map(monitor =>
                  monitor._id == currentUserId
                    ? {
                        label: `${monitor.fName} ${monitor.lName} | ${t(
                          "TEXT_YOU"
                        )}`,
                        value: monitor._id
                      }
                    : {
                        label: `${monitor.fName} ${monitor.lName}`,
                        value: monitor._id
                      }
                )}
                value={monitor}
                onChange={this.onChange}
                {...inputSize}
              />
              <Date
                onChange={this.onChange}
                label={t("LABEL_DATE_LIMITE") + ":"}
                placeholder={t("LABEL_DATE_LIMITE")}
                iconLeft={"fa-globe"}
                value={dueDate}
                name="dueDate"
                {...inputSize}
              />
            </div>
          )}
          <ImportWrapper
            {...inputSize}
            label={t("LABEL_IMAGE_DE_COUVERTURE") + ":"}
          >
            <Upload
              name="userCoverImage"
              onChange={this.onChange}
              allowMultiple={false}
              server={coverImagesPath}
              defaultValue={userCoverImage}
            />
          </ImportWrapper>
          <ImportWrapper {...inputSize} label={t("LABEL_PREUVES") + ":"}>
            <Upload
              name="files"
              onChange={this.onChange}
              allowMultiple={true}
              server={newsFilePath}
              defaultValue={files}
            />
          </ImportWrapper>
          <Button
            onClick={this.onSubmit}
            className={"col-md-4"}
            pullRight={true}
            icon={"fa-plus"}
            type="success"
            text={this.isUpdate() ? t("BTN_MODIFIER") : t("BTN_AJOUTER")}
          />
        </Col>
      </Form>
    );
  }
}

function mapStateToProps(state) {
  if (state.data.monitors) {
    //PUT CURRENT USER FIRST ON THE LIST
    var currentUser = state.data.monitors.filter(
      monitor => monitor._id == state.persistedData._id
    );
    var monitorsSorted = state.data.monitors.filter(
      monitor => monitor._id != state.persistedData._id
    );
    monitorsSorted.unshift(currentUser[0]);
  }
  return {
    monitors: monitorsSorted,
    similarNews: state.data.similarNews,
    existingTags: state.data.tags,
    permissions: state.persistedData.permissions,
    roles: state.persistedData.roles,
    currentUserId: state.persistedData._id,
    actors : state.data.actors,
    constituencys : state.data.constituencys
  };
}

function mapDispatchToProps(dispatch) {
  return {
    insert: (data, cb) => dispatch(News.insert(data, cb)),
    update: (data, cb) => dispatch(News.update(data, cb)),
    searchSimilarNews: (data, cb) => dispatch(SimilarNews.search(data, cb)),
    getTags: () => dispatch(Tags.get()),
    getActors : () => dispatch(ActorRessource.get()),
    getConstituency : () => dispatch(ConstituencyRessource.get())
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(NewsForm)
);

NewsForm.propTypes = {
  isProject: PropTypes.bool,
  newsType: PropTypes.oneOf(Object.keys(NewsTypeEnum)),
  monitors: PropTypes.arrayOf(PropTypes.object),
  update: PropTypes.func.isRequired,
  insert: PropTypes.func.isRequired,
  callBack: PropTypes.func,
  news: PropTypes.object,
  isNew: PropTypes.bool
};
NewsForm.defaultProps = {
  news: {},
  isProject: false,
  callBack: undefined,
  existingTags: [],
  monitors: [],
  isNew: false,
  constituencys : [],
  actors : []
};
