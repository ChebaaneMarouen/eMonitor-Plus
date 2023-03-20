import PropTypes, { any } from "prop-types";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import React, { Component } from "react";
import { connect } from "react-redux";
import { Col, Inputs, Button } from "adminlte-2-react";
import Form from "reactstrap/es/Form";
import { News } from "modules/ressources";
import Select from "components/Select";
import MyModal from "@shared/Components/MyModal";

const { Text} = Inputs;

class WomanPresence extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: this.props.news,
      step: "addingNews",
      divs:["div1"],
      comments_left : []
    };

    this.onChange = this.onChange.bind(this);
  }

  

  componentDidUpdate(prevProps) {
    const { news } = this.props;
    if (!_.isEqual(prevProps.news, news)) {
      this.setState({ news });
      if(news.data_comments && news.data_comments.data){
        let all_comments = news.data_comments.data;
        let selected_comments = news.woman_presence.selected_comments ? news.woman_presence.selected_comments : [];
  
  
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

  getArticleTypeOptions(t) {
    return [
      {
        label: t("TEXT_IMAGE"),
        value: 0
      },
      {
        label: t("TEXT_TEXT"),
        value: 1
      },
      {
        label: t("TEXT_VIDEO"),
        value: 2
      },
      {
        label: t("TEXT_RECORD_VOICE"),
        value: 3
      },
      {
        label: t("TEXT_OTHER"),
        value: 4
      }
    ];
  }

  //Name article

  getRessourceTypeOptions(t) {
    return [
      {
        label: t("TEXT_WEBSITE"),
        value: 0
      },
      {
        label: t("TEXT_FACEBOOK"),
        value: 1
      },
      {
        label: t("TEXT_TWITTER"),
        value: 2
      },
      {
        label: t("TEXT_YOUTUBE"),
        value: 3
      },
      {
        label: t("TEXT_OTHER"),
        value: 4
      }
    ];
  }

  getPostTopicOptions(t) {
    return [
      {
        label: t("TEXT_ELECTIVE"),
        value: 0
      },
      {
        label: t("TEXT_POLITICAL"),
        value: 1
      },
      {
        label: t("TEXT_ECONOMIC"),
        value: 2
      },
      {
        label: t("TEXT_SOCIAL"),
        value: 3
      },
      {
        label: t("TEXT_SCIENCE_HEALTH"),
        value: 4
      },
      {
        label: t("TEXT_CULTURE_ART_SPORT"),
        value: 5
      },
      {
        label: t("TEXT_VARIED"),
        value: 6
      }
    ];
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

  /*getTargetedVictimOptions(t) {
    return [
      {
        label: t("TEXT_CANDIDATE"),
        value: 0
      },
      {
        label: t("TEXT_PARTY"),
        value: 1
      },
      {
        label: t("TEXT_LIST"),
        value: 2
      },
      {
        label: t("TEXT_INDEPENDENT"),
        value: 3
      },
      {
        label: t("TEXT_OTHER"),
        value: 4
      }
    ];
  }*/

  getHateTypeOptions(t) {
    return [
      {
        label: t("TEXT_PSYCHOLOGICAL"),
        value: 0
      },
      {
        label: t("TEXT_SEXUAL"),
        value: 1
      },
      {
        label: t("TEXT_PHYSICAL"),
        value: 2
      }
    ];
  }

  getHateSourceOptions(t) {
    return [
      {
        label: t("TEXT_LEGAL"),
        value: 0
      },
      {
        label: t("TEXT_PROCEDURAL"),
        value: 1
      },
      {
        label: t("TEXT_SOCIAL_NORMS"),
        value: 2
      },
      {
        label: t("TEXT_ECONOMICAL"),
        value: 3
      },
      {
        label: t("TEXT_DOCTRINAL"),
        value: 4
      },
      {
        label: t("TEXT_OTHER_PLEASE_SPECIFY"),
        value: 5
      }
    ];
  }

  getHatePersonOptions(t) {
    return [
      {
        label: t("TEXT_VOTER"),
        value: 0
      },
      {
        label: t("TEXT_FILTER"),
        value: 1
      },
      {
        label: t("TEXT_SUPPORTING_A_POLITICAL"),
        value: 2
      },
      {
        label: t("TEXT_WORKING_ON_AN_ELECTION"),
        value: 3
      },
      {
        label: t("TEXT_MONITORING_THE_ELECTORAL"),
        value: 4
      },
      {
        label: t("TEXT_WORKER_ON_THE_POLLING_STAFF"),
        value: 5
      },
      {
        label: t("TEXT_WOMAN_IN_A_POLITICAL"),
        value: 6
      },
      {
        label: t("TEXT_RELATIVE_WOMAN_IN_A_POLITICAL"),
        value: 7
      },
      {
        label: t("TEXT_WORKING_IN_THE_GOVERMENT_SECTOR"),
        value: 8
      },
      {
        label: t("TEXT_WORKING_IN_THE_PRIVATE_SECTOR"),
        value: 9
      },
      {
        label: t("TEXT_INFLUENCER_WOMAN"),
        value: 10
      },
      {
        label: t("TEXT_ART_WOMAN_WORKER"),
        value: 11
      },
      {
        label: t("TEXT_OTHER_PLEASE_SPECIFY"),
        value: 12
      }
    ];
  }

  getSentimentTypeArticelOptions(t) {
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
      },
      {
        label: t("TEXT_NONE_OF_ABOVE"),
        value: 3
      }
    ];
  }

  getDegreOptions(t) {
    return [
      {
        label: t("TEXT_INCITEMENT_TO_PHYSICAL_VIOLENCE"),
        value: 0
      },
      {
        label: t("TEXT_THREATS_AND_INTIMIDATION_WITH_THE_AIM_OF_WITHDRAWING_FROM_THE_RACE"),
        value: 1
      },
      {
        label: t("TEXT_HARASSMENT_AND_VERBAL_ASSAULT"),
        value: 2
      },
      {
        label: t("TEXT_SPREADING_RUMORS"),
        value: 3
      },
      {
        label: t("TEXT_MARGINALIZATION_SOCIAL_EXCLUSION_AND_SHAME"),
        value: 4
      },
      {
        label: t("TEXT_SEXUAL_HARASSMENT"),
        value: 5
      },
      {
        label: t("TEXT_RAPE_THREAT"),
        value: 6
      },
      {
        label: t("TEXT_SARCASM_AND_PROVOCATION"),
        value: 7
      },
      {
        label: t("TEXT_DESCRIPTION_INCOMPETENCE"),
        value: 8
      },
      {
        label: t("TEXT_DESCRIPTION_LACK_FITNESS"),
        value: 9
      },
      {
        label: t("TEXT_OTHER_PLEASE_SPECIFY"),
        value: 10
      }
    ];
  }

  getPowerHateOptions(t) {
    return [
      {
        label: t("TEXT_DISAGREEING_WITH_WORDS"),
        value: 0
      },
      {
        label: t("TEXT_NEGATIVE_ACTIONS"),
        value: 1
      },
      {
        label: t("TEXT_DESCRIBE_THE_CHARACTER_IN_A_NEGATIVE_WAY"),
        value: 2
      },
      {
        label: t("TEXT_DEMONIZATION_AND_DEHUMANIZATION"),
        value: 3
      },
      {
        label: t("TEXT_VIOLENCE"),
        value: 4
      },
      {
        label: t("TEXT_THE_KILL"),
        value: 5
      }
    ];
  }
  getUsedToolsOptions(t) {
    return [
      {
        label: t("TEXT_DEEPFAKES_FAKE_IMAGE"),
        value: 0
      },
      {
        label: t("TEXT_DEEPFAKES_SYNTHETIC_AUDIO"),
        value: 1
      },
      {
        label: t("TEXT_DEEPFAKES_SYNTHETIC_VIDEOS"),
        value: 2
      },
      {
        label: t("TEXT_CYBERATTACKS"),
        value: 3
      },
      {
        label: t("TEXT_OTHER_PLEASE_SPECIFY"),
        value: 4
      },
      {
        label: t("TEXT_NONE_OF_ABOVE"),
        value: 5
      }
    ];
  }
  getViolenceImpactOptions(t) {
    return [
      {
        label: t("TEXT_WITHDRAWAL_FROM_THE_RACE"),
        value: 0
      },
      {
        label: t("TEXT_SOCIAL_HARM"),
        value: 1
      },
      {
        label: t("TEXT_PSYCHOLOGICAL_DAMAGE"),
        value: 2
      },
      {
        label: t("TEXT_OTHER_PLEASE_SPECIFY"),
        value: 3
      }
    ];
  }

  onChange(e) {
    const { news } = this.state;
    const { name, value } = e.target;
    console.log("name : ", name)
    console.log("value : ", value)
    if (name.indexOf("hate_against_woman")>-1 && value ===0) {
      let hate_type = "hate_type_"+name.replace(/\D/g,'');
    console.log("hate_type : ", hate_type)

      let woman_presence = news.woman_presence;
      woman_presence[name] = value;
      woman_presence[hate_type] = null;
    console.log("woman_presence : ", woman_presence)

      return this.setState({
     news: { ...news, woman_presence  }
   });
   }

   if (name.indexOf("stereotype_woman")>-1 && value ===0) {
    let stereoDes = "description_stereotype_"+ name.replace(/\D/g,'');
    let stereoPara = "paragraph_stereotype_"+ name.replace(/\D/g,'');
    console.log("stereoDes : ", stereoDes)
    console.log("stereoPara : ", stereoPara)

    let woman_presence = news.woman_presence;
    woman_presence[name] = value;
    woman_presence[stereoDes] = null;
    woman_presence[stereoPara] = null;
    return this.setState({
      news: { ...news, woman_presence  }
 });
 }

   if (name.indexOf("positif_woman_speech")>-1 && value ===0) {
    let posSpeechDes = "positif_speech_description_"+ name.replace(/\D/g,'');
    let posSpeechPara = "positif_speech_paragraph_"+ name.replace(/\D/g,'');
    let woman_presence = news.woman_presence;
    woman_presence[name] = value;
    woman_presence[posSpeechDes] = null;
    woman_presence[posSpeechPara] = null;
    return this.setState({
      news: { ...news, woman_presence  }
 });
 }
     this.setState({
      news: { ...news, woman_presence : {...news.woman_presence,[name]: value} }
    });
  }

  addForm = (toggleModal) =>{
    let {news, selected_comment, comments_left} = this.state;
    let comment = comments_left.filter((el,i)=>i===selected_comment);
    let comments_number = news.woman_presence.divs.length;
    let selected_comments =news.woman_presence.selected_comments? news.woman_presence.selected_comments.concat(comment) : [comment[0]];
    let woman_presence = {...news.woman_presence,divs:news.woman_presence.divs.concat(["div"]), selected_comments}
    woman_presence[`comment_text_${comments_number}`] = comment[0].comment;
    woman_presence[`comment_author_${comments_number}`] = comment[0].userName;
    this.setState({
      news: { ...news, woman_presence} ,comments_left : comments_left.filter((el,i)=>i!==selected_comment) 
    });
    toggleModal()
  }

  deleteComment = (index) =>{
    let woman_presence = this.state.news.woman_presence;
    let comments_left = this.state.comments_left;
    let toBeOmitted = [];
    let divs = woman_presence.divs;
    let keys = Object.keys(woman_presence);

    let selected_comments = woman_presence.selected_comments;
    console.log("comment text", index,woman_presence[`comment_text_${index}`] );
    console.log("selected_comments",selected_comments );
    let new_selected_comments = selected_comments.filter(el=>el.comment !== woman_presence[`comment_text_${index}`]);
    console.log("selected_comments again",new_selected_comments );
    let selected_comment = selected_comments.filter(el=>el.comment === woman_presence[`comment_text_${index}`]);

    console.log("selected_comment", selected_comment)

    keys.forEach(el=>{
      if(el.indexOf(String(index))>-1){
        toBeOmitted.push(el)
      }
    })
    toBeOmitted.forEach(el=>woman_presence[el]=null);
    keys = Object.keys(woman_presence);
    console.log("keys1", keys)


    for (let i = index + 1 ; i < divs.length; i++) {
      for (let j = 0; j <  keys.length; j++) {
        if(keys[j].indexOf(String(i))>-1){
          let key = keys[j].replace(String(i), String(i-1));
          woman_presence[key] = woman_presence[keys[j]];
          woman_presence[keys[j]]=null;
        }
      }

    }
    divs.pop();
    
    woman_presence.divs = divs;
    woman_presence.selected_comments = new_selected_comments;
    comments_left.push(selected_comment[0])
    this.setState({
      news :  {...this.state.news, woman_presence }, comments_left
    })
  }

  render() {
    let {news, selected_comment, comments_left} = this.state
    const { t, update, lang } = this.props;

    console.log("this.state", this.state)
    // const {
    //     hate_type,
    //     talk_about_woman,
    //     written_by_woman,
    //     stereotype_woman,
    //     description_stereotype,
    //     paragraph_stereotype,
    //     hate_against_woman,
    //     positif_woman_speech,
    //     positif_speech_description,
    //     positif_speech_paragraph
    // } = news.woman_presence ? news.woman_presence : {};
    if (!news.woman_presence){
      news.woman_presence = {
        divs:["div"]
      }
    }

    if (news.woman_presence && !news.woman_presence.divs){
      news.woman_presence["divs"] = ["div"];
      news.woman_presence["written_by_woman_0"] = news.woman_presence["written_by_woman"];
      news.woman_presence["talk_about_woman_0"] = news.woman_presence["talk_about_woman"];
      news.woman_presence["hate_against_woman_0"] = news.woman_presence["hate_against_woman"];
      news.woman_presence["hate_type_0"] = news.woman_presence["hate_type"];
      news.woman_presence["stereotype_woman_0"] = news.woman_presence["stereotype_woman"];
      news.woman_presence["description_stereotype_0"] = news.woman_presence["description_stereotype"];
      news.woman_presence["paragraph_stereotype_0"] = news.woman_presence["paragraph_stereotype"];
      news.woman_presence["positif_woman_speech_0"] = news.woman_presence["positif_woman_speech"];
      news.woman_presence["positif_speech_description_0"] = news.woman_presence["written_by_woman"];
      news.woman_presence["positif_speech_paragraph_0"] = news.woman_presence["positif_speech_paragraph"];

      news.woman_presence["article_type_0"] = news.woman_presence["article_type"];
      news.woman_presence["ressource_type_0"] = news.woman_presence["ressource_type"];
      news.woman_presence["post_topic_0"] = news.woman_presence["post_topic"];
      news.woman_presence["sentiment_type_0"] = news.woman_presence["sentiment_type"];
      news.woman_presence["targeted_victim_of_violence_0"] = news.woman_presence["targeted_victim_of_violence"];
      news.woman_presence["source_violence_0"] = news.woman_presence["source_violence"];
      news.woman_presence["article_violence_0"] = news.woman_presence["article_violence"];
      news.woman_presence["type_violence_0"] = news.woman_presence["type_violence"];
      news.woman_presence["power_hate_0"] = news.woman_presence["power_hate"];
      news.woman_presence["ressource_name_0"] = news.woman_presence["ressource_name"];
      news.woman_presence["type_violence_other_0"] = news.woman_presence["type_violence_other"];
      news.woman_presence["targeted_victim_of_violence_other_0"] = news.woman_presence["targeted_victim_of_violence_other"];
      news.woman_presence["used_violence_tools_0"] = news.woman_presence["used_violence_tools"];
      news.woman_presence["source_violence_other_0"] = news.woman_presence["source_violence_other"];
      news.woman_presence["violence_impact_0"] = news.woman_presence["violence_impact"];
      news.woman_presence["violence_impact_other_0"] = news.woman_presence["violence_impact_other"];
      news.woman_presence["violence_impact_description_0"] = news.woman_presence["violence_impact_description"];

    }

    const inputSize = { labelMd: 2, md: 10, labelSm: 4, sm: 8 };
    return (
      <Form onSubmit={()=>update(this.state.news)} className={"form-horizontal form-grid"}>
        {
          news.woman_presence.divs.map((el,i)=><Col xs={12}>
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
                value={eval(`news.woman_presence.comment_text_${i}`) || ""}
            />
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_AUTHOR_NAME")}
                label={t("LABEL_AUTHOR_NAME") }
                inputType={"text"}
                onChange={this.onChange}
                name={"comment_author_"+i}
                value={eval(`news.woman_presence.comment_author_${i}`) || ""}
            />
            </React.Fragment>:
            null}
          
          { i === 0 ?
          <>
          <Select
                placeholder={t("LABEL_ARTICLE_TYPE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.article_type_${i}`)}
                options={this.getArticleTypeOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_ARTICLE_TYPE") }
                name={"article_type_"+i}
                onChange={this.onChange}
          />
          <Select
                placeholder={t("LABEL_RESSOURCE_TYPE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.ressource_type_${i}`)}
                options={this.getRessourceTypeOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_RESSOURCE_TYPE") }
                name={"ressource_type_"+i}
                onChange={this.onChange}
          />
          <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_RESSOURCE_NAME")}
                label={t("LABEL_RESSOURCE_NAME") }
                inputType={"text"}
                onChange={this.onChange}
                name={"ressource_name_"+i}
                value={eval(`news.woman_presence.ressource_name_${i}`) || ""}
            />
          </>
           :null}
          {i === 0 ?
          <Select
                placeholder={t("LABEL_POST_TOPIC")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.post_topic_${i}`)}
                options={this.getPostTopicOptions(t)}
                multiple={false}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_POST_TOPIC") }
                name={"post_topic_"+i}
                onChange={this.onChange}
          />:
          <Select
                placeholder={t("LABEL_COMMENT_TOPIC")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.comment_topic_${i}`)}
                options={this.getPostTopicOptions(t)}
                multiple={false}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_COMMENT_TOPIC") }
                name={"comment_topic_"+i}
                onChange={this.onChange}
          />
          }
          <Select
            placeholder={t("LABEL_SENTIMENT_TYPE")}
            iconLeft={"fa-tags"}
            value={eval(`news.woman_presence.sentiment_type_${i}`)}
            options={this.getSentimentTypeOptions(t)}
            multiple={false}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_SENTIMENT_TYPE") }
            name={"sentiment_type_"+i}
            onChange={this.onChange}
          />
          <Select
            name={"written_by_woman_"+i}
            placeholder={t("LABEL_WRITTEN_BY_WOMAN")}
            iconLeft={"fa-stamp"}
            value={eval(`news.woman_presence.written_by_woman_${i}`) || 0}
            options={this.getYesOrNoOptions(t)}
            {...inputSize}
            label={t("LABEL_WRITTEN_BY_WOMAN") }
            onChange={this.onChange}
          />
          <Select
            name={"talk_about_woman_"+i}
            placeholder={t("LABEL_TALK_ABOUT_WOMAN")}
            iconLeft={"fa-stamp"}
            value={eval(`news.woman_presence.talk_about_woman_${i}`) || 0}
            options={this.getYesOrNoOptions(t)}
            {...inputSize}
            label={t("LABEL_TALK_ABOUT_WOMAN") }
            onChange={this.onChange}
          />
          <Select
            name={"hate_against_woman_"+i}
            placeholder={t("LABEL_HATE_AGAINST_WOMAN")}
            iconLeft={"fa-stamp"}
            value={eval(`news.woman_presence.hate_against_woman_${i}`) || 0}
            options={this.getYesOrNoOptions(t)}
            {...inputSize}
            label={t("LABEL_HATE_AGAINST_WOMAN") }
            onChange={this.onChange}
          />
          {eval(`news.woman_presence.hate_against_woman_${i}`)?
          <>
          <Select
                placeholder={t("LABEL_TARGETED_VICTIM_OF_VIOLENCE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.targeted_victim_of_violence_${i}`)}
                options={this.getHatePersonOptions(t)}
                multiple={false}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_TARGETED_VICTIM_OF_VIOLENCE") }
                name={"targeted_victim_of_violence_"+i}
                onChange={this.onChange}
          />
          {eval(`news.woman_presence.targeted_victim_of_violence_${i}`)===12?
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_TARGETED_VICTIM_OF_VIOLENCE")}
                label={t("LABEL_TARGETED_VICTIM_OF_VIOLENCE")}
                inputType={"text"}
                onChange={this.onChange}
                name={"targeted_victim_of_violence_other_"+i}
                value={eval(`news.woman_presence.targeted_victim_of_violence_other_${i}`) || ""}
            />
            :null}
          <Select
            placeholder={t("LABEL_HATE_TYPE")}
            iconLeft={"fa-tags"}
            value={eval(`news.woman_presence.hate_type_${i}`)}
            options={this.getHateTypeOptions(t)}
            multiple={false}
            allowClear={true}
            {...inputSize}
            label={t("LABEL_HATE_TYPE") }
            name={"hate_type_"+i}
            onChange={this.onChange}
          />
          
          
   
          <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_VIOLENCE_AGAINST_WOMEN_PARAGRAPH")}
                label={t("LABEL_VIOLENCE_AGAINST_WOMEN_PARAGRAPH") }
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name={"paragraph_violence_against_women_"+i}
                value={eval(`news.woman_presence.paragraph_violence_against_women_${i}`) || ""}
            />

            <Select
                placeholder={t("LABEL_TYPE_VIOLENCE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.type_violence_${i}`)}
                options={this.getDegreOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_TYPE_VIOLENCE") }
                name={"type_violence_"+i}
                onChange={this.onChange}
          />     
          {eval(`news.woman_presence.type_violence_${i}`) && eval(`news.woman_presence.type_violence_${i}`).find(el=>el===10)===10?
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_TYPE_VIOLENCE")}
                label={t("LABEL_TYPE_VIOLENCE")}
                inputType={"text"}
                onChange={this.onChange}
                name={"type_violence_other_"+i}
                value={eval(`news.woman_presence.type_violence_other_${i}`) || ""}
            />
            :null}  
          <Select
                placeholder={t("LABEL_USED_VIOLENCE_TOOLS")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.used_violence_tools_${i}`)}
                options={this.getUsedToolsOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_USED_VIOLENCE_TOOLS") }
                name={"used_violence_tools_"+i}
                onChange={this.onChange}
          />
          {eval(`news.woman_presence.used_violence_tools_${i}`) && eval(`news.woman_presence.used_violence_tools_${i}`).find(el=>el===4)===4?
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_USED_VIOLENCE_TOOLS")}
                label={t("LABEL_USED_VIOLENCE_TOOLS")}
                inputType={"text"}
                onChange={this.onChange}
                name={"used_violence_tools_other_"+i}
                value={eval(`news.woman_presence.used_violence_tools_other_${i}`) || ""}
            />
            :null}
            <Select
                placeholder={t("LABEL_SOURCE_VIOLENCE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.source_violence_${i}`)}
                options={this.getHateSourceOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_SOURCE_VIOLENCE") }
                name={"source_violence_"+i}
                onChange={this.onChange}
          />
          {eval(`news.woman_presence.source_violence_${i}`) && eval(`news.woman_presence.source_violence_${i}`).find(el=>el===5)===5?
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_SOURCE_VIOLENCE")}
                label={t("LABEL_SOURCE_VIOLENCE")}
                inputType={"text"}
                onChange={this.onChange}
                name={"source_violence_other_"+i}
                value={eval(`news.woman_presence.source_violence_other_${i}`) || ""}
            />
            :null}
            <Select
                placeholder={t("LABEL_ARTICLE_VIOLENCE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.article_violence_${i}`)}
                options={this.getSentimentTypeArticelOptions(t)}
                multiple={false}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_ARTICLE_VIOLENCE") }
                name={"article_violence_"+i}
                onChange={this.onChange}
          />
          <Select
                placeholder={t("LABEL_POWER_HATE")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.power_hate_${i}`)}
                options={this.getPowerHateOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_POWER_HATE") }
                name={"power_hate_"+i}
                onChange={this.onChange}
          />
          
          </>
            :null}
          <Select
            name={"stereotype_woman_"+i}
            placeholder={t("LABEL_STEREOTYPE_WOMAN")}
            iconLeft={"fa-stamp"}
            value={eval(`news.woman_presence.stereotype_woman_${i}`) || 0}
            options={this.getYesOrNoOptions(t)}
            {...inputSize}
            label={t("LABEL_STEREOTYPE_WOMAN") }
            onChange={this.onChange}
          />
          {eval(`news.woman_presence.stereotype_woman_${i}`)?
          <React.Fragment>
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_STEREOTYPE_DESCRIPTION")}
                label={t("LABEL_STEREOTYPE_DESCRIPTION") }
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name={"description_stereotype_"+i}
                value={eval(`news.woman_presence.description_stereotype_${i}`) || ""}
            />
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_STEREOTYPE_PARAGRAPH")}
                label={t("LABEL_STEREOTYPE_PARAGRAPH") }
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name={"paragraph_stereotype_"+i}
                value={eval(`news.woman_presence.paragraph_stereotype_${i}`) || ""}
            />
          </React.Fragment>:null}

          <Select
            name={"positif_woman_speech_"+i}
            placeholder={t("LABEL_POSITIF_WOMAN_SPEECH")}
            iconLeft={"fa-stamp"}
            value={eval(`news.woman_presence.positif_woman_speech_${i}`) || 0}
            options={this.getYesOrNoOptions(t)}
            {...inputSize}
            label={t("LABEL_POSITIF_WOMAN_SPEECH") }
            onChange={this.onChange}
          />
          {eval(`news.woman_presence.positif_woman_speech_${i}`)?
          <React.Fragment>
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_POSITIF_SPEECH_DESCRIPTION")}
                label={t("LABEL_POSITIF_SPEECH_DESCRIPTION") }
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name={"positif_speech_description_"+i}
                value={eval(`news.woman_presence.positif_speech_description_${i}`) || ""}
            />
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_POSITIF_SPEECH_PARAGRAPH")}
                label={t("LABEL_POSITIF_SPEECH_PARAGRAPH") }
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name={"positif_speech_paragraph_"+i}
                value={eval(`news.woman_presence.positif_speech_paragraph_${i}`) || ""}
            />
            </React.Fragment>:null}

            {eval(`news.woman_presence.hate_against_woman_${i}`)?
              <>
              <Select
                placeholder={t("LABEL_VIOLENCE_IMPACT")}
                iconLeft={"fa-tags"}
                value={eval(`news.woman_presence.violence_impact_${i}`)}
                options={this.getViolenceImpactOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_VIOLENCE_IMPACT") }
                name={"violence_impact_"+i}
                onChange={this.onChange}
          />
          {eval(`news.woman_presence.violence_impact_${i}`) && eval(`news.woman_presence.violence_impact_${i}`).find(el=>el===5)===5?
            <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_VIOLENCE_IMPACT")}
                label={t("LABEL_VIOLENCE_IMPACT")}
                inputType={"text"}
                onChange={this.onChange}
                name={"violence_impact_other_"+i}
                value={eval(`news.woman_presence.violence_impact_other_${i}`) || ""}
            />
            :null}
          <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_VIOLENCE_IMPACT_DESCRIPTION")}
                label={t("LABEL_VIOLENCE_IMPACT_DESCRIPTION")}
                inputType={"text"}
                onChange={this.onChange}
                name={"violence_impact_description_"+i}
                value={eval(`news.woman_presence.violence_impact_description_${i}`) || ""}
            />
              </>:null
            }
        </Col>)
        }

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

function mapDispatchToProps(dispatch) {
  return {
    update: (data, cb) => dispatch(News.update(data, cb)),
  };
}

function mapStateToProps(state) {
  return {
    lang : state.persistedData.lang
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(WomanPresence)
);

WomanPresence.propTypes = {
  update: PropTypes.func.isRequired,
  news: PropTypes.object,
};
WomanPresence.defaultProps = {
  news: {}
};