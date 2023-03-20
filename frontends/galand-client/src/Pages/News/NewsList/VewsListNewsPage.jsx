import React, { Component, Fragment } from "react";
import { connect } from "react-redux";
import _ from "lodash";
import { withTranslation } from "react-i18next";
import Tabs from "components/Tabs";
import { Button, TabContent, Content } from "adminlte-2-react";
import { TypedNews, News, Projects, User, Role } from "modules/ressources";
import CustomSearchWidget from "../../SavedSearches/components/CustomSearchWidget";
import AddCustomSearch from "../../SavedSearches/components/AddCustomSearch";
import AdvancedSearchBar from "../../Scrapping/components/AdvancedSearchBar";
import FilterAndSearch from "./components/FilterAndSearch";
import NewsList from "./components/NewsList";
import SortBar from "../../Scrapping/components/SortBar";
import SimilaritySearchTab from "../../Scrapping/components/SimilaritySearchTab";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import AddFakeModal from "Pages/Scrapping/components/AddFakeModal";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import exportFromJSON from 'export-from-json';
import { Medias } from "modules/ressources";
import { element } from "prop-types";

function Hook({ callback, isRequesting }) {
  useBottomScrollListener(() => {
    if (!isRequesting) callback();
  });
  return null;
}

const exportType = 'xls'  

class ViewNews extends Component {
  constructor(props) {
    super(props);
    this.state = {
      displayType: 6,
      filter: {},
      advancedFilter: {},
      sort: [{ key: "created", order: "desc" }],
      page: 0,
    };
    this.switchDisplay = this.switchDisplay.bind(this);
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeSort = this.onChangeSort.bind(this);
    this.onChange = this.onChange.bind(this);
    this.optionsFilter = this.optionsFilter.bind(this);
    this.initialSearch = { filter: {}, advancedFilter: {}, sort: [{ key: "created", order: "desc" }] };
    this.resetSearch = this.resetSearch.bind(this);

    const { type, describeNews, filterNews, getProject, userId } = this.props;

    const { projectId } = this.props.match.params;
    this.callback = () => {
      const { page, filter, advancedFilter, sort } = this.state;
      this.setState({
        page: page + 1,
      });
      filterNews(type, {
        filter: { ...filter, ...advancedFilter, projectId },
        page: page + 1,
        sort,
      });
    };
    describeNews();
    if (projectId)
      getProject(projectId).then((prj) => {
        let access = false;
        if (prj) {
          const assignees = prj["assignees"];
          const user = assignees.filter(el=> el === userId );
          if(user.length){
            access = true;
          }
          prj.endProject < Date.now()
            ? this.setState({ projectExpired: true, access })
            : this.setState({ projectExpired: false, access });
        }
      });
  }
  componentWillMount() {
    const { getNews, type, getMedias, getUsers, getRoles} = this.props;
    const { projectId } = this.props.match.params
    getNews(type, projectId);
    getMedias();
    getUsers();
    getRoles();
  }
  componentDidUpdate(prevProps, prevState) {
    const { filterNews, type, getProject, userId } = this.props;
    const { advancedFilter, filter, sort } = this.state;
    const { projectId } = this.props.match.params;
    let access = false;
    if (prevProps.match.params.projectId !== projectId) {
      getProject(projectId).then((prj) => {
        if (prj) {
          const assignees = prj["assignees"];
          const user = assignees.filter(el=> el === userId );
          if(user.length){
            access = true;
          }
          prj.endProject < Date.now()
            ? this.setState({ projectExpired: true, access  })
            : this.setState({ projectExpired: false, access  });
        }
      });
    }
    if (
      prevProps.match.params.projectId !== projectId ||
      prevState.filter !== filter ||
      prevState.sort !== sort ||
      prevState.advancedFilter !== advancedFilter
    ) {
      this.setState({
        page: 0,
      });
      clearTimeout(this.tid);

      const { projectId } = this.props.match.params;
      this.tid = setTimeout(() => {
        filterNews(type, {
          filter: { ...filter, ...advancedFilter, projectId },
          page: 0,
          sort,
        });
      }, 500);
    }
  }

  resetSearch() {
    this.onChange(this.initialSearch);
  }

  onChange(data) {
    this.setState(data);
  }

  optionsFilter(option) {
    const parts = String(option).split(".");
    if (parts[0] === "form") {
      const { forms } = this.props.selectedProject;
      return forms.indexOf(parts[1]) >= 0;
    }
    return true;
  }

  onChangeSort(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  onChangeFilter(e, isAdvancedFilter = false) {
    if (isAdvancedFilter) {
      return this.setState({
        advancedFilter: e,
      });
    }
    const { name, value } = e.target;
    this.setState({
      filter: {
        ...this.state.filter,
        [name]: value,
      },
    });
  }

  switchDisplay(displayType) {
    this.setState({ displayType });
  }

  getArticleTypeOptions(t) {
    return {
        0: t("TEXT_IMAGE"),      
        1: t("TEXT_TEXT"),
        2: t("TEXT_VIDEO"),
        3: t("TEXT_RECORD_VOICE"),
        4: t("TEXT_OTHER")
      }
  }
  getPlatformeOptions(t) {
    return {
      0: t("TEXT_INSTAGRAM"),  
      1: t("TEXT_FACEBOOK"),
      2: t("TEXT_WHATSAPP"),
      3: t("TEXT_MESSANGE"),
    }
  }

  getAudienceOptions(t) {
    return {
      0: t("100-1k"),
      1: t("1k-5k"),
      2: t("5k-10k"),
      3: t("10k-50k"),
      4: t("50k-100k"),
      5: t("100k-500k"),
      6: t("500k-1M"),
      7: t("+1M"),
    }
  }
  getRessourceTypeOptions(t) {
    return {
        0: t("TEXT_WEBSITE"),
        1: t("TEXT_FACEBOOK"),
        2: t("TEXT_TWITTER"),
        3: t("TEXT_YOUTUBE"),
        4: t("TEXT_OTHER")
    }
  }
  getPageBelongToOptions(t) {
    return {
        0: t("TEXT_CANDIDATE"),
        1: t("TEXT_PARTY"),
        2: t("TEXT_LIST"),
        3: t("TEXT_INDEPENDENT"),
        4: t("TEXT_OTHER")
      }
  }  
  getPostTopicOptions(t) {
    return {
        0: t("TEXT_ELECTIVE"),
        1: t("TEXT_POLITICAL"),
        2: t("TEXT_ECONOMIC"),
        3: t("TEXT_SOCIAL"),
        4: t("TEXT_SPORT"),
        5: t("TEXT_ART"),
        6: t("TEXT_VARIED")
      }
  }  
  getArticleRateOptions(t) {
    return {
        0: t("TEXT_TRUE_NEWS"),
        1: t("TEXT_FAKE_NEWS"),
        2: t("TEXT_BAD_NEWS"),
        3: t("TEXT_MISLEADING_NEWS"),
        4: t("TEXT_INCOMPLETE_NEWS"),
        5: t("TEXT_SCANDALOUS_NEWS"),
        6: t("TEXT_SARCASTIC_NEWS")
      }
  } 

  getSentimentTypeOptions(t) {
    return {
        0: t("TEXT_POSITIVE"),
        1: t("TEXT_NEGATIVE"),
        2: t("TEXT_NEUTRAL")
      }
  }

  getDegreOptions(t) {
    return {
        0: t("TEXT_DEGREE_DISAGREEMENT"),
        1: t("TEXT_NEGATIVE_ACTION"),
        2: t("TEXT_NEGATIVE_CHARACTER"),
        3: t("TEXT_DEMONIZING_DEHUMINAZING"),
        4: t("TEXT_VIOLENCE"),
        5: t("TEXT_DEATH"),
        6: t("TEXT_DONT_MATCH")
      }
  }
  getDegreeWomanOptions(t) {
    return {
        0: t("TEXT_INCITEMENT_TO_PHYSICAL_VIOLENCE"),          
        1: t("TEXT_THREATS_AND_INTIMIDATION_WITH_THE_AIM_OF_WITHDRAWING_FROM_THE_RACE"),                  
        2: t("TEXT_DESCRIPTION_INCOMPETENCE"),                    
        3: t("TEXT_DESCRIPTION_LACK_FITNESS"),                    
        4: t("TEXT_SPREADING_RUMORS"),            
        5: t("TEXT_MARGINALIZATION_SOCIAL_EXCLUSION_AND_SHAME"),                    
        6: t("TEXT_SEXUAL_HARASSMENT"),                    
        7: t("TEXT_RAPE_THREAT"),                    
        8: t("TEXT_VERBAL_ASSAULT"),                    
        9: t("TEXT_NON_CONSENSUAL_PHOTO_VIDEO"),                  
        10: t("TEXT_OTHER_PLEASE_SPECIFY"),    
    }
  }
  getHateTypeOptions(t) {
    return {
        0: t("LABEL_TOXICITY"),
        1: t("LABEL_IDENTITY_ATTACK_2"),
        2: t("LABEL_INSULT"),
        3: t("LABEL_PROFANITY"),
        4: t("LABEL_THREAT"),
        5: t("TEXT_DONT_MATCH")
      }
  }
  getHateWomanTypeOptions(t) {
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
  getLegalTextOptions(t) {
    return {
        0: t("TEXT_DEFAMATION"),
        1: t("TEXT_TREACHERY"),
        2: t("TEXT_PROVOKING_SECTARIAN_STRIFE"),
        3: t("INCITEMENT_TO_VIOLENCE_AND_RIOT"),
        4: t("TEXT_DONT_MATCH")
      }
  }
  getTargettingOptions(t) {
    return {
        0: t("TEXT_SEX"),
        1: t("TEXT_RACE"),
        2: t("TEXT_RELIGIOUS_AFFILIATION"),
        3: t("TEXT_DISABILITY"),
        4: t("TEXT_REFUGEES"),
        5: t("TEXT_SKIN_COLOUR"),
        6: t("TEXT_DONT_MATCH")
      }
  }
  getWomanHateTypeOptions(t) {
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
  getUsedToolsOptions(t) {
    return {      
        0: t("TEXT_DEEPFAKES_FAKE_IMAGE"),                  
        1: t("TEXT_DEEPFAKES_SYNTHETIC_AUDIO"),                    
        2: t("TEXT_DEEPFAKES_SYNTHETIC_VIDEOS"),              
        3: t("TEXT_CYBERATTACKS"),                  
        4: t("TEXT_OTHER_PLEASE_SPECIFY"),                    
        5: t("TEXT_NONE_OF_ABOVE"),      
    }
  }
  getHateSourceOptions(t) {
    return {
      0: t("TEXT_LEGAL"),
      1: t("TEXT_PROCEDURAL"),
      2: t("TEXT_SOCIAL_NORMS"),
      3: t("TEXT_ECONOMICAL"),
      4: t("TEXT_DOCTRINAL"),
      5: t("TEXT_OTHER_PLEASE_SPECIFY")
    }
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
  getPowerHateOptions(t) {
    return {
        0: t("TEXT_DISAGREEING_WITH_WORDS"),
        1: t("TEXT_NEGATIVE_ACTIONS"),
        2: t("TEXT_DESCRIBE_THE_CHARACTER_IN_A_NEGATIVE_WAY"),
        3: t("TEXT_DEMONIZATION_AND_DEHUMANIZATION"),
        4: t("TEXT_VIOLENCE"),
        5: t("TEXT_THE_KILL"),
      }
  }
  getViolenceImpactOptions(t) {
    return {
        0: t("TEXT_WITHDRAWAL_FROM_THE_RACE"),
        1: t("TEXT_SOCIAL_HARM"),
        2: t("TEXT_PSYCHOLOGICAL_DAMAGE"),
        3: t("TEXT_OTHER_PLEASE_SPECIFY")
      }
  }

  ExportToExcel = (data) => {  
    const {tags, medias, t} = this.props;
    let host = window.location.host;

    console.log("host", host)
    let newData = data.map(el=>{
      let picked =_.pick(el,["title", "text", "id", "link", "author", "categories", 
    "creatorInfo", "created", "like_count", "media", "nbre_share", "source", "subjects", 
    "actor", "count_comments","lastModified", "analyse", "hate_speech", "monitor_social_media", 
    "woman_presence","reactions", "constituency", "userCoverImage"])

    picked.created = new Date(picked.created);
    let  woman_presence = {}
    let  hate_speech = {}

    let coverImage;
    if (picked.userCoverImage.length){
      coverImage = host + "/api/manager/static/cover?load="+picked.userCoverImage[0].serverId;
      picked.coverImage = coverImage;
    }

    if(picked.hate_speech && picked.hate_speech.divs){
      if(host !== "20.86.65.153:8081"){
      picked.hate_speech.divs.forEach((el,i)=>{      
        i !==0 ? hate_speech[`التعليق عدد ${i !==0 ? i : ""}`]=eval("picked.hate_speech.comment_text_"+i):null;
        hate_speech[`نوع المشاعر ${i !==0 ? i : ""}`]=this.getSentimentTypeOptions(t)[eval("picked.hate_speech.sentiment_type_"+i)]?this.getSentimentTypeOptions(t)[eval("picked.hate_speech.sentiment_type_"+i)] : "";
        hate_speech[`هل الكراهية موجودة ${i !==0 ? i : ""}`]= eval("picked.hate_speech.hate_exist_"+i)?"نعم" : "لا";
        hate_speech[`فقرة تحتوي على الكراهية ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_speech_paragraph_"+i);
        hate_speech[`نوع الكراهية ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_type_"+i)?eval("picked.hate_speech.hate_type_"+i).map(el=>this.getHateTypeOptions(t)[el]).join(", "):"";
        // hate_speech[`ماذا يستهدف خطاب الكراهية تطبيقاً للنصوص القانونية ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_applying_legal_text_"+i)?eval("picked.hate_speech.hate_applying_legal_text_"+i).map(el=>this.getLegalTextOptions(t)[el]).join(", "):"";
        hate_speech[`ماذا يستهدف خطاب الكراهية ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_targetting_"+i)?eval("picked.hate_speech.hate_targetting_"+i).map(el=>this.getTargettingOptions(t)[el]).join(", "):"";
        hate_speech[`درجة الهجوم ${i !==0 ? i : ""}`]=eval("picked.hate_speech.attack_degree_"+i)?eval("picked.hate_speech.attack_degree_"+i).map(el=>this.getDegreOptions(t)[el]).join(", "):"";
       
    })
    }else{
      picked.hate_speech.divs.forEach((el,i)=>{      
        i !==0 ? hate_speech[`comentario número ${i !==0 ? i : ""}`]=eval("picked.hate_speech.comment_text_"+i):null;
        hate_speech[`O ódio existe ${i !==0 ? i : ""}`]= eval("picked.hate_speech.hate_exist_"+i)?"Sim" : "Não";
        hate_speech[`Tipo de sentimento ${i !==0 ? i : ""}`]=this.getSentimentTypeOptions(t)[eval("picked.hate_speech.sentiment_type_"+i)]?this.getSentimentTypeOptions(t)[eval("picked.hate_speech.sentiment_type_"+i)] : "";
        hate_speech[`Tipo de ódio ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_type_"+i)?eval("picked.hate_speech.hate_type_"+i).map(el=>this.getHateTypeOptions(t)[el]).join(", "):"";
        hate_speech[`O parágrafo que contém o ódio ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_speech_paragraph_"+i);
        hate_speech[`O que a segmentação de discurso de ódio aplicando o texto legal ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_applying_legal_text_"+i)?eval("picked.hate_speech.hate_applying_legal_text_"+i).map(el=>this.getLegalTextOptions(t)[el]).join(", "):"";
        hate_speech[`O que a segmentação de discurso de ódio ${i !==0 ? i : ""}`]=eval("picked.hate_speech.hate_targetting_"+i)?eval("picked.hate_speech.hate_targetting_"+i).map(el=>this.getTargettingOptions(t)[el]).join(", "):"";
        hate_speech[`Grau de ataque ${i !==0 ? i : ""}`]=eval("picked.hate_speech.attack_degree_"+i)?eval("picked.hate_speech.attack_degree_"+i).map(el=>this.getDegreOptions(t)[el]).join(", "):"";
    })
    }
    }

    if(picked.woman_presence && picked.woman_presence.divs){
      if(host !== "20.86.65.153:8081"){
      picked.woman_presence.divs.forEach((el,i)=>{      
        i !==0 ? woman_presence[`التعليق عدد ${i !==0 ? i : ""}`]=eval("picked.woman_presence.comment_text_"+i):"";
        woman_presence[`نوع المقال ${i !==0 ? i : ""}`]=eval("picked.woman_presence.article_type_"+i)?eval("picked.woman_presence.article_type_"+i).map(el=>this.getArticleTypeOptions(t)[el]).join(", "):"";
        woman_presence[`نوع الصفحة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.ressource_type_"+i)?eval("picked.woman_presence.ressource_type_"+i).map(el=>this.getRessourceTypeOptions(t)[el]).join(", "):"";
        woman_presence[`اسم الصفحة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.ressource_name_"+i);
        woman_presence[`موضوع المنشور ${i !==0 ? i : ""}`]=this.getPostTopicOptions(t)[eval("picked.woman_presence.post_topic_"+i)]?this.getPostTopicOptions(t)[eval("picked.woman_presence.post_topic_"+i)] : "";
        if (!i===0) woman_presence[`موضوع التعليق ${i !==0 ? i : ""}`]=this.getPostTopicOptions(t)[eval("picked.woman_presence.comment_topic_"+i)];
        woman_presence[`نوع المشاعر في تحليل حضور المرأة ${i !==0 ? i : ""}`]=this.getSentimentTypeOptions(t)[eval("picked.woman_presence.sentiment_type_"+i)]?this.getSentimentTypeOptions(t)[eval("picked.woman_presence.sentiment_type_"+i)] : "";
        woman_presence[`كتب من قبل امرأة  ${i !==0 ? i : ""}`]=eval("picked.woman_presence.written_by_woman_"+i)?"نعم" : "لا";
        woman_presence[`تحدث عن المرأة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.talk_about_woman_"+i)?"نعم" : "لا";
        woman_presence[`إحتوى على عنف ضد المرأة ${i !==0 ? i : ""}`]= eval("picked.woman_presence.hate_against_woman_"+i)?"نعم" : "لا";
        woman_presence[`الضحية المستهدفة للعنف ${i !==0 ? i : ""}`]=this.getHatePersonOptions(t)[eval("picked.woman_presence.targeted_victim_of_violence_"+i)]?this.getHatePersonOptions(t)[eval("picked.woman_presence.targeted_victim_of_violence_"+i)].label:"";
        // woman_presence[`نوع الكراهية ضد المرأة ${i !==0 ? i : ""}`]=this.getWomanHateTypeOptions(t)[eval("picked.woman_presence.hate_type_"+i)]?this.getWomanHateTypeOptions(t)[eval("picked.woman_presence.hate_type_"+i)].label:"";
        woman_presence[`نوع العنف ضد المرأة ${i !==0 ? i : ""}`]=this.getHateWomanTypeOptions(t)[eval("picked.woman_presence.hate_type_"+i)]?this.getHateWomanTypeOptions(t)[eval("picked.woman_presence.hate_type_"+i)].label:"";
        woman_presence[`هل تصف نوع العنف ضد المرأة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.paragraph_violence_against_women_"+i);
        woman_presence[`الاسلوب المستخدم بالعنف ${i !==0 ? i : ""}`]=eval("picked.woman_presence.type_violence_"+i)?eval("picked.woman_presence.type_violence_"+i).map(el=>this.getDegreeWomanOptions(t)[el]).join(", "):"";
        woman_presence[`الأدوات المستخدمة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.used_violence_tools_"+i)?eval("picked.woman_presence.used_violence_tools_"+i).map(el=>this.getUsedToolsOptions(t)[el]).join(", "):"";
        woman_presence[`مصدر العنف ${i !==0 ? i : ""}`]=eval("picked.woman_presence.source_violence_"+i)?eval("picked.woman_presence.source_violence_"+i).map(el=>this.getHateSourceOptions(t)[el]).join(", "):"";
        woman_presence[`إذا كانت المقالة مكتوبة على موقع ويب , فما هو تقييم رد فعل الكاتب / الصحفي على النشر ${i !==0 ? i : ""}`]=this.getSentimentTypeArticelOptions(t)[eval("picked.woman_presence.article_violence_"+i)]?this.getSentimentTypeArticelOptions(t)[eval("picked.woman_presence.article_violence_"+i)].label:"";
        woman_presence[`ما هي شدة الكلام الذي يحرض على العنف / الكراهية ${i !==0 ? i : ""}`]=eval("picked.woman_presence.power_hate_"+i)?eval("picked.woman_presence.power_hate_"+i).map(el=>this.getPowerHateOptions(t)[el]).join(", "):"";
        woman_presence[`الصورة النمطية للمرأة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.stereotype_woman_"+i)?"نعم" : "لا";
        woman_presence[`وصف الصورة النمطية ${i !==0 ? i : ""}`]=eval("picked.woman_presence.description_stereotype_"+i);
        woman_presence[`فقرة الصورة النمطية ${i !==0 ? i : ""}`]=eval("picked.woman_presence.paragraph_stereotype_"+i);
        woman_presence[`كلام إيجابي للمرأة ${i !==0 ? i : ""}`]=eval("picked.woman_presence.positif_woman_speech_"+i)?"نعم" : "لا";
        woman_presence[`وصف الكلام الإيجابي ${i !==0 ? i : ""}`]=eval("picked.woman_presence.positif_speech_description_"+i);
        woman_presence[`فقرة الكلام الإيجابي ${i !==0 ? i : ""}`]=eval("picked.woman_presence.positif_speech_paragraph_"+i);
        woman_presence[`أثر العنف ${i !==0 ? i : ""}`]=eval("picked.woman_presence.violence_impact_"+i)?eval("picked.woman_presence.violence_impact_"+i).map(el=>this.getViolenceImpactOptions(t)[el]).join(", "):"";
        woman_presence[`وصف أثر العنف ${i !==0 ? i : ""}`]=eval("picked.woman_presence.violence_impact_description_"+i);
    })
    }else{
      picked.woman_presence.divs.forEach((el,i)=>{      
        i !==0 ? woman_presence[`comentario número ${i !==0 ? i : ""}`]=eval("picked.woman_presence.comment_text_"+i):null;
        woman_presence[`odio contra la mujer ${i !==0 ? i : ""}`]= eval("picked.woman_presence.hate_against_woman_"+i)?"Sim" : "Não";
        woman_presence[`hablaba de mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.talk_about_woman_"+i)?"نعم" : "لا";
        woman_presence[`el tipo de odio contra la mujer ${i !==0 ? i : ""}`]=this.getWomanHateTypeOptions(t)[eval("picked.woman_presence.hate_type_"+i)]?this.getWomanHateTypeOptions(t)[eval("picked.woman_presence.hate_type_"+i)].label:"";
        woman_presence[`escrito por una mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.written_by_woman_"+i)?"Sim" : "Não";
        woman_presence[`estereotipo de mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.stereotype_woman_"+i)?"Sim" : "Não";
        woman_presence[`descripción del estereotipo de mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.description_stereotype_"+i);
        woman_presence[`párrafo de estereotipo de mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.paragraph_stereotype_"+i);
        woman_presence[`discurso positivo sobre la mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.positif_woman_speech_"+i)?"Sim" : "Não";
        woman_presence[`descripción del discurso positivo sobre la mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.positif_speech_description_"+i);
        woman_presence[`párrafo del discurso positivo sobre la mujer ${i !==0 ? i : ""}`]=eval("picked.woman_presence.positif_speech_paragraph_"+i);
    })
    }
    }
    picked.dynamic_woman_presence = woman_presence;
    picked.dynamic_hate_speech = hate_speech;

  
    // Object.keys(picked.woman_presence).forEach(el=>{
    //   picked[el]=picked.woman_presence[el]
    // })
    if(picked.hate_speech)
    Object.keys(picked.hate_speech).forEach(el=>{
      picked[el]=picked.hate_speech[el]
    })
    if(picked.monitor_social_media)
    Object.keys(picked.monitor_social_media).forEach(el=>{
      picked[el]=picked.monitor_social_media[el]
    })
    picked.creatorInfo=picked.creatorInfo.fName + " " + picked.creatorInfo.lName

    if(picked.analyse){
    Object.keys(picked.analyse.sentiment).forEach(el=>{
      picked[el]=picked.analyse.sentiment[el]
    })
    Object.keys(picked.analyse.custom_dictionary).forEach(el=>{
      picked[el]=picked.analyse.custom_dictionary[el]
    })
 
    picked.external_hate_speech_toxicity = picked.analyse.hate_speech.toxicity
    picked.external_hate_speech_profanity = picked.analyse.hate_speech.profanity
    picked.external_hate_speech_identity_attack = picked.analyse.hate_speech.identity_attack
    picked.external_hate_speech_severe_toxicity = picked.analyse.hate_speech.severe_toxicity
    picked.external_hate_speech_threat = picked.analyse.hate_speech.threat
    picked.external_hate_speech_insult = picked.analyse.hate_speech.insult
    picked.internal_hate_speech_normal = 
    picked.analyse.hate_speech.normal_model
    picked.internal_hate_speech_offensive = 
    picked.analyse.hate_speech.offensive_model
    picked.internal_hate_speech_hateful = 
    picked.analyse.hate_speech.hateful_model
    picked.internal_hate_speech_abusive = 
    picked.analyse.hate_speech.abusive_model
  }

  let categories = "";
  for (let i = 0; i < picked.categories.length; i++) {
    const targetTag = tags ? tags.filter(t => t._id === picked.categories[i])[0]:null;
    if(targetTag){
      categories = categories + targetTag.label + " "
    }
        
  }
  picked.categories = categories;

  let subjects = "";
  for (let i = 0; i < picked.subjects.length; i++) {
    const targetTag = tags ? tags.filter(t => t._id === picked.subjects[i])[0] : null;
    if(targetTag){
      subjects = subjects + targetTag.label + " "
    }
        
  }
  picked.subjects = subjects;

  let mediaFilter = medias?medias.filter(t => t._id === picked.media)[0]:null;

  picked.media = mediaFilter ? mediaFilter["name"] : picked.media;

    return (_.omit(picked,["time_taken", "sentence", "woman_presence", 
    "monitor_social_media", "analyse", "hate_speech"]))
  });
  console.log("old Data", data)
  console.log("newData", newData)

  const translatedData = newData.map(element=>{
    let reactions = element.reactions || {};
    let objToReturn = host !== "20.86.65.153:8081"?{
    "عنوان": element.title,
    "النص": element.text,
    "إسم الراصد" : element.creatorInfo,
    "رابط الصورة" : element.coverImage,
    "رابط" : element.link,
    "المواضيع" : element.subjects,
    "الهيئة الفرعية" : element.categories,
    "الدائرة الإنتخابية " : element.constituency,
    "المترشح" : element.actor,
    "عدد النشر" : element.nbre_share,
    "تاريخ الإنشاء" : element.created,
    "وسيلة الإعلام" : element.media,
    "المصدر" : element.source,
    "المؤلف" : element.author,
    "عدد الإعجابات" : element.like_count,
    "عدد التعاليق" : reactions.count_comments || element.count_comments,
    "عدد الحب" : reactions.count_love,
    "عدد الضحك" : reactions.count_haha,
    "عدد الغضب" : reactions.count_angry,
    "عدد الرعاية" : reactions.count_care,
    "عدد الحزينة" : reactions.count_sad,
    "عدد التفاجؤ" : reactions.count_wow,
    "عدد إعادة التغريد" : element.retweet_count,
    "سلبي" : element.negative,
    "إيجابي" : element.positive,
    // "الكراهية موجودة" : element.hate_exist?"نعم" : "لا",
    "خطاب الكراهية الخارجي - السمية" : element.external_hate_speech_toxicity,
    "خطاب الكراهية الخارجي - شتم" : element.external_hate_speech_profanity,
    "خطاب الكراهية الخارجي - هجوم الهوية" : element.external_hate_speech_identity_attack,
    "خطاب الكراهية الخارجي - السمية الشديدة" : element.external_hate_speech_severe_toxicity,
    "خطاب الكراهية الخارجي - التهديد" : element.external_hate_speech_threat,
    "خطاب الكراهية الخارجي - إهانة" : element.external_hate_speech_insult,
    "خطاب الكراهية الداخلي - عادي" : element.internal_hate_speech_normal,
    "خطاب الكراهية الداخلي - مسيء" : element.internal_hate_speech_offensive,
    "خطاب كراهية داخلي - بغيض" : element.internal_hate_speech_hateful,
    "خطاب كراهية داخلي - تعسفي" : element.internal_hate_speech_abusive,
    "نوع المقال" : element.article_type?element.article_type.map(el=>this.getArticleTypeOptions(t)[el]).join(", "):"",
    "نوع الصفحة" : element.ressource_type ? element.ressource_type.map(el=>this.getRessourceTypeOptions(t)[el]).join(", "):"",
    // "اسم الصفحة" : element.ressource_name_0,
    "الجهة التي تتبعها الصفحة": this.getPageBelongToOptions(t)[element.page_belong_to],
    "موضوع المقال" :this.getPostTopicOptions(t)[element.post_topic],
    "يروج لفاعل سياسي" : element.promote_political_actor?"نعم" : "لا",
    "روجت الفاعل السياسي": element.promoted_political_actor,
    "يروج لحزب سياسي" : element.promote_party_list?"نعم" : "لا",
    "حزب السياسي تم الترويج له" : element.promoted_party_list ? element.promoted_party_list.join(", "):"",
    "استهداف الفاعل السياسي" : element.targetting_political_actor?"نعم" : "لا",
    "فاعل سياسي مستهدف": element.targetted_political_actor,
    "يستهدف لحزب سياسي" : element.targetting_party_list?"نعم" : "لا",
    "الحزب السياسي مستهدفة" : element.targetted_party_list?element.targetted_party_list.join(", "):"",
    "الترويج من قبل المجتمع المدني" : element.promoted_by_civil_society ? "نعم" : "لا",
    "المجتمع المدني الذي روج" : element.promoted_by_civil_society ? element.promoted_by_civil.join(", "):"",
    "انعكاس مادي": element.physical_reflection?"نعم" : "لا",
    "وصف الانعكاس المادي": element.physical_reflection_description,
    "تقييم المقال": this.getArticleRateOptions(t)[element.article_rate],
    "من هي الجهة المستهدفة": element.targetted_party,
    "مقطع إعلان":  element.advertisement_clip?"نعم" : "لا",
    "منصةالمتعلقة بالإعلان": this.getPlatformeOptions(t)[element.bosst_platforme],
    "إعادة" : element.repeat?"نعم" : "لا",
    "تاريخ الإعادة" : element.repeat ? element.repeating_date : undefined,
    "بدأت في": element.bosst_start_date,
    "نهاية الى": element.bosst_end_date,
    "المعرف": element.bosst_id,
    "تكلفة الإعلان" : element.advertisement_clip? element.advertisement_clip_price + " " + element.advertisement_clip_devis : "",
    "حجم الجمهور المقدّر": this.getAudienceOptions(t)[element.bosst_audience],
    "مرات الظهور": element.bosst_vu,
    "إخلاء المسؤولية": element.bosst_author,
    "رقم الهاتف": element.bosst_number,
    "العنوان": element.bosst_address,
    "المشرفون" : element.admins?element.admins.map((el,i)=>i!==0?el.country + " : " + el.number : "").join(" ; ") : "",
    "تعليق": element.bosst_comment,
    }:{
      "título": element.title,
    "texto": element.text,
    "nombre del creador" : element.creatorInfo,
    "Enlace" : element.link,
    "categorías" : element.categories,
    "asignaturas" : element.subjects,
    "compartir número" : element.nbre_share,
    "Fecha de creación" : element.created,
    "medio de comunicación" : element.media,
    "fuente" : element.source,
    "autor" : element.author,
    "le gusta el numero" : element.like_count,
    "número de comentarios" : reactions.count_comments,
    "cuenta de amor" : reactions.count_love,
    "conteo de risas" : reactions.count_haha,
    "conde enojado" : reactions.count_angry,
    "conteo de cuidados" : reactions.count_care,
    "triste cuenta" : reactions.count_sad,
    "cuenta wow" : reactions.count_wow,
    "recuento de retuits" : element.retweet_count,
    "negativo" : element.negative,
    "positivo" : element.positive,
    "el odio existe" : element.hate_exist?"نعم" : "لا",
    "discurso de odio externo - toxicidad" : element.external_hate_speech_toxicity,
    "discurso de odio externo - blasfemias" : element.external_hate_speech_profanity,
    "discurso de odio externo - ataque a la identidad" : element.external_hate_speech_identity_attack,
    "discurso de odio externo - toxicidad severa" : element.external_hate_speech_severe_toxicity,
    "discurso de odio externo - amenaza" : element.external_hate_speech_threat,
    "discurso de odio externo - insulto" : element.external_hate_speech_insult,
    "discurso de odio interno - normal" : element.internal_hate_speech_normal,
    "discurso de odio interno - ofensivo" : element.internal_hate_speech_offensive,
    "discurso de odio interno - odioso" : element.internal_hate_speech_hateful,
    "discurso de odio interno - abusif" : element.internal_hate_speech_abusive,
    "el tipo de recurso" : element.ressource_type ? element.ressource_type.map(el=>this.getRessourceTypeOptions(t)[el]).join(", "):"",
    "Nome da página" : element.ressource_name_0,
    "tipo de articulo" : element.article_type?element.article_type.map(el=>this.getArticleTypeOptions(t)[el]).join(", "):"",
    "tema del artículo" :this.getPostTopicOptions(t)[element.post_topic],
    "calificación del artículo": this.getArticleRateOptions(t)[element.article_rate],
    "Promover un actor político" : element.promote_political_actor?"نعم" : "لا",
    "apuntando a un actor político" : element.targetting_political_actor?"نعم" : "لا",
    "reflexión física": element.physical_reflection?"نعم" : "لا",
    "descripción del reflejo físico": element.physical_reflection_description,
    "Actor político dirigido": element.targetted_political_actor ? element.targetted_political_actor.join(", "):"",
    "Actor político promovido": element.promoted_political_actor ? element.promoted_political_actor.join(", "):"",
    "clip de publicidad":  element.advertisement_clip?"نعم" : "لا",
    "partido objetivo": element.targetted_party,
    "la pagina pertenece a": this.getPageBelongToOptions(t)[element.page_belong_to],
    "promover la lista del partido" : element.promote_party_list?"نعم" : "لا",
    "lista de partidos promocionados" : element.promoted_party_list ? element.promoted_party_list.join(", "):"",
    "lista de grupos objetivo" : element.targetting_party_list?"نعم" : "لا",
    "lista de partes objetivo" : element.targetted_party_list?element.targetted_party_list.join(", "):""
    }
    if(element.dynamic_hate_speech){
      Object.keys(element.dynamic_hate_speech).forEach(el=>{
        objToReturn[el]=element.dynamic_hate_speech[el]
      })
    }
    if(element.dynamic_woman_presence){
      Object.keys(element.dynamic_woman_presence).forEach(el=>{
        objToReturn[el]=element.dynamic_woman_presence[el]
      })
    }

    
    return (objToReturn)
  })
    exportFromJSON({ data:translatedData, fileName : "project-" + Date.now(), exportType })  
  }  

  render() {
    const { selectedProject, type, t, isFetchingNews, newsDescription, lang, permissions, news, medias, tags, users, roles } = this.props;
    const labelType = type === "projects" ? "ARTICLES" : "NEWS";
    const { projectId } = this.props.match.params;
    const { advancedFilter, filter, sort, projectExpired, access } = this.state;
    const title = projectId ? selectedProject.title : t("TITLE_LISTE_DES_" + labelType);

    console.log("users", users)
    console.log("roles", roles)

    return (
      <Content title={title} browserTitle={t("TITLE_LISTE_DES_" + labelType)}>
        {projectExpired ? (
          <div className="prj-exp">
            <h1>{t("PROJECT_CLOSED")}</h1>
            <h5>{new Date(selectedProject.endProject).toLocaleString(lang == "ar" ? "fr" : lang)}</h5>
            <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fa-exclamation-triangle")} />
          </div>
        ) : (
          <Fragment>
            <Tabs
              dropdownMenu={
                permissions["P_CUSTOM_SEARCH"] > 0 && (
                  <CustomSearchWidget
                    searchType="NEWS"
                    initialSearch={this.initialSearch}
                    searchChanged={this.onChange}
                  />
                )
              }
              tabsActions={[
                <AddCustomSearch searchType="NEWS" search={{ advancedFilter, filter, sort }} />,
                <Button title={t("BTN_CLEAR_SEARCH")} onClick={this.resetSearch} icon="fa-undo" flat />,
                <button id="" type="button" className="btn btn-default btn-flat btn-toggle-search state-on">
                  <i className="toggle-on"></i>
                  <i className="toggle-off"></i>
                </button>,
                
                news && tags && medias && permissions["P_EXCEL"]?<Button title={t("BTN_EXPORT")} onClick={()=>this.ExportToExcel(news)} icon="fa-file-excel" flat />:null
                
              ]}
              contentHeight="232px"
              defaultActiveKey={"filter"}
            >
              <TabContent title={t("TITLE_FILTRES_&_RECHERCHE")} eventKey="filter">
                <FilterAndSearch filter={filter} onChange={this.onChangeFilter} />
              </TabContent>
              <TabContent title={t("TITLE_TRIER")} eventKey={"trier"}>
                <SortBar sort={sort} onChange={this.onChangeSort} description={newsDescription} />
              </TabContent>
              <TabContent title={t("TITLE_SIMILARITY_SEARCH")} eventKey={"similarity"}>
                <SimilaritySearchTab
                  onChangeFilter={this.onChangeFilter}
                  showClearButton={!!filter.moreLike_}
                />
              </TabContent>
              <TabContent title={t("TITLE_ADVANCED_SEARCH")} eventKey={"advanced"}>
                <AdvancedSearchBar
                  description={newsDescription}
                  filter={advancedFilter}
                  optionsFilter={this.optionsFilter}
                  onChange={this.onChangeFilter}
                />
              </TabContent>
            </Tabs>
            <div>
              <NewsList projectId={projectId} displayType={this.state.displayType} type={type} />
              <Hook callback={this.callback} isRequesting={isFetchingNews} />
            </div>
            {type === "projects" && access && <AddFakeModal projectId={projectId} fromProject={true} />}
          </Fragment>
        )}
      </Content>
    );
  }
}

ViewNews.defaultProps = {
  selectedProject: {
    forms: [],
    users: [],
    roles: [],
  },
};

function mapStateToProps(state, ownProps) {
  return {
    isFetchingNews: _.get(state, "data.isFetching.news"),
    newsDescription: state.data.newsDescription,
    selectedProject: state.data.selectedProject,
    lang: state.persistedData.lang,
    userId : state.persistedData._id,
    permissions: state.persistedData.permissions,
    news: ownProps.news || state.data.news,
    tags: state.data.tags, 
    medias : state.data.medias,
    users: state.data.users,
    roles: state.data.roles,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    describeNews: () => dispatch(News.describe()),
    getNews: (type, projectId) => dispatch(TypedNews(type, projectId).get()),
    getProject: (id) => dispatch(Projects.getOne(id, "selectedProject")),
    getMedias: () => {
      dispatch(Medias.get());
    },
    getUsers: () => dispatch(User.get()),
    getRoles: () => dispatch(Role.get()),
    filterNews: (type, { filter, page, sort = [] }) =>
      dispatch(TypedNews(type).search({ filter, sort }, { page, append: Boolean(page) })),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ViewNews));
