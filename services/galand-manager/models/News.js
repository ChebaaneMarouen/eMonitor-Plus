const _ = require("lodash");
const {Model, Schema} = require("@localPackages/model");
const validation = require("../modules/validationHelpers");
const {getImageUrl} = require("../modules/getImageOfSite");
const newsTypesEnum = {
  PRESS: 0,
  TERRAIN: 1,
};
const statusEnum = {
  AFFECTATION: 0,
  VERIFICATION: 1,
  VALIDATION: 2,
  PUBLICATION: 3,
  ARCHIVED: 4,
  NON_APPROUVER: 5,
};

function DefaultToArray(val) {
  
  if (val) {
    return val;
  } else {
    return [];
  }
}
function TrimString(val) {
  if (!val) return String();
  return String(val).trim();
}
function MyDate(val) {
  if (!val) return null;
  return new Date(val);
}

module.exports = (function() {
  const NewsSchema = new Schema({
    title: {type: TrimString, required: "MESSAGE_VEUILLEZ_REMPLIR_LE_TITRE"},
    link: {type: String, mapping: "keyword"},
    coverImage: String,
    newsType: {
      type: Number,
    },
    subjects: [{type: String}],
    categories: [{type: String}],
    actor:String,
    constituency:String,
    reliability: {
      type: Number,
      mapping: "keyword",
    },
    additionalLinks: [{type: String}],
    videoUrl: {type: String},
    text: String,
    userCoverImage: DefaultToArray,
    infraction: {
      status: Number,
      infractionType: String,
      comment: String,
      link: String,
      files: [
        {
          serverId: {type: String, required: true},
          filename: {type: String, required: true},
          fileType: {type: String, required: true},
          fileSize: {type: Number, required: true},
        },
      ],
      responsible: String,
      responsibleType : String,
      confirmComment: String,
      proof_link : String, 
      adaptation : String, 
      text_infraction : String,
      page_id : String,
      monitor : String,
      candidate : String,
      candidate_type : String,
      irie : String,
      irie_text : String,
      infraction_date : {
        type: String
      },
      createdAt : {
        type: Number,
        mapping: "date",
      }
    },
    communication: {
      decision: Number,
      text: String,
      links: [String],
    },
    impact: {
      type: Number,
    },
    priority: {
      type: Number,
    },
    monitor: {
      type: String,
      mapping: "keyword",
    },
    dueDate: {
      type: MyDate,
    },
    lastModified: {
      type: Number,
      mapping: "date",
    },
    created: {
      type: Number,
      mapping: "date",
    },
    creator: {
      type: String,
    },
    creatorInfo: {},
    status: {
      type: Number,
    },
    files: [
      {
        serverId: {type: String, required: true},
        filename: {type: String, required: true},
        fileType: {type: String, required: true},
        fileSize: {type: Number, required: true},
      },
    ],
    originalArticle: {
      type: String,
      mapping: "keyword",
    },
    projectId: {
      type: String,
      mapping: "keyword",
    },
    form: {},
    media: {
      type: String,
      mapping: "keyword",
    },
    actionPlan: [
      {
        status: Number,
        additionalInfo: String,
        importance: Number,
        status: Number,
        title: String,
      },
    ],
    comments: DefaultToArray,
    videoTrackComments: DefaultToArray,
    monitor: {
      type: String,
      mapping: "keyword",
    },
    // this field will contain value for relavency of the search
    _score: {
      type: Number,
    },
    hate_speech :{},
    woman_presence : {},
    monitor_social_media :{},
    fakeNews : {
      type : Boolean,
      default : false
    },
    analyse : {},
    like_count : {
      type: Number
    },
    count_comments : {
      type: Number
    },
    like_count : {
      type: Number
    },
    nbre_share: {
      type: Number
    },
    reactions : {},
    data_comments : {},
    firstCrawlTime : {
      type: Number,
      mapping: "date",
    },
    author : {
      type: String,
      mapping: "keyword",
    },
    source : {
      type: String,
      mapping: "keyword",
    }
  });

  NewsSchema.pre("save", function(next) {
    const news = this;
    if (!news.status) {
      // if monitor is defined than the status is set to waiting vérification
      news.status = news.monitor ? 1 : 0;
    }
    next();
  });

  NewsSchema.pre("save", function(next) {
    const news = this;
    if (!news.status) {
      // if project is defined than the status is set to waiting vérification
      news.status = news.projectId ? 1 : 0;
    }
    next();
  });

  NewsSchema.pre("save", function(next) {
    const news = this;
    if (!news.created) {
      news.created = Date.now();
    }
    news.lastModified = Date.now();
    next();
  });

  NewsSchema.pre("save", function(next) {
    const news = this;
    if (!news.link || !news._isModified("link")) return next();
    getImageUrl(news.link).then((imageUrl) => {
      news.coverImage = imageUrl;
      next();
    })
  });

  NewsSchema.validations = [
    function mustContainSubjects(news) {
      if (!news.subjects || !news.subjects.length) {
        throw new Error("MESSAGE_VEUILLEZ_CHOISIR_LE_SUJET_ADEQUAT");
      }
    },
    function mustContainCategories(news) {
      if (!news.categories || !news.categories.length) {
        throw new Error("MESSAGE_VEUILLEZ_CHOISIR_LE_CATEGORY_ADEQUAT");
      }
    },
    function linkMustBeLink(news) {
      if (news.newsType === newsTypesEnum.PRESS) {
        if (!news.link) {
          throw new Error("MESSAGE_LINK_MUST_BE_PROVIDED_FOR_ONLINE_NEWS");
        }
        if (!validation.isUrl(news.link)) {
          console.log(news.link);
          throw new Error("MESSAGE_NEWS_LINK_MUST_BE_VALID");
        }
      }
    },
    function addedLinksMustBeValidLinks(news) {
      if (news.additionalLinks) {
        const linksAreValid = news.additionalLinks.every(
            (link) => !link || validation.isUrl(link)
        );
        if (!linksAreValid) {
          throw new Error(
              "MESSAGE_ADDITIONAL_LINKS_CONTAIN_ONE_OR_MORE_invalid_LINKS"
          );
        }
      }

      if (news.videoUrl) {
        const videoLinkIsValid = validation.isUrl(news.videoUrl);
        if (!videoLinkIsValid) {
          throw new Error("MESSAGE_VIDEO_LINK_IS_INVALID");
        }
      }
    },
    function canNotPublishWithoutCommunication(news) {
      if (news.status === statusEnum.ARCHIVED) {
        if (!news.communication || !news.communication.text) {
          throw new Error("MESSAGE_CAN_NOT_PUBLICH_NEWS_WITHOUT_A_STATEMENT");
        }
      }
    },
    function communicationMustContainValidEmails(news) {
      if (news.status === statusEnum.ARCHIVED) {
        const linksAreValid = _.get(news, "communication.links", []).every(
            (link) => !link || validation.isUrl(link)
        );
        if (!linksAreValid) {
          throw new Error(
              "MESSAGE_THE_STATEMENT_ADDITIONAL_LINKS_CONTAIN_ONE_OR_MORE_invalid_LINKS"
          );
        }
      }
    },
    function actionPlansAttributesAreRequired(news) {
      if (news.actionPlan) {
        ["additionalInfo", "title", "importance"].forEach((key) => {
          news.actionPlan.forEach((action) => {
            if (action[key] !== 0 && !action[key]) {
              throw new Error("MESSAGE_ACTION_PLAN_IS_MISSING_ATTRIBUTES");
            }
          });
        });
      }
    },
  ];

  const model = new Model("news", NewsSchema, "elasticsearch");
  model.statusEnum = statusEnum;
  model.infractionEnum = {
    NO_INFRACTION: 0,
    INFRACTION_A_VALIDER: 1,
    INFRACTION_VALIDE: 2,
  };
  return model;
})();
