import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Inputs, Button } from "adminlte-2-react";
import Form from "reactstrap/es/Form";
import { NewsTypeEnum } from "Enums";
import { News } from "modules/ressources";
import Select from "components/Select";
import MyModal from "@shared/Components/MyModal";

const { Text} = Inputs;

class HateSpeech extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: this.props.news,
      step: "addingNews",
      comments_left : []
    };

    this.submitNews = this.submitNews.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { news } = this.props;
    if (!_.isEqual(prevProps.news, news)) {
      this.setState({ news });
      if(news.data_comments && news.data_comments.data){
        let all_comments = news.data_comments.data;
        let selected_comments = news.hate_speech.selected_comments ? news.hate_speech.selected_comments : [];
  
  
        for (let i = 0; i < all_comments.length; i++) {
          for (let j = 0; j < selected_comments.length; j++) {
            console.log(all_comments[i], "===", selected_comments[j])
            if(all_comments[i].comment === selected_comments[j].comment){
              all_comments = all_comments.slice(0,i).concat(all_comments.slice(i+1 , all_comments.length))
            }
          }
         
        }   
        this.setState({
          comments_left : all_comments
        })   
      }
    }
  }

 getSentimentTypeOptions(t) {
    return [
      {
        label: t("TEXT_POSITIVE"),
        value: 0
      },
      {
        label: t("TEXT_NEGATIVE"),
        value: 1
      },
      {
        label: t("TEXT_NEUTRAL"),
        value: 2
      }
    ];
  }
  getYesOrNoOptions(t) {
    return [
      {
        label: t("TEXT_NO"),
        value: 0
      },
      {
        label: t("TEXT_YES"),
        value: 1
      },
    ];
  }
  getDegreOptions(t) {
    return [
      {
        label: t("TEXT_DEGREE_DISAGREEMENT"),
        value: 0
      },
      {
        label: t("TEXT_NEGATIVE_ACTION"),
        value: 1
      },
      {
        label: t("TEXT_NEGATIVE_CHARACTER"),
        value: 2
      },
      {
        label: t("TEXT_DEMONIZING_DEHUMINAZING"),
        value: 3
      },
      {
        label: t("TEXT_VIOLENCE"),
        value: 4
      },
      {
        label: t("TEXT_DEATH"),
        value: 5
      },
      {
        label: t("TEXT_DONT_MATCH"),
        value: 6
      }
    ];
  }
  getHateTypeOptions(t) {
    return [
      {
        label: t("LABEL_TOXICITY"),
        value: 0
      },
      {
        label: t("LABEL_IDENTITY_ATTACK_2"),
        value: 1
      },
      {
        label: t("LABEL_INSULT"),
        value: 2
      },
      {
        label: t("LABEL_PROFANITY"),
        value: 3
      },
      {
        label: t("LABEL_THREAT"),
        value: 4
      },
      {
        label: t("TEXT_DONT_MATCH"),
        value: 5
      }
    ];
  }
  getLegalTextOptions(t) {
    return [
      {
        label: t("TEXT_DEFAMATION"),
        value: 0
      },
      {
        label: t("TEXT_TREACHERY"),
        value: 1
      },
      {
        label: t("TEXT_PROVOKING_SECTARIAN_STRIFE"),
        value: 2
      },
      {
        label: t("INCITEMENT_TO_VIOLENCE_AND_RIOT"),
        value: 3
      },
      {
        label: t("TEXT_DONT_MATCH"),
        value: 4
      }
    ];
  }
  getTargettingOptions(t) {
    return [
      {
        label: t("TEXT_SEX"),
        value: 0
      },
      {
        label: t("TEXT_RACE"),
        value: 1
      },
      {
        label: t("TEXT_RELIGIOUS_AFFILIATION"),
        value: 2
      },
      {
        label: t("TEXT_DISABILITY"),
        value: 3
      },
      {
        label: t("TEXT_REFUGEES"),
        value: 4
      },
      {
        label: t("TEXT_SKIN_COLOUR"),
        value: 5
      },
      {
        label: t("TEXT_DONT_MATCH"),
        value: 6
      },
      {
        label: t("TEXT_PARTY_AFFILIATION"),
        value: 7
      }
    ];
  }
  initState() {
    return this.state;
  }

  submitNews() {
    const { update, callBack} = this.props;
    const { news } = this.state;
    update(news, (err, data) => {
      this.setState({
        step: "START"
      });
      if (!err) {
        this.setState(this.initState());
        if (typeof callBack === "function") callBack(data);
      }
    });
  }
  onChange(e) {
    const { news } = this.state;
    const { name, value } = e.target;
    
    if(name.indexOf("hate_exist")>-1 && value===0){
      let propNumber = name.replace(/\D/g,'');
      let hate_speech = news.hate_speech;
      hate_speech[`hate_speech_paragraph_${propNumber}`]=null;
      hate_speech[`hate_type_${propNumber}`]=null;
      hate_speech[`hate_applying_legal_text_${propNumber}`]=null;
      hate_speech[`hate_targetting_${propNumber}`]=null;
      hate_speech[`attack_degree_${propNumber}`]=null;
      this.setState({
        news: { ...news, hate_speech : {
          ...hate_speech,
          [name]: value
        } }
      });    
    }else{
         this.setState({
          news: { ...news, hate_speech : {
            ...news.hate_speech,
            [name]: value
          } }
    });
    }
 
  }
  addForm = (toggleModal) =>{
    let {news, selected_comment, comments_left} = this.state;
    let comment = comments_left.filter((el,i)=>i===selected_comment);
    let comments_number = news.hate_speech.divs.length;
    let selected_comments = news.hate_speech.selected_comments? news.hate_speech.selected_comments.concat(comment) : [comment[0]];
    let hate_speech = {...news.hate_speech,divs:news.hate_speech.divs.concat(["div"]), selected_comments}
    hate_speech[`comment_text_${comments_number}`] = comment[0].comment;
    hate_speech[`comment_author_${comments_number}`] = comment[0].userName;
    this.setState({
      news: { ...news, hate_speech} ,comments_left : comments_left.filter((el,i)=>i!==selected_comment) 
    });
    toggleModal()
  }

  deleteComment = (index) =>{
    let hate_speech = this.state.news.hate_speech;
    let comments_left = this.state.comments_left;
    let toBeOmitted = [];
    let divs = hate_speech.divs;
    let keys = Object.keys(hate_speech);

    let selected_comments = hate_speech.selected_comments;
    console.log("comment text", index,hate_speech[`comment_text_${index}`] );
    console.log("selected_comments",selected_comments );
    let new_selected_comments = selected_comments.filter(el=>el.comment !== hate_speech[`comment_text_${index}`]);
    console.log("selected_comments again",new_selected_comments );
    let selected_comment = selected_comments.filter(el=>el.comment === hate_speech[`comment_text_${index}`]);

    console.log("selected_comment", selected_comment)

    keys.forEach(el=>{
      if(el.indexOf(String(index))>-1){
        toBeOmitted.push(el)
      }
    })
    toBeOmitted.forEach(el=>hate_speech[el]=null);
    keys = Object.keys(hate_speech);
    console.log("keys1", keys)


    for (let i = index + 1 ; i < divs.length; i++) {
      for (let j = 0; j <  keys.length; j++) {
        if(keys[j].indexOf(String(i))>-1){
          let key = keys[j].replace(String(i), String(i-1));
          hate_speech[key] = hate_speech[keys[j]];
          hate_speech[keys[j]]=null;
        }
      }

    }
    divs.pop();
    
    hate_speech.divs = divs;
    hate_speech.selected_comments = new_selected_comments;
    comments_left.push(selected_comment[0])
    this.setState({
      news :  {...this.state.news, hate_speech }, comments_left
    })
  }
  render() {
    const {news, selected_comment, comments_left} = this.state
    const { t, update, lang } = this.props;
    /*const {
        hate_exist,
        hate_speech_paragraph,
        hate_type,
        attack_degree,
        hate_applying_legal_text,
        hate_targetting,
        sentiment_type
    } = news.hate_speech ? news.hate_speech : {};*/

    // will configure whether to use the word "news" of "article"

    if (!news.hate_speech){
      news.hate_speech = {
        divs:["div"]
      }
    }

    if (news.hate_speech && !news.hate_speech.divs){
      news.hate_speech["divs"] = ["div"];
      news.hate_speech["attack_degree_0"] = news.hate_speech["attack_degree"];
      news.hate_speech["hate_targetting_0"] = news.hate_speech["hate_targetting"];
      news.hate_speech["hate_applying_legal_text_0"] = news.hate_speech["hate_applying_legal_text"];
      news.hate_speech["hate_type_0"] = news.hate_speech["hate_type"];
      news.hate_speech["hate_speech_paragraph_0"] = news.hate_speech["hate_speech_paragraph"];
      news.hate_speech["hate_exist_0"] = news.hate_speech["hate_exist"];
      news.hate_speech["sentiment_type_0"] = news.hate_speech["sentiment_type"];
    }

    const inputSize = { labelMd: 2, md: 10, labelSm: 4, sm: 8 };
    return (
      <Form onSubmit={()=>update(this.state.news)} className={"form-horizontal form-grid"}>
       {
          news.hate_speech.divs.map((el,i)=> <Col xs={12}>
        {i!==0?
            <React.Fragment>
              {lang !== "ar"? <div className="d-flex justify-content-between">
                <h3 className="margin-b-15">
                  {t("TITLE_COMMENT_NUMBER") + " " + i}
                </h3>
                <div>
                <Button
                    onClick={() => this.deleteComment(i)}
                    size={"md"}
                    icon={"fa-trash"}
                    type="danger"
                    className="margin-t-20"
                />
                </div>
              </div>:
              <div className="d-flex justify-content-between">
              <div>
              <Button
                  onClick={() => this.deleteComment(i)}
                  size={"md"}
                  icon={"fa-trash"}
                  type="danger"
                  className="margin-t-20"
              />
              </div>
              <h3 className="margin-b-15">
                {t("TITLE_COMMENT_NUMBER") + " " + i}
              </h3>

            </div>}

            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_COMMENT_TEXT")}
                label={t("LABEL_COMMENT_TEXT") }
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name={"comment_text_"+i}
                value={eval(`news.hate_speech.comment_text_${i}`) || ""}
            />
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_AUTHOR_NAME")}
                label={t("LABEL_AUTHOR_NAME") }
                inputType={"text"}
                onChange={this.onChange}
                name={"comment_author_"+i}
                value={eval(`news.hate_speech.comment_author_${i}`) || ""}
            />
            </React.Fragment>:
            null}
          <Select
            placeholder={t("LABEL_SENTIMENT_TYPE")}
            iconLeft={"fa-tags"}
            value={eval(`news.hate_speech.sentiment_type_${i}`)}
            options={this.getSentimentTypeOptions(t)}
            multiple={false}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_SENTIMENT_TYPE") + ":"}
            name={"sentiment_type_"+i}
            onChange={this.onChange}
          />
          <Select
            name={"hate_exist_"+i}
            placeholder={t("LABEL_HATE_EXIST")}
            iconLeft={"fa-stamp"}
            value={eval(`news.hate_speech.hate_exist_${i}`)}
            options={this.getYesOrNoOptions(t)}
            {...inputSize}
            label={t("LABEL_HATE_EXIST") + ":"}
            onChange={this.onChange}
          />
          {eval(`news.hate_speech.hate_exist_${i}`)?
          <>
          <Text
            labelClass={null}
            {...inputSize}
            placeholder={t("LABEL_HATE_SPEECH_PARAGRAPH")}
            label={t("LABEL_HATE_SPEECH_PARAGRAPH") + ":"}
            rows={4}
            inputType={"textarea"}
            onChange={this.onChange}
            name={"hate_speech_paragraph_"+i}
            value={eval(`news.hate_speech.hate_speech_paragraph_${i}`) || ""}
          />
          <Select
            placeholder={t("LABEL_CHOOSE_HATE_TYPE")}
            iconLeft={"fa-tags"}
            value={eval(`news.hate_speech.hate_type_${i}`)}
            options={this.getHateTypeOptions(t)}
            multiple={true}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_CHOOSE_HATE_TYPE") + ":"}
            name={"hate_type_"+i}
            onChange={this.onChange}
          />
          {/*<Select
            placeholder={t("LABEL_TARGETTING_APPLYING_LEGAL_TEXT")}
            iconLeft={"fa-tags"}
            value={eval(`news.hate_speech.hate_applying_legal_text_${i}`)}
            options={this.getLegalTextOptions(t)}
            multiple={true}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_TARGETTING_APPLYING_LEGAL_TEXT") + ":"}
            name={"hate_applying_legal_text_"+i}
            onChange={this.onChange}
        />*/}
          <Select
            placeholder={t("LABEL_TARGETTING_HATE_SPEECH")}
            iconLeft={"fa-tags"}
            value={eval(`news.hate_speech.hate_targetting_${i}`)}
            options={this.getTargettingOptions(t)}
            multiple={true}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_TARGETTING_HATE_SPEECH") + ":"}
            name={"hate_targetting_"+i}
            onChange={this.onChange}
          />
          <Select
            placeholder={t("LABEL_CHOOSE_ATTACK_DEGREE")}
            iconLeft={"fa-tags"}
            value={eval(`news.hate_speech.attack_degree_${i}`)}
            options={this.getDegreOptions(t)}
            multiple={true}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_CHOOSE_ATTACK_DEGREE") + ":"}
            name={"attack_degree_"+i}
            onChange={this.onChange}
          />
          </>:null}
         
      
        </Col>)}
        {comments_left.length ?<MyModal
        className={this.props.className}
        button={
          <Button
            block={false}
            icon={"fa-plus"}
            className={"col-md-4 pull-right"}
            type="success"
            pullRight={true}
            text={t("BTN_AJOUTER_UN_COMMENTAIRE")}
          />
        }
        submitText={t("BTN_AJOUTER")}
        title={t("BTN_AJOUTER_UN_COMMENTAIRE")}
        submit={this.addForm}
      >
        {
          comments_left.map(
            (el,i)=><div className={i === selected_comment ?"comment-box selected-comment" : "comment-box"} key={i} onClick={()=>this.setState({
              selected_comment : i
            })}>{el.comment}</div>)
            
        }
      </MyModal>:null}
      <Button
            onClick={()=>update(this.state.news)}
            className={"col-md-12"}
            pullRight={true}
            icon={"fa-plus"}
            type="success"
            text={t("BTN_SAVED")}
          />
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
    lang : state.persistedData.lang
  };
}

function mapDispatchToProps(dispatch) {
  return {
    update: (data, cb) => dispatch(News.update(data, cb)),
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(HateSpeech)
);

HateSpeech.propTypes = {
  isProject: PropTypes.bool,
  newsType: PropTypes.oneOf(Object.keys(NewsTypeEnum)),
  monitors: PropTypes.arrayOf(PropTypes.object),
  update: PropTypes.func.isRequired,
  callBack: PropTypes.func,
  news: PropTypes.object,
  isNew: PropTypes.bool
};
HateSpeech.defaultProps = {
  news: {},
  isProject: false,
  callBack: undefined,
  existingTags: [],
  monitors: [],
  isNew: false
};

