import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "../../News.css";
import Tag from "../../../../components/Tags/Tag";
import { Form, Label } from "reactstrap";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import FileComponent from "components/File";
import CoverImage from "../../components/CoverImage";
import { CivilSocietyRessource, newsFilePath, PartyRessource } from "modules/ressources";
import { Col, Inputs, Button } from "adminlte-2-react";
import Select from "components/Select";
import { connect } from "react-redux";
import { News, ActorRessource } from "modules/ressources";

const { Text, Checkbox  } = Inputs;

function getTime(date) {
  if (date) return new Date(date).toISOString().replace("T", " ").replace(/\..*/, "");
}
class InformationsComponents extends Component {
  constructor(props) {
    super(props);
    this.state = {
      news: this.props.news,
    };
  }
  componentDidMount(){
    const {getActors, getLists, getCivils} = this.props;
    this.setState({
      news: this.props.news,
    })
    getActors();
    getLists();
    getCivils();
  }
  componentDidUpdate(prevProps){
    if(this.props.news !== prevProps.news){
      this.setState({
        news : this.props.news
      })
    }
  }
  formatDate(date) {
    let d = new Date(date),
      month = "" + (d.getMonth() + 1),
      day = "" + d.getDate(),
      year = d.getFullYear();

    if (month.length < 2) month = "0" + month;
    if (day.length < 2) day = "0" + day;

    return [day, month, year].join("/");
  }
  formatTime(date) {
    let d = new Date(date),
      hours = "" + (d.getHours() + 1),
      minutes = "" + d.getMinutes();

    if (hours.length < 2) hours = "0" + hours;
    if (minutes.length < 2) minutes = "0" + minutes;

    return [hours, minutes].join(":");
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
      },
      {
        label: t("TEXT_TIK_TOK"),
        value: 5
      },
      {
        label: t("TEXT_INSTAGRAM"),
        value: 6
      }
    ];
  }

  getPlatformeOptions(t) {
    return [
      {
        label: t("TEXT_INSTAGRAM"),
        value: 0
      },
      {
        label: t("TEXT_FACEBOOK"),
        value: 1
      },
      {
        label: t("TEXT_WHATSAPP"),
        value: 2
      },
      {
        label: t("TEXT_MESSANGE"),
        value: 3
      }
    ];
  }

  getAudienceOptions(t) {
    return [
      {
        label: t("100-1k"),
        value: 0
      },
      {
        label: t("1k-5k"),
        value: 1
      },
      {
        label: t("5k-10k"),
        value: 2
      },
      {
        label: t("10k-50k"),
        value: 3
      },
      {
        label: t("50k-100k"),
        value: 4
      },
      {
        label: t("100k-500k"),
        value: 5
      },
      {
        label: t("500k-1M"),
        value: 6
      },
      {
        label: t("+1M"),
        value: 7
      }
    ];
  }

  getPageBelongToOptions(t) {
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
  getArticleRateOptions(t) {
    return [
      {
        label: t("TEXT_TRUE_NEWS"),
        value: 0
      },
      {
        label: t("TEXT_FAKE_NEWS"),
        value: 1
      },
      {
        label: t("TEXT_BAD_NEWS"),
        value: 2
      },
      {
        label: t("TEXT_MISLEADING_NEWS"),
        value: 3
      },
      {
        label: t("TEXT_INCOMPLETE_NEWS"),
        value: 4
      },
      {
        label: t("TEXT_SCANDALOUS_NEWS"),
        value: 5
      },
      {
        label: t("TEXT_SARCASTIC_NEWS"),
        value: 6
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
  deleteAdmin = (id) => {
    let {news} = this.state;
    let {admins} = news.monitor_social_media;
    let newAdmins = admins.filter(el=>el.id !== id);
    this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        admins : newAdmins
      } }
    })
  }
  addAdmins = async () =>{
    const { news } = this.state;
    let {admins, admin_number, admin_country} = {...news.monitor_social_media};
    admins = admins || [{}];
    if(admin_number && admin_country){
     await this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        admins : admins.concat({
          country : admin_country,
          number : admin_number,
          id : Date.now()
        }) 
      } }
    });
    this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        admins : this.state.news.monitor_social_media.admins,
        admin_number : "", 
        admin_country : ""
      }
    }
    })
    }
    
  }
  onChange = (e) =>{
    const { news } = this.state;
    const { name, value } = e.target;
   
    if(name === "promote_political_actor" && value ===0){
      return this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        [name]: value, 
        promoted_political_actor:null } }
    });
    }
    if (name === "promote_party_list" && value ===0) {
       return this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        [name]: value, 
        promoted_party_list:null } }
    });
    }
    if (name === "targetting_political_actor" && value ===0) {
       return this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        [name]: value, 
        targetted_political_actor:null } }
    });
    }
    if (name === "targetting_party_list" && value ===0) {
       return this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        [name]: value, 
        targetted_party_list:null } }
    });
    }    

    if (name === "physical_reflection" && value ===0) {
       return this.setState({
      news: { ...news, monitor_social_media : {
        ...news.monitor_social_media,
        [name]: value, 
        physical_reflection_description:null } }
    });
    }    
    this.setState({
      news: { ...news, monitor_social_media : {...news.monitor_social_media,[name]: value} }
    });
  }
  render() {
    const {news} = this.state
    const { article_type, ressource_type, page_belong_to, post_topic, 
      promote_political_actor,promoted_political_actor, article_rate,
      targetting_political_actor, targetted_political_actor,targetted_party,
      physical_reflection, physical_reflection_description, advertisement_clip, 
      advertisement_clip_price, advertisement_clip_devis, promote_party_list, 
      promoted_party_list, targetted_party_list, targetting_party_list ,
      promoted_by_civil_society, promoted_by_civil,bosst_platforme,bosst_start_date,
      bosst_end_date, bosst_id, bosst_audience, bosst_vu, bosst_author, bosst_number, 
      bosst_address, bosst_comment, repeat, repeating_date, admin_country,
      admin_number, admins } = news.monitor_social_media ? news.monitor_social_media : {};

    const { t, update, actors, lists, civils } = this.props;

    console.log("admins", admins, admin_country, admin_number)
    const inputSize = { labelMd: 3, md: 9, labelSm: 4, sm: 8 };
    const prices = [
      {
        value : "5 - 10"
      },
      {
        value : "10 - 15"
      },
      {
        value : "20 - 25"
      },
      {
        value : "30 - 50"
      },
      {
        value : "50 - 75"
      },
      {
        value : "75 - 100"
      },
      {
        value : "+ 100"
      }
  ]
  const devis = [
    {
      value : "$"
    },
    {
      value : "euro"
    },
    {
      value : "Dinar"
    },
    {
      value : "£"
    },
    {
      value : "Livre turque"
    }
]
    if(!news._id) return null;
    return (
      <div>
        <div className={"margin-b-15"}>
          {news.subjects.map((tag) => (
            <Tag tag={tag} key={tag} />
          ))}
          {news.categories.map((tag) => (
            <Tag tag={tag} key={tag} />
          ))}
        </div>
        <CoverImage news={news} />
        <p className={"text-right help-block"}>
          <br />
          {news.creatorInfo.fName + " " + news.creatorInfo.lName + " - "}
          {this.formatDate(news.created) + " "} {this.formatTime(news.created)}
        </p>
        {/* {news.infraction.status ? <Infraction news={news} t={t} /> : null} */}
        <div className="box box-default">
          <div className="box-header with-border">
            <h3 className="box-title">
              <Label>
                <FontAwesomeIcon icon={["far", "comment"]} /> {t("LABEL_DESCRIPTION")}
              </Label>
            </h3>
            <div className="box-body">{news.text}</div>
          </div>
        </div>
        <div className="box box-default">
          <div className="box-header with-border">
            <h2 className=" text-center underlined margin-b-15">
              {t("TITLE_MONITOR_SOCIAL_MEDIA")}
            </h2>
            <div className="box-body">
            <Form onSubmit={()=>update(this.state.news)} className={"form-horizontal form-grid"}>
            <Col xs={12}>
              <Select
                placeholder={t("LABEL_ARTICLE_TYPE")}
                iconLeft={"fa-tags"}
                value={article_type}
                options={this.getArticleTypeOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_ARTICLE_TYPE") }
                name="article_type"
                onChange={this.onChange}
              />
              <Select
                placeholder={t("LABEL_RESSOURCE_TYPE")}
                iconLeft={"fa-tags"}
                value={ressource_type}
                options={this.getRessourceTypeOptions(t)}
                multiple={true}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_RESSOURCE_TYPE") }
                name="ressource_type"
                onChange={this.onChange}
              />
              <Select
                placeholder={t("LABEL_PAGE_BELONG")}
                iconLeft={"fa-tags"}
                value={page_belong_to}
                options={this.getPageBelongToOptions(t)}
                multiple={false}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_PAGE_BELONG") }
                name="page_belong_to"
                onChange={this.onChange}
              />
              <Select
                placeholder={t("LABEL_POST_TOPIC")}
                iconLeft={"fa-tags"}
                value={post_topic}
                options={this.getPostTopicOptions(t)}
                multiple={false}
                allowClear={true}
                {...inputSize}
                label={t("LABEL_POST_TOPIC") }
                name="post_topic"
                onChange={this.onChange}
              />
              <Select
                name="promote_political_actor"
                placeholder={t("LABEL_PROMOTE_POLITICAL_ACTOR")}
                iconLeft={"fa-tags"}
                value={promote_political_actor}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_PROMOTE_POLITICAL_ACTOR") }
                onChange={this.onChange}
              />
              {promote_political_actor? <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_PROMOTED_POLITICAL_ACTOR")}
                label={t("LABEL_PROMOTE_POLITICAL_ACTOR") }
                inputType={"text"}
                onChange={this.onChange}
                name="promoted_political_actor"
                value={promoted_political_actor}
              />/* <Select
                name="promoted_political_actor"
                placeholder={t("LABEL_PROMOTED_POLITICAL_ACTOR")}
                iconLeft={"fa-tags"}
                multiple={true}
                value={promoted_political_actor}
                options={actors.map(actor=> ({
                  label: actor.name,
                  value: actor.name,
                }))}
                {...inputSize}
                label={t("LABEL_PROMOTE_POLITICAL_ACTOR") }
                onChange={this.onChange}
              />*/ : null}
              <Select
                name="promote_party_list"
                placeholder={t("LABEL_PROMOTE_PARTY_LIST")}
                iconLeft={"fa-tags"}
                value={promote_party_list}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_PROMOTE_PARTY_LIST") }
                onChange={this.onChange}
              />
              {promote_party_list? <Select
                name="promoted_party_list"
                placeholder={t("LABEL_PROMOTED_PARTY_LIST")}
                iconLeft={"fa-tags"}
                multiple={true}
                value={promoted_party_list}
                options={lists.map(list=> ({
                  label: list.name,
                  value: list.name,
                }))}
                {...inputSize}
                label={t("LABEL_PROMOTED_PARTY_LIST") }
                onChange={this.onChange}
              /> : null}
              <Select
                name="targetting_political_actor"
                placeholder={t("LABEL_TARGETTING_POLITICAL_ACTOR")}
                iconLeft={"fa-tags"}
                value={targetting_political_actor}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_TARGETTING_POLITICAL_ACTOR") }
                onChange={this.onChange}
              />
              {targetting_political_actor?<Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_TARGETTED_POLITICAL_ACTOR")}
                label={t("LABEL_TARGETTED_POLITICAL_ACTOR") }
                inputType={"text"}
                onChange={this.onChange}
                name="targetted_political_actor"
                value={targetted_political_actor}
              /> /*<Select
                name="targetted_political_actor"
                placeholder={t("LABEL_TARGETTED_POLITICAL_ACTOR")}
                iconLeft={"fa-tags"}
                multiple={true}
                value={targetted_political_actor}
                options={actors.map(actor=> ({
                  label: actor.name,
                  value: actor.name,
                }))}
                {...inputSize}
                label={t("LABEL_TARGETTED_POLITICAL_ACTOR") }
                onChange={this.onChange}
              /> */ : null}
              <Select
                name="targetting_party_list"
                placeholder={t("LABEL_TARGETTING_PARTY_LIST")}
                iconLeft={"fa-tags"}
                value={targetting_party_list}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_TARGETTING_PARTY_LIST") }
                onChange={this.onChange}
              />
              {targetting_party_list? <Select
                name="targetted_party_list"
                placeholder={t("LABEL_TARGETTED_PARTY_LIST")}
                iconLeft={"fa-tags"}
                multiple={true}
                value={targetted_party_list}
                options={lists.map(list=> ({
                  label: list.name,
                  value: list.name,
                }))}
                {...inputSize}
                label={t("LABEL_TARGETTED_PARTY_LIST") }
                onChange={this.onChange}
              />: null}
              <Select
                name="promoted_by_civil_society"
                placeholder={t("LABEL_PROMOTED_BY_CIVIL_SOCIETY")}
                iconLeft={"fa-tags"}
                value={promoted_by_civil_society}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_PROMOTED_BY_CIVIL_SOCIETY") }
                onChange={this.onChange}
              />
              {promoted_by_civil_society? <Select
                name="promoted_by_civil"
                placeholder={t("LABEL_PROMOTING_BY_CIVIL")}
                iconLeft={"fa-tags"}
                multiple={true}
                value={promoted_by_civil}
                options={civils.map(list=> ({
                  label: list.name,
                  value: list.name,
                }))}
                {...inputSize}
                label={t("LABEL_PROMOTING_BY_CIVIL") }
                onChange={this.onChange}
              />: null}
              <Select
                name="physical_reflection"
                placeholder={t("LABEL_PHYSICAL_REFLECTION")}
                iconLeft={"fa-tags"}
                value={physical_reflection}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_PHYSICAL_REFLECTION") }
                onChange={this.onChange}
              />
              {physical_reflection?<Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_PHYSICAL_REFLECTION_DESCRIPTION")}
                label={t("LABEL_PHYSICAL_REFLECTION_DESCRIPTION")}
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name="physical_reflection_description"
                value={physical_reflection_description || ""}
              />:null}
              <Select
                name="advertisement_clip"
                placeholder={t("LABEL_ADVERTISEMENT_CLIP")}
                iconLeft={"fa-tags"}
                opened
                value={advertisement_clip}
                options={this.getYesOrNoOptions(t)}
                {...inputSize}
                label={t("LABEL_ADVERTISEMENT_CLIP") }
                onChange={this.onChange}
              />
              
              {advertisement_clip?
              <>
              <Select
                    name="bosst_platforme"
                    placeholder={t("LABEL_BOSST_PLATFORME")}
                    iconLeft={"fa-tags"}
                    multiple={true}
                    value={bosst_platforme}
                    options={this.getPlatformeOptions(t)}
                    {...inputSize}
                    label={t("LABEL_BOSST_PLATFORME") }
                    onChange={this.onChange}
                  />
                  <div className="d-flex justify-content-around">
                  <Checkbox
                    text={t("TEXT_REPEAT")}
                    {...inputSize}
                    name="repeat"
                    value={!!repeat}
                    onChange={() =>
                      this.onChange({
                        target: { name: "repeat", value: !repeat }
                      })
                    }
                  />
                  {repeat?
                  
                    <Text
                      labelClass={null}
                      {...inputSize}
                      placeholder={t(" ")}
                      // label={t("LABEL_BOSST_START") }
                      inputType={"date"}
                      onChange={this.onChange}
                      name="repeating_date"
                      value={repeating_date}
                    /> : null}
                    </div>
                  
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t(" ")}
                    label={t("LABEL_BOSST_START") }
                    inputType={"date"}
                    onChange={this.onChange}
                    name="bosst_start_date"
                    value={bosst_start_date}
                  />
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t(" ")}
                    label={t("LABEL_BOSST_END") }
                    inputType={"date"}
                    onChange={this.onChange}
                    name="bosst_end_date"
                    value={bosst_end_date}
                  />
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t("LABEL_BOSST_ID")}
                    label={t("LABEL_BOSST_ID") }
                    inputType={"text"}
                    onChange={this.onChange}
                    name="bosst_id"
                    value={bosst_id}
                  />
                  <div className="row form-group">
                  <label className="col-sm-4 control-label">{t("LABEL_ADVERTISEMENT_CLIP_PRICE") }</label>
                  <div className="d-flex">
                  <select style={{
                    width : "100%",
                    marginRight : "15px",
                    marginLeft : "15px"
                  }} 
                  className="mySelect__control css-yk16xz-control mySelect__menu text-center" name="advertisement_clip_price" value={advertisement_clip_price} onChange={this.onChange}>
                    {
                      prices.map((el,i)=><option className="mySelect__option css-yt9ioa-option" value={el.value}>{el.value}</option>)
                    }
                  </select>
                  <select style={{
                    width : "100%",
                    marginLeft : "15px",
                    marginRight : "15px"
                  }} className="mySelect__control css-yk16xz-control mySelect__menu text-center" name="advertisement_clip_devis" value={advertisement_clip_devis} onChange={this.onChange}>
                    {
                      devis.map((el,i)=><option className="mySelect__option css-yt9ioa-option" value={el.value}>{el.value}</option>)
                    }
                  </select>
                  </div>
              </div>
              <Select
                    name="bosst_audience"
                    placeholder={t("LABEL_BOSST_AUDIENCE")}
                    iconLeft={"fa-tags"}
                    opened
                    value={bosst_audience}
                    options={this.getAudienceOptions(t)}
                    {...inputSize}
                    label={t("LABEL_BOSST_AUDIENCE") }
                    onChange={this.onChange}
                  />
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t("LABEL_BOSST_VU")}
                    label={t("LABEL_BOSST_VU") }
                    inputType={"text"}
                    onChange={this.onChange}
                    name="bosst_end_vu"
                    value={bosst_vu}
                  />
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t("LABEL_BOSST_AUTHOR")}
                    label={t("LABEL_BOSST_AUTHOR") }
                    inputType={"text"}
                    onChange={this.onChange}
                    name="bosst_author"
                    value={bosst_author}
                  />
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t("LABEL_BOSST_NUMBER")}
                    label={t("LABEL_BOSST_NUMBER") }
                    inputType={"text"}
                    onChange={this.onChange}
                    name="bosst_number"
                    value={bosst_number}
                  />
                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t("LABEL_BOSST_ADDEESS")}
                    label={t("LABEL_BOSST_ADDEESS") }
                    inputType={"text"}
                    onChange={this.onChange}
                    name="bosst_address"
                    value={bosst_address}
                  />

                <div className="row form-group">
                  <label className="col-sm-4 control-label">{t("LABEL_ADMIN") }</label>
                  {(admins || [{}]).map((el,i)=>i===0?<div className="d-flex">
                  <input style={{
                    width : "100%",
                    marginRight : "15px",
                    marginLeft : "15px"
                  }} 
                  className="mySelect__control css-yk16xz-control mySelect__menu text-center" 
                  name="admin_country" 
                  value={admin_country} 
                  placeholder = {t("TEXT_ADD_COUNTRY_NAME")}
                  onChange={this.onChange}
                  />
                   
                  <input style={{
                    width : "100%",
                    marginLeft : "15px",
                    marginRight : "15px"
                  }} className="mySelect__control css-yk16xz-control mySelect__menu text-center" 
                  name="admin_number" 
                  placeholder = {t("TEXT_ADD_ADMIN_NUMBER")}
                  value={admin_number} 
                  onChange={this.onChange}
                  type="number"
                  />
                    <Button
                      block={false}
                      icon={"fa-plus"}
                      className={"col-md-4 pull-right"}
                      type="success"
                      pullRight={true}
                      onClick = {this.addAdmins}
                      
                    />
                  </div>:
                  <>
                  <label className="col-sm-4 control-label"></label>
                  <div className="d-flex">
                  <input style={{
                    width : "100%",
                    marginRight : "15px",
                    marginLeft : "15px"
                  }} 
                  className="mySelect__control css-yk16xz-control mySelect__menu text-center" 
                  disabled
                  value = {el.country}
                  />
                   
                  <input style={{
                    width : "100%",
                    marginRight : "15px",
                    marginLeft : "15px"
                  }} 
                  className="mySelect__control css-yk16xz-control mySelect__menu text-center" 
                  disabled
                   value= {el.number}
                  />
                    <Button
                      block={false}
                      icon={"fa-trash"}
                      className={"col-md-4 pull-right"}
                      type="success"
                      pullRight={true}
                      onClick = {()=>this.deleteAdmin(el.id)}
                      
                    />
                  </div>
                  </>
                  )}
              </div>


                  <Text
                    labelClass={null}
                    {...inputSize}
                    placeholder={t("LABEL_BOSST_COMMENT")}
                    label={t("LABEL_BOSST_COMMENT")}
                    rows={4}
                    inputType={"textarea"}
                    onChange={this.onChange}
                    name="bosst_comment"
                    value={bosst_comment || ""}
                  />             
              </>
              
              
              :null}
              <Select
                name="article_rate"
                placeholder={t("LABEL_RATE_ARTICLE")}
                iconLeft={"fa-tags"}
                value={article_rate}
                options={this.getArticleRateOptions(t)}
                {...inputSize}
                label={t("LABEL_RATE_ARTICLE") }
                onChange={this.onChange}
              />
              <Text
                labelClass={null}
                {...inputSize}
                placeholder={t("LABEL_TARGETTED_PARTY")}
                label={t("LABEL_TARGETTED_PARTY")}
                rows={4}
                inputType={"textarea"}
                onChange={this.onChange}
                name="targetted_party"
                value={targetted_party || ""}
              />
              <Button
                block
                onClick={()=>update(this.state.news)}
                icon={"fa-plus"}
                type="success"
                text={t("BTN_SAVED")}
              />
              </Col>
            </Form>
            </div>
          </div>
        </div>
        <div className="box box-default">
          <div className="box-header with-border">
            <h3 className="box-title">
              <Label>
                <FontAwesomeIcon icon={["fas", "photo-video"]} />
                {" " + t("LABEL_PREUVES")}
              </Label>
            </h3>
            <div className="box-body">
              {news.files.map((fileItem) => (
                <FileComponent file={fileItem} key={fileItem.serverId} staticPath={newsFilePath} />
              ))}
            </div>
          </div>
        </div>
        {/* <div className="box box-default">
          <div className="box-header with-border">
            <h3 className="box-title">
              <Label>
                <FontAwesomeIcon icon={["fas", "link"]} /> {" " + t("LABEL_URLS")}
              </Label>
            </h3>
            <div className="box-body">
              {news.additionalLinks.map((link) => (
                <a href={link} target={"_blank"}>
                  {link}
                </a>
              ))}
            </div>
          </div>
        </div> */}
        {/* {news.comments.map((c, i) => (
          <div key={i} className="box box-default">
            <div className="box-header with-border">
              <h2 className="box-title">
                <b> {c && c.user && c.user.fName + " " + c.user.lName}</b>
              </h2>
              <span className="pull-right text-info">{getTime(c.created)}</span>
            </div>
            <div className="box-body">{c.text}</div>
          </div>
        ))} */}
        {/* <div className="box box-default">
          <div className="box-header with-border">
            <Form className={"form-horizontal form-grid"}>{this.props.children}</Form>
          </div>
        </div> */}
        {/* <Form className={"form-horizontal form-grid"}>
          <Text
            rows={4}
            inputType={"textarea"}
            name={"userComment"}
            onChange={this.props.onChangeComment}
            value={this.props.userComment}
            labelSm={0}
            sm={12}
            placeholder={t("BTN_AJOUTER_UN_COMMENTAIRE")}
          />
          <Button
            block
            onClick={(e) => this.props.onSubmit(e)}
            value={"userComment"}
            icon={"fa-share"}
            type="success"
            text={t("BTN_AJOUTER_UN_COMMENTAIRE")}
          />
        </Form> */}
      </div>
    );
  }
}
function mapDispatchToProps(dispatch) {
  return {
    update: (data, cb) => dispatch(News.update(data, cb)),
    getActors: () => {
      dispatch(ActorRessource.get());
  }, 
  getLists: () => {
    dispatch(PartyRessource.get());
  },
  getCivils: () => {
    dispatch(CivilSocietyRessource.get());
  },
  };
}
function mapStateToProps(state) {
  return {
      actors : state.data.actors,
      civils : state.data.civils,
      lists : state.data.partys,
  };
}
InformationsComponents.defaultProps = {
  actors : [],
  civils : [],
  lists : [],
};
export default withTranslation()(
  connect(
  mapStateToProps,
  mapDispatchToProps
)(InformationsComponents)
)