import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import Tabs from "components/Tabs";
import { Button, TabContent, Content, Row, Col, Box } from "adminlte-2-react";
import PropTypes from "prop-types";
import { connect } from "react-redux";
import { Feed, Tags, FeedForExcel, Monitors, Medias } from "modules/ressources";
import FilterAndSearch from "./components/FilterAndSearch";
import AddCustomSearch from "../SavedSearches/components/AddCustomSearch";
import AdvancedSearchBar from "./components/AdvancedSearchBar";
import ProjectSelector from "./components/ProjectSelector";
import ModelsSelector from "./components/ModelsSelector";
import CustomSearchWidget from "../SavedSearches/components/CustomSearchWidget";
import SortBar from "./components/SortBar";
import DisplayType from "./components/DisplayType";
import ScrappingList from "./components/ScrappingList";
import { useBottomScrollListener } from "react-bottom-scroll-listener";
import DictionariesFilter from "./components/DictionariesFilter";
import exportFromJSON from 'export-from-json';
import { excel_count } from "../../config";
import _ from "lodash";

const exportType = 'xls'


function Hook({ callback, isRequesting }) {
  useBottomScrollListener(() => {
    if (!isRequesting) callback();
  });
  return null;
}

class ListView extends Component {
  constructor(props) {
    super(props);
    let { postId } = props.match.params;
    postId = postId ? decodeURIComponent(postId) : undefined;
    this.state = {
      displayType: 6,
      models: [],
      filter: {},
      dictionariesFilter: [],
      customDictionariesFilter: [],
      advancedFilter: {
        _id: postId,
      },
      sort: [],
      page: 0,
    };
    this.onChangeFilter = this.onChangeFilter.bind(this);
    this.onChangeState = this.onChangeState.bind(this);
    this.onChange = this.onChange.bind(this);

    const { getFeed, describeFeed, getDisplayConfig } = this.props;
    this.callback = () => {
      const { filter, advancedFilter, page, sort } = this.state;
      this.setState({
        page: page + 1,
      });
      getFeed({ ...filter, ...advancedFilter }, page + 1, sort, true);
    };
    this.switchDisplay = this.switchDisplay.bind(this);

    describeFeed();
    getDisplayConfig();
    this.initialSearch = { filter: {}, advancedFilter: {}, sort: [] };
    this.resetSearch = this.resetSearch.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { getFeed, getFeedForExcel } = this.props;
    const { advancedFilter, filter, sort } = this.state;
    if (
      prevState.filter !== filter ||
      prevState.sort !== sort ||
      prevState.advancedFilter !== advancedFilter
    ) {
      this.setState({
        page: 0,
      });
      clearTimeout(this.tid);
      this.tid = setTimeout(() => {
        getFeed({ ...filter, ...advancedFilter }, 0, sort);
        getFeedForExcel({ ...filter, ...advancedFilter }, 0, excel_count, sort);
      }, 500);
    }
  }
  componentWillMount() {
    const { getFeed, getFeedForExcel, getTags, getMonitors, getMedias} = this.props;
    const { advancedFilter, filter = {}, sort = [] } = this.state;
    sort.push({ key: "created", order: "desc" });
    getFeed({ ...filter, ...advancedFilter }, 0, sort);
    getFeedForExcel({ ...filter, ...advancedFilter }, 0, excel_count, sort);
    getTags();
    getMonitors();
    getMedias();
  }

  resetSearch() {
    this.onChange(this.initialSearch);
  }
  onChange(data) {
    this.setState(data);
  }

  onChangeState(e) {
    const { name, value } = e.target;
    console.log(name, value);
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
  ExportToExcel = (data) => {  
    const {medias} = this.props;
    let newData = data.map(el=>{
      let picked =_.pick(el,["title", "text", "id", "link", "author", "categories", 
    "creatorInfo", "created", "like_count", "media", "nbre_share", "source", "subjects", 
    "lastModified", "analyse", "count_angry","count_care","count_comments","count_haha","count_love",
    "count_sad","count_wow", "likes_count", "shares", "retweet_count", "likes"])

    picked.like_count = picked.source === "twitter" ? picked.like_count: picked.source === "youtube" ? picked.likes : picked.source === "facebook" ? picked.likes_count : 0,
    picked.nbre_share = picked.source === "twitter" ? picked.retweet_count : picked.source === "facebook" ? picked.shares :0,
    picked.created = new Date(picked.created);


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

  let mediaFilter = medias.filter(t => t._id === picked.media)[0];

  picked.media = mediaFilter ? mediaFilter["name"] : picked.media;
    return (_.omit(picked,["time_taken", "sentence", "analyse"]))
  });
  console.log("old Data", data)
  let translatedData = newData.map(element=>{
    console.log("element", element)

    return ({
    "عنوان": element.title,
    "النص": element.text,
    "تاريخ الإنشاء" : element.created,
    "وسيلة الإعلام" : element.media,
    "المصدر" : element.source,
    "المؤلف" : element.author,
    "عدد الإعجابات" : element.like_count,
    "عدد إعادة النشر" : element.nbre_share,
    "عدد التعاليق" : element.count_comments,
    "عدد الحب" : element.count_love,
    "عدد الضحك" : element.count_haha,
    "عدد الغضب" : element.count_angry,
    "عدد الرعاية" : element.count_care,
    "عدد الحزينة" : element.count_sad,
    "عدد التفاجؤ" : element.count_wow,
    "عدد إعادة التغريد" : element.retweet_count,
    "سلبي" : element.negative,
    "إيجابي" : element.positive,
    "خطاب الكراهية الخارجي - السمية" : element.external_hate_speech_toxicity,
    "خطاب الكراهية الخارجي - شتم" : element.external_hate_speech_profanity,
    "خطاب الكراهية الخارجي - هجوم الهوية" : element.external_hate_speech_identity_attack,
    "خطاب الكراهية الخارجي - السمية الشديدة" : element.external_hate_speech_severe_toxicity,
    "خطاب الكراهية الخارجي - التهديد" : element.external_hate_speech_threat,
    "خطاب الكراهية الخارجي - إهانة" : element.external_hate_speech_insult,
    "خطاب الكراهية الداخلي - عادي" : element.internal_hate_speech_normal,
    "خطاب الكراهية الداخلي - مسيء" : element.internal_hate_speech_offensive,
    "خطاب كراهية داخلي - بغيض" : element.internal_hate_speech_hateful,
     "خطاب كراهية داخلي - تعسفي" : element.internal_hate_speech_abusive
  })
  }
  )
    exportFromJSON({ data:translatedData, fileName : "scraping-" + Date.now(), exportType })  
  }  
  render() {
    const {
      advancedFilter,
      models,
      filter,
      sort,
      project,
      dictionariesFilter,
      customDictionariesFilter,
    } = this.state;
    let {
      isFetching,
      t,
      feedDescription,
      feedDisplayDescription,
      customDictionaries,
      dictionaries,
      permission,
      showProjectPanel,
      permissions,
      feed,
      feedForExcel
    } = this.props;
    const isFetchingFeed = isFetching.feed;
    return (
      permission >= 1 && (
        <Content
          title={t("MESSAGE_RÉSULTAT_DU_SCRAPING")}
          browserTitle={t("MESSAGE_RÉSULTAT_DU_SCRAPING")}
        >
          {showProjectPanel && (
            <Box
              style={{ overflowY: "visible" }}
              noPadding={true}
              collapsable={true}
              collapsed={true}
              title={t("TITLE_PROJECT_SELECTION")}
            >
              <ProjectSelector selectProject={this.onChange} project={project} />
              <br />
            </Box>
          )}
          <Tabs
            dropdownMenu={
              permissions["P_CUSTOM_SEARCH"] > 0 && (
                <CustomSearchWidget
                  searchType="SCRAPPING"
                  initialSearch={this.initialSearch}
                  searchChanged={this.onChange}
                  selecProjectCustSearchesIds={project && project.customSearches}
                />
              )
            }
            tabsActions={[
              <AddCustomSearch searchType="SCRAPPING" search={{ advancedFilter, filter, sort }} />,
              <Button title={t("BTN_CLEAR_SEARCH")} icon="fa-undo" onClick={this.resetSearch} flat />,
              <button id="" type="button" className="btn btn-default btn-flat btn-toggle-search state-on">
                  <i className="toggle-on"></i>
                  <i className="toggle-off"></i>
              </button>,                
                feedForExcel && permissions["P_EXCEL"]?
                <Button title={t("BTN_EXPORT")} 
                onClick={()=>this.ExportToExcel(feedForExcel)} 
                icon="fa-file-excel" flat />:null
              ]}
            contentHeight="165px"
            defaultActiveKey={"filter"}
          >
            <TabContent title={t("TITLE_FILTRES_&_RECHERCHE")} eventKey="filter">
              <FilterAndSearch
                filter={filter}
                advancedFilter={advancedFilter}
                onChange={this.onChangeFilter}
              />
            </TabContent>
            <TabContent title={t("TITLE_TRIER")} eventKey={"trier"}>
              <SortBar sort={sort} onChange={this.onChangeState} description={feedDescription} />
            </TabContent>

            {permissions["P_MACHINE_LEARNING_MODELS"] > 0 && (
              <TabContent title={t("TITLE_ML")} eventKey={"ML"}>
                <ModelsSelector onChange={this.onChangeState} selected={models} />
              </TabContent>
            )}
            {permissions["P_DICTIONNARY"] > 0 && (
              <TabContent title={t("LABEL_DICTIONAIRES")} eventKey={"dictionaries"}>
                <DictionariesFilter
                  onChange={this.onChangeState}
                  dictionaries={dictionaries}
                  customDictionaries={customDictionaries}
                  selecProjectCustDict={project && project.customDictionaries}
                  selecProjectDict={project && project.dictionaries}
                  t={t}
                />
              </TabContent>
            )}
            <TabContent title={t("TITLE_ADVANCED_SEARCH")} eventKey={"advanced"}>
              <AdvancedSearchBar
                description={feedDescription}
                filter={advancedFilter}
                onChange={this.onChangeFilter}
              />
            </TabContent>
          </Tabs>

          <div>
            <ScrappingList
              showAddFakeNewsButton={!showProjectPanel}
              dictionariesFilter={dictionariesFilter}
              customDictionariesFilter={customDictionariesFilter}
              displayType={this.state.displayType}
              displayConfig={feedDisplayDescription}
              project={project}
              selectedModels={models}
              t={t}
              onChangeFilter={this.onChangeFilter}
            />
            <Hook callback={this.callback} isRequesting={isFetchingFeed} />
          </div>
        </Content>
      )
    );
  }
}
ListView.propTypes = {
  className: PropTypes.string,
  feed: PropTypes.array,
  customDictionaries: PropTypes.array,
  dictionaries: PropTypes.array,
  isFetching: PropTypes.object,
  showProjectPanel: PropTypes.bool,
};

ListView.defaultProps = {
  feed: [],
  isFetching: {},
  customDictionaries: [],
  dictionaries: [],
  showProjectPanel: false,
};

function mapStateToProps(state) {
  return {
    feed: state.data.feed,
    feedForExcel: state.data.feedForExcel,
    isFetching: state.data.isFetching,
    feedDescription: state.data.feedDescription,
    feedDisplayDescription: state.data.feedDisplayDescription,
    customDictionaries: state.data.customDictionaries,
    dictionaries: state.data.dictionaries,
    permissions: state.persistedData.permissions,
    tags: state.data.tags, 
    medias : state.data.medias
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getFeed: (filter, page, sort = [], append = false) =>
      dispatch(Feed.search({ filter, sort }, { page, append })),
    getFeedForExcel : (filter, page, size, sort = [], append = false) =>
      dispatch(FeedForExcel.search({ filter, sort }, { page, append, size })),
    describeFeed: () => dispatch(Feed.describe()),
    getDisplayConfig: () => dispatch(Feed.getDisplayConfig()),
    getMonitors: () => dispatch(Monitors.get()),
    getTags: () => dispatch(Tags.get()),
    getMedias: () => {
      dispatch(Medias.get());
    },
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(ListView));
