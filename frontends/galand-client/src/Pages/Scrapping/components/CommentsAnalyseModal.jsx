import React, { useState, useEffect } from "react";
import MyModal from "@shared/Components/MyModal";
import { Button, Tabs, TabContent } from "adminlte-2-react";
import { Bar } from 'react-chartjs-2';
import {
    Chart as ChartJS,
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend,
  } from 'chart.js';
import SadFace from "../../../assests/sad-sad-face.gif";
import HappyFace from "../../../assests/swirling-happy-face.gif";
import NeutralFace from "../../../assests/pgsr-emoji-iphone-meu.gif";
import axios from "axios";
import {apiEndpoint} from "../../../config";
import Spinner from "components/Spinner/Spinner";

ChartJS.register(
    CategoryScale,
    LinearScale,
    BarElement,
    Title,
    Tooltip,
    Legend
  );

export default function CommentsAnalyse({ text, label, item, comment, t }) {
    const [modalState, setModalState] = useState(false);
    const [analyse, setAnalyse] = useState({});
    const [feed, setFeed] = useState(item);
    const [commentData, setCommentData] = useState(comment);

    useEffect(() => {
        setCommentData(comment);
        setFeed(item)
      }, [comment, item]);

   const analyseText = (data) => {
       console.log("this is data",feed)
       if (!modalState && data && !feed.analysed) {
        axios({
            url : apiEndpoint + "comment-analyse",
            method :"POST",
            data : {
                text : data,
                feed,
            },
            timeout : 0
        }).then(res=>{
            console.log("this is data 2", res.data)
            setAnalyse(res.data);
            setFeed({...feed, analyse : res.data, analysed : true})
        })
        .catch(err=>{
            setAnalyse({sentiment : "error"});
        })
       }else{
        setAnalyse(feed.analyse)
       }
   
    };
    const analyseComment = (data) => {
        if (!modalState && data && !commentData.analysed) {
         axios({
             url : apiEndpoint + "comment-analyse",
             method :"POST",
             data : {
                 text : data,
                 feed,
                 comment : commentData
                },
             timeout : 0
         }).then(res=>{
             setAnalyse(res.data)
             setCommentData({...commentData, analyse : res.data, analysed : true})
         })
         .catch(err=>{
             setAnalyse({sentiment : "error"});
         })
        }else{
            setAnalyse(commentData.analyse)
        }
    
     };
     const analyseSentiment = (analyse) =>{
        let sentiment = {sent : "neut", per : 50};
         if (analyse["sentiment"]) {
             if((1 - analyse["sentiment"]["positive"]) < 0.2 ){
                sentiment = {sent : "pos", per : Math.trunc(analyse["sentiment"]["positive"] * 100)}
             }else{
                 if((1 - analyse["sentiment"]["negative"]) < 0.2 ){
                sentiment = {sent : "neg", per : Math.trunc(analyse["sentiment"]["negative"] * 100)}
                }else{
                    sentiment = {sent : "neut", per : Math.trunc(analyse["sentiment"]["positive"] * 100)}
                }
            }
             
            
         }
         return sentiment
     }
    
    const dictionaryOptions = {
        responsive: true,
          title: {
            display: false,
            text: t("LABEL_CUSTOM_DICTIONAIRES"),
          },
        };

    const hateOptions = {
        responsive: true,
            title: {
            display: false,
            text: t("TITLE_HATE_SPEECH"),
            },
        };
    
    const dictionaryLabels = analyse && analyse["custom_dictionary"]? Object.keys(analyse["custom_dictionary"]) : [];
    const hateLabels = analyse && analyse["hate_speech"]?[t("LABEL_INSULT"), t("LABEL_SEVERE_TOXICITY"), t("LABEL_TOXICITY"), t("LABEL_THREAT"), t("LABEL_IDENTITY_ATTACK"), t("LABEL_PROFANITY")] : [];
    const internalHateLabels = analyse && analyse["hate_speech"]?[t("LABEL_NORMAL"),t("LABEL_OFFENSIVE"), t("LABEL_ABUSIVE"), t("LABEL_HATEFUL")] : [];
    const detoxifyLabels = analyse && analyse["detoxify"]?[t("LABEL_INSULT"), t("LABEL_SEVERE_TOXICITY"), t("LABEL_TOXICITY"), t("LABEL_THREAT"), t("LABEL_IDENTITY_ATTACK"), t("LABEL_OBSCENE"), t("LABEL_SEXUAL_EXPLICIT")] : [];


    let hateBackground = [];
    let internalHateBackground = [];
    let detoxifyBackground = [];
    let dataHate = analyse && analyse["hate_speech"]? 
    [analyse["hate_speech"]["insult"],analyse["hate_speech"]["severe_toxicity"],analyse["hate_speech"]["toxicity"],analyse["hate_speech"]["threat"],analyse["hate_speech"]["identity_attack"],analyse["hate_speech"]["profanity"]] : [];
    let internalDataHate = analyse && analyse["hate_speech"]? 
    [analyse["hate_speech"]["normal_model"],analyse["hate_speech"]["offensive_model"],analyse["hate_speech"]["abusive_model"],analyse["hate_speech"]["hateful_model"]] : [];
    let detoxifyDataHate =analyse && analyse["detoxify"]? 
    [analyse["detoxify"]["insult"],analyse["detoxify"]["severe_toxicity"],analyse["detoxify"]["toxicity"],analyse["detoxify"]["threat"],analyse["detoxify"]["identity_attack"],analyse["detoxify"]["obscene"],analyse["detoxify"]["sexual_explicit"]] : [];
    for (let index = 0; index < hateLabels.length; index++) {
        if(dataHate[index] >= 0.5){
            hateBackground.push('#ba2227')
        } else{
            hateBackground.push('#4b6043')
        };
        
    }
    for (let index = 0; index < internalHateLabels.length; index++) {
        if(internalDataHate[index] >= 0.5){
            internalHateBackground.push('#ba2227')
        } else{
            internalHateBackground.push('#4b6043')
        };
        
    }
    for (let index = 0; index < detoxifyLabels.length; index++) {
        if(detoxifyDataHate[index] >= 0.5){
            detoxifyBackground.push('#ba2227')
        } else{
            detoxifyBackground.push('#4b6043')
        };
        
    }
    const dictionaryData = {
        labels:dictionaryLabels,
        datasets: [
          {
            label :t("LABEL_CUSTOM_DICTIONAIRES"),
            data: analyse && analyse["custom_dictionary"]? Object.values(analyse["custom_dictionary"]) : [],
            backgroundColor: '#ba2227',
          }
        ],
      };
    const hateData = {
        labels:hateLabels,
        datasets: [
          {
            label :t("TITLE_HATE_SPEECH") + " %",
            data: dataHate.map(el=>el*100),
            backgroundColor: hateBackground,
          }
        ],
      };
      const internalHateData = {
        labels:internalHateLabels,
        datasets: [
          {
            label :t("TITLE_HATE_SPEECH")+ " %",
            data: internalDataHate.map(el=>el*100),
            backgroundColor: internalHateBackground,
          }
        ],
      };
      const detoxifyData = {
        labels:detoxifyLabels,
        datasets: [
          {
            label :t("TITLE_HATE_SPEECH")+ " %",
            data: detoxifyDataHate.map(el=>el*100) ,
            backgroundColor: detoxifyBackground,
          }
        ],
      };
    return (
        <div onClick={()=>label === t("TEXT_ANALYSER") ? analyseText(text) : analyseComment(text)}>
            {text && text.length != 0 && (
                <MyModal
                    hideSubmit={true}
                    block
                    title={t("TEXT_ANALYSER")}
                    size={"lg"}
                    onToggle={setModalState}
                    button={
                        <Button
                            size={"xs"}
                            icon={"fa-chart-bar"}
                            pullRight={true}
                            type="danger"
                            text={label}
                        />
                    }
                >

                <Tabs
                defaultActiveKey={t("EXTERNAL_ANALYSER")}
                >
                    <TabContent
                    eventKey={t("EXTERNAL_ANALYSER")}
                    title={t("EXTERNAL_ANALYSER")}
                    style={{marginTop:"15px"}}
                    >
                    {modalState ?
                    analyse && analyse["sentiment"] ?
                    <div style={{ minHeight: "500px !important"}}>
                            <h4>
                               <b className="underlined"> {t("LABEL_SENTENCE")}</b> :
                            </h4> 
                            <p className="padd-5">{text } </p>
                                <div className="row">
                                    <div className="col-sm-2">
                                            <h4 className="text-center"><b>{t("LABEL_SENTIMENT")}</b></h4>
                                            <div className="text-center">
                                                {
                                                analyseSentiment(analyse).sent === "pos" ?
                                                    <>
                                                        <img src={HappyFace} width={"60px"} className="img-responsive" alt="positive"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4>
                                                    </>
                                                : analyseSentiment(analyse).sent === "neg" ?
                                                    <>
                                                        <img src={SadFace} width={"60px"} className="img-responsive" alt="negative"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4>
                                                    </>
                                                :
                                                    <>
                                                        <img src={NeutralFace} width={"60px"} className="img-responsive" alt="neutral"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4> 
                                                    </>
                                                }
                                            </div>
                                           
                                    </div>
                                    <div className="col-sm-5">
                                    {analyse && analyse["custom_dictionary"] ?
                                    <Bar options={dictionaryOptions} data={dictionaryData} />
                                    :
                                    null}

                                    </div>
                                    <div className="col-sm-5">
                                    {analyse && analyse["hate_speech"] ?
                                    <Bar options={hateOptions} data={hateData} />
                                    :
                                    null}

                                    </div>
                                </div>                            
                    </div>:
                    <Spinner/>:
                    null
                    }
                    </TabContent>
                    <TabContent
                    eventKey={t("INTERNAL_ANALYSER")}
                    title={t("INTERNAL_ANALYSER")}
                    >
{modalState ?
                    analyse && analyse["sentiment"] ?
                    <div style={{ minHeight: "500px !important"}}>
                            <h4>
                               <b className="underlined"> {t("LABEL_SENTENCE")}</b> :
                            </h4> 
                            <p className="padd-5">{text } </p>
                                <div className="row">
                                    <div className="col-sm-2">
                                            <h4 className="text-center"><b>{t("LABEL_SENTIMENT")}</b></h4>
                                            <div className="text-center">
                                                {
                                                analyseSentiment(analyse).sent === "pos" ?
                                                    <>
                                                        <img src={HappyFace} width={"60px"} className="img-responsive" alt="positive"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4>
                                                    </>
                                                : analyseSentiment(analyse).sent === "neg" ?
                                                    <>
                                                        <img src={SadFace} width={"60px"} className="img-responsive" alt="negative"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4>
                                                    </>
                                                :
                                                    <>
                                                        <img src={NeutralFace} width={"60px"} className="img-responsive" alt="neutral"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4> 
                                                    </>
                                                }
                                            </div>
                                           
                                    </div>
                                    <div className="col-sm-5">
                                    {analyse && analyse["custom_dictionary"] ?
                                    <Bar options={dictionaryOptions} data={dictionaryData} />
                                    :
                                    null}

                                    </div>
                                    <div className="col-sm-5">
                                    {analyse && analyse["hate_speech"] ?
                                    <Bar options={hateOptions} data={internalHateData} />
                                    :
                                    null}

                                    </div>
                                </div>                            
                    </div>:
                    <Spinner/>:
                    null
                    }

                    </TabContent>

                    <TabContent
                    eventKey={t("DETOXIFY_ANALYSER")}
                    title={t("DETOXIFY_ANALYSER")}
                    >
{modalState ?
                    analyse && analyse["sentiment"] ?
                    <div style={{ minHeight: "500px !important"}}>
                            <h4>
                               <b className="underlined"> {t("LABEL_SENTENCE")}</b> :
                            </h4> 
                            <p className="padd-5">{text } </p>
                                <div className="row">
                                    <div className="col-sm-2">
                                            <h4 className="text-center"><b>{t("LABEL_SENTIMENT")}</b></h4>
                                            <div className="text-center">
                                                {
                                                analyseSentiment(analyse).sent === "pos" ?
                                                    <>
                                                        <img src={HappyFace} width={"60px"} className="img-responsive" alt="positive"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4>
                                                    </>
                                                : analyseSentiment(analyse).sent === "neg" ?
                                                    <>
                                                        <img src={SadFace} width={"60px"} className="img-responsive" alt="negative"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4>
                                                    </>
                                                :
                                                    <>
                                                        <img src={NeutralFace} width={"60px"} className="img-responsive" alt="neutral"/>
                                                        <h4 className="margin-t-10 text-bold">{analyseSentiment(analyse).per}%</h4> 
                                                    </>
                                                }
                                            </div>
                                           
                                    </div>
                                    <div className="col-sm-5">
                                    {analyse && analyse["custom_dictionary"] ?
                                    <Bar options={dictionaryOptions} data={dictionaryData} />
                                    :
                                    null}

                                    </div>
                                    <div className="col-sm-5">
                                    {analyse && analyse["detoxify"] ?
                                    <Bar options={hateOptions} data={detoxifyData} />
                                    :
                                    null}

                                    </div>
                                </div>                            
                    </div>:
                    <Spinner/>:
                    null
                    }

                    </TabContent>
                </Tabs>
                </MyModal>
            )}
        </div>
    );
}
