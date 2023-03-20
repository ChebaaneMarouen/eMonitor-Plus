const crudService = require("../services/crudService");
const rp = require("request-promise");
const { customDictionariesApi, hateApi, sentimentApi, ducklingApi, detoxifyApi } = require("../config");
const Project = require("../models/Project");
const projectsCrud = crudService({Project})("Project");
const _ = require("lodash");
const eventServices = require("../services/eventServices");
const {Feed, RawData} = require("../models");
const parser = require("../modules/parser");
const feedCrud = crudService({Feed})("Feed");

exports.parse = parse;

const predictSentiment = (text) =>{
  return  rp(
      {
        uri: sentimentApi,
        qs : {
          sentence : text
        },
        method: "GET",
      }
    )
    .then(result=>{
        let dataParsed = JSON.parse(result);
        console.log('result prediction', dataParsed["response"]);
        return dataParsed["response"]
    })
    .catch(err=> {
      console.log(err)
      return {}
    })
}

const predictDetoxify = (text) =>{
  return  rp(
      {
        uri: detoxifyApi,
        qs : {
          sentence : text
        },
        method: "GET",
      }
    )
    .then(result=>{
        let dataParsed = JSON.parse(result);
        let prediction = dataParsed["response"]["result"];
        Object.keys(prediction).forEach(el=> prediction[el] = prediction[el][0]);
        console.log('result detoxify', JSON.stringify(prediction, null, 4));
        return prediction
        
    })
    .catch(err=> {
      console.log(err)
      return {}
    })
}

const searchOccurence = (text) =>{
  return rp(
      {
        uri: customDictionariesApi,
        json: true,
        body : {text},
        method: "POST",
      }
    )
    .then(result=>{
        console.log('result prediction', result);
        return result
    })
    .catch(err=> {
      console.log(err)
      return {}
    })
}

const predictHateSpeech = (text) =>{
  return  rp(
      {
        uri: hateApi,
        qs : {
          sentence : text
        },
        method: "GET",
      }
    )
    .then(result=>{
        let dataParsed = JSON.parse(result);
        console.log('result hate speech', dataParsed);
        return dataParsed
    })
    .catch(err=> {
      console.log(err)
      return {}
    })
}

const analyse = async (text) => {
  try {
    return Promise.all([predictSentiment(text), searchOccurence(text), predictHateSpeech(text), predictDetoxify(text)])
        .then(data=> {
          return {sentiment : data[0],custom_dictionary : data[1],hate_speech : data[2], detoxify : data[3]}
        }).catch((err) => {
              console.log(err)
              return {}
        });
  } catch (error) {
    console.log(error)
  }
 
}
getNowParams = () =>{
  return new Date().toISOString().replace(/:/g, '').replace(/-/g,"").split(".").shift()
}
const formatApiDuckling = (date) => encodeURI(ducklingApi + getNowParams() + "/-60/" + date.replace(/\D/g,'-'));

const ducklingDate = (date, locale) =>{

  return rp({
    url: ducklingApi + "/parse",
    method: "POST",
    form: {
      locale,
      text: date,
      dims : ["time", "duration"]
    },
    json: true
  }).then(body=>{
    return body
  }).catch(error=>{
    console.log(error);
    return {}
  })
}

const getProjects = async () => {
  try {
    const records = await projectsCrud.getRecords({})
    return records
  } catch (error) {
    console.log("message",error.message);
    return []
  }
}

function createFeed(parser) {
  function delay(ms) {
    return new Promise(resolve => setTimeout(resolve, ms));
  }
  return (data) =>
      delay(3000)
      .then(()=>parser(data)
      .then(async (parsedData) => {
                  let news = parsedData;
                  
                  if (parsedData) {
                    console.log("==========================\n========================\n\nnews\n", news)
                  let text = news.text || news.Text || news.description || news.title;

                  // const projects = await getProjects();
                  // let test = false;
                  /*for (let i = 0; i < projects.length; i++) {
                    const media = projects[i]["media"]
                    const endProject = projects[i].endProject;
                    if(Date.now() < endProject){
                      for (let j = 0; j < media.length; j++) {
                        console.log(news.media, "===", media[j])
                        if(news.media === media[j]){
                          test = true
                        }        
                       }  
                    }    
                  }
                  console.log("test \t", test)*/
                    // if(test){    
                      let analyseText = await analyse(text);
                      news.analyse = analyseText;
                      news.analysed  = true;
                      let comments = news.comments ? news.comments.data : [];
                      for (let i = 0; i < comments.length; i++) {
                        let analyseComment = await analyse(comments[i].comment);
                        if(analyseComment.sentiment){
                          comments[i].analyse = analyseComment;
                          comments[i].analysed = true;
                        }          
                      }
                      news.comments = {data : comments};
                  // }
                  if(news.source === "website"){
                    let language = analyseText.hate_speech.language_model;
                    let locale = language === "ar" ? "ar_LB" : language === "fr" ? "fr_FR" : "en_US";
                    let result = await ducklingDate(news.created, locale);

                    let dims = result[0] ? result[0]["dim"] : "time";
                    let created;

                    if( dims === "time"){
                      created = result[0] ? new Date(result[0]["value"]["value"]).getTime() : Date.now();
                    }

                    if(dims === "duration"){
                      created = result[0] ? Date.now() - result[0]["value"]["normalized"]["value"] * 1000 : Date.now();
                    }

                    if (created > Date.now()){
                      created = Date.now()
                    }
                    
                    console.log("==========================\n",
                    "========================\n\ncreated\n", created)

                    news.created = created;
                  }
                    feedCrud
                        .createNew(news)
                        .then((data) => {
                          console.log("INSERTED", data);
                          eventServices.create("feedAdded", data);
                        })
                        .catch(console.error);
                  }
                })
                .catch(console.error)
      )
      
    // give time for elasticsearch to index data
}
async function parse(msg) {
  const scrappedData = JSON.parse(msg.content);
  if (_.isEmpty(scrappedData)) return console.log("WARN empty data");
  switch (scrappedData.source) {
    case "website":
      RawData(scrappedData.source)
          .save(scrappedData)
          .then(createFeed(parser.parseSite))
          .catch((err) => console.error(err));
      break;
    default:
      console.log("PARSING ", scrappedData.source);
      console.log(scrappedData.text);
      RawData(scrappedData.source)
          .save({...scrappedData, _id: scrappedData.id})
          .then(createFeed((data) => parser.parse(scrappedData.source, data)))
          .catch(console.error);
      break;
  }
}