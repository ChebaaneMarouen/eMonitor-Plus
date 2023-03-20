const {Model, Schema} = require("@localPackages/model");
const rp = require("request-promise");
const { customDictionariesApi, hateApi, sentimentApi } = require("../config");
const crudService = require("../services/crudService");
const Project = require("./Project");
const projectsCrud = crudService({Project})("Project");

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
    return Promise.all([predictSentiment(text), searchOccurence(text), predictHateSpeech(text)])
        .then(data=> {
          return {sentiment : data[0],custom_dictionary : data[1],hate_speech : data[2]}
        }).catch((err) => {
              console.log(err)
              return {}
        });
  } catch (error) {
    console.log(error)
  }
 
}

const checkSentiment = (response) =>{
  let sentiment = "neutre";
  if( 1 - Number(response["positive"]) < 0.2){
      sentiment = "positive"
  }

  if(1 - Number(response["negative"]) < 0.2 ){
      sentiment = "negative"
  }
  return sentiment
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
module.exports = (function() {
  const schema = new Schema({});

  schema.pre("save", async function(next) {
      try {
        const news = this;
        const date = Date.now();

      if (!news.firstCrawlTime) {
        news.firstCrawlTime = date;
      }
      if(!news.created){
        news.created = date;
      }
      news.updatedTime = date;
      next();
      // let text = news.text || news.Text || news.description || news.title;
     /* const projects = await getProjects();
      let test = false;
  
      for (let i = 0; i < projects.length; i++) {
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
      console.log("test \t", test)
      if(test){    
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
      }
      setTimeout(async () => {
        try {
          let res = await rp({
          uri : "http://test.botv.io:8080/predict",
          method : "GET",
          qs : {
            sentence : text
          }
        })
        let data = JSON.parse(res);
        let sentiment = checkSentiment(data["response"]);
        news.sentiment = sentiment;
        console.log("prediction", sentiment)
        } catch (error) {
          console.log("prediction error 2")
        }
      }, 5000);*/
    
      } catch (error) {
        console.log(error)
      }

    });

  return new Model("feed", schema, "elasticsearch");
})();
