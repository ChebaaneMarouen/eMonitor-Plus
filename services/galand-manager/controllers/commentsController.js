const rp = require('request-promise');
const {sentimentApi , customDictionariesApi, hateApi, detoxifyApi} = require('../config');
const { crudService } = require("../services");

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
          return dataParsed
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
        return dataParsed
    })
    .catch(err=> {
      console.log(err)
      return {}
    })
}

const analyseDetoxify = async (req, res, next) =>{
  try {
    const text = req.body.text;
    const result = await predictDetoxify(text);
    console.log("result", result)
    res.status(200).json({result})
  } catch (error) {
    console.log(error);
    res.status(500).json({
      error
    })
  }
}

const analyseComment = (req, res, next) =>{
    const text = req.body.text;
    let {feed, comment} = req.body;
    const feedCrud = crudService("Feed");
    if(!comment){
      if (feed.analysed) {
        return res.status(200).json({
          ...feed.analyse
        })
      }
      return Promise.all([predictSentiment(text), searchOccurence(text), predictHateSpeech(text)])
      .then(data=>{
        feedCrud
          .addRecord({...feed, analyse : {
            sentiment : data[0], 
            custom_dictionary : data[1], 
            hate_speech : data[2]
          },
          analysed : true
        })
          .then((feed) => console.log("feed changed\t"))
          .catch((err) => {
            console.log(err)
          });
        res.status(200).json({
          sentiment : data[0], 
          custom_dictionary : data[1], 
          hate_speech : data[2]
      })
      }
      )
      .catch(err=> res.status(200).json({
        sentiment : "an error has been occured", 
        custom_dictionary : "an error has been occured", 
        hate_speech : "an error has been occured"
    }))
    }else{
    return Promise.all([predictSentiment(text), searchOccurence(text), predictHateSpeech(text)])
    .then(data=>{
    let comments = feed.comments.data;
    for (let i = 0; i < comments.length; i++) {
      if(JSON.stringify(comments[i]) === JSON.stringify(comment)){
          comments[i] = {...comment,  analysed : true, analyse : {
            sentiment : data[0], 
            custom_dictionary : data[1], 
            hate_speech : data[2]
          }}
      }
    }

    feedCrud
    .addRecord({...feed, comments : {data : comments}})
    .then((feedChanged) => console.log("feed changed\t"))
    .catch((err) => {
      console.log(err)
    });
      res.status(200).json({
        sentiment : data[0], 
        custom_dictionary : data[1], 
        hate_speech : data[2]
    })
    }
    )
    .catch(err=> res.status(200).json({
      sentiment : "an error has been occured", 
      custom_dictionary : "an error has been occured", 
      hate_speech : "an error has been occured"
  }))
    }
   
}
module.exports={
    analyseComment,
    analyseDetoxify
}