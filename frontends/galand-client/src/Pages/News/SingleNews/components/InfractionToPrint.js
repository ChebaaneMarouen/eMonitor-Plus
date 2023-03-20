import React, { useRef, useEffect, useState } from "react";
import ReactToPrint from "react-to-print";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import "./print.css";
import { useDispatch, useSelector } from "react-redux";
import { Tags} from "modules/ressources";
import html2pdf from "html2pdf.js";
import { renderToString } from 'react-dom/server';
import { apiEndpoint } from "config";


export default function InfractionToPrint({ news, t, linkStyle, users, roles }) {
  const refContainer = useRef();
  const dispatch = useDispatch();
  const lang = useSelector((state) => state.persistedData.lang);


  console.log("userssss", users, roles)

  let user = users ?users.filter(el=>el._id === news.creatorInfo._id):[];
  let role = [];
  if(user[0]){
    role = roles.filter(el=>el._id === user[0].role);
  }
  
  let roleName;
  if(role[0]){
    roleName = role[0].name;
  }

  const MyDocument = () =>{
   /*const Tag = ({ tag, className }) => {
    const targetTag = tags.filter(t => t._id === tag)[0];
    if (!targetTag) return null;
    return (
      <span
        className={"label margin-r-5 " + className}
        style={{ backgroundColor: targetTag.color }}
      >
        {targetTag.label}
      </span>
      )
   };*/
    return <div ref={refContainer} className="inf-to-print" id="divToPrint">
      {lang == "ar" ?
        <div style={{width: "95%", textAlign:"right !important"}}>
          <h2 className="text-center"><b>{news.title}</b></h2>
          {/* <h4><b>: {t("LABEL_MONITOR_NAME")}</b></h4>
          <p>
            {news.creatorInfo.fName + " " + news.creatorInfo.lName}
          </p> */}

          <h4><b>: {t("LABEL_TEAM")}</b></h4>
          <p>
            {roleName}
          </p>
          {/* <h4><b>: {t("LABEL_SUBJECTS")}</b></h4>
          <p>
            {news.subjects.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </p> */}
          <h4><b>: {t("LABEL_DESCRIPTION_INFRACTION")}</b></h4>
          <p>
            {news.infraction.comment}
          </p>
          <h4><b>: {t("LABEL_RESPONSIBLE_PART")}</b></h4>
          <p>
            {news.infraction.responsible}
          </p>
          <h4><b>: {t("LABEL_RESPONSIBLE_TYPE")}</b></h4>
          <p>
            {news.infraction.responsibleType}
          </p>
          <h4><b>: {t("LABEL_TYPE_INFRACTION")}</b></h4>
          <p>
            {news.infraction.infractionType}
          </p>
          <h4><b>: {t("LABEL_TEXT_INFRACTION")}</b></h4>
          <p>
            {news.infraction.text_infraction}
          </p>
          <h4><b>: {t("LABEL_INFRACTION_DATE")}</b></h4>
          <p>
            {news.infraction.infraction_date}
          </p>
          <h4><b>: {t("LABEL_CREATION_DATE")}</b></h4>
          <p>
            {news.infraction.createdAt? new Date(news.infraction.createdAt).toISOString().slice(0,10) : ""}
          </p>
          <h4><b>: {t("LABEL_PAGE_ID")}</b></h4>
          <p>
            {news.infraction.page_id}
          </p>
          <h4><b>: {t("LABEL_PREUVES")}</b></h4>
          <p></p>
          <h4><b>: {t("LABEL_PROOF_LINK")}</b></h4>
          <p>
            {news.infraction.proof_link}
          </p>
          <h4><b>: {t("LABEL_PREUVES")}</b></h4>
          <p>
          {news.infraction.files.map((file)=>
            <div>
              <a href={apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}>
                {apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}
              </a>
            </div>
          )} 
          </p>
          <div>
          {news.infraction.files.map((file)=>
            <div>
              <div  className="html2pdf__page-break" ></div>
              <img src={apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId} alt="preuve"/>
            </div>
          )}
          </div>
        </div>
        :
        <div style={{width: "95%" }}>
          <h2 className="text-center"><b>{news.title}</b></h2>
          {/* <h4><b>{t("LABEL_MONITOR_NAME")} :</b></h4>
          <p>
            {news.creatorInfo.fName + " " + news.creatorInfo.lName}
          </p> */}
          <h4><b>{t("LABEL_TEAM")} :</b></h4>
          <p>
            {roleName}
          </p>
          {/* <h4><b>{t("LABEL_SUBJECTS")} :</b></h4>
          <p>
            {news.subjects.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </p> */}
          <h4><b>{t("LABEL_DESCRIPTION_INFRACTION")} :</b></h4>
          <p>
            {news.infraction.comment}
          </p>
          <h4><b>{t("LABEL_RESPONSIBLE_PART")} :</b></h4>
          <p>
            {news.infraction.responsible}
          </p>
          <h4><b>{t("LABEL_RESPONSIBLE_TYPE")} :</b></h4>
          <p>
            {news.infraction.responsibleType}
          </p>
          <h4><b>{t("LABEL_TYPE_INFRACTION")} :</b></h4>
          <p>
            {news.infraction.infractionType}
          </p>
          <h4><b>{t("LABEL_TEXT_INFRACTION")} :</b></h4>
          <p>
            {news.infraction.text_infraction}
          </p>
          <h4><b>{t("LABEL_INFRACTION_DATE")} :</b></h4>
          <p>
            {news.infraction.infraction_date}
          </p>
          <h4><b>{t("LABEL_CREATION_DATE")} :</b></h4>
          <p>
            {news.infraction.createdAt? new Date(news.infraction.createdAt).toISOString().slice(0,10) : ""}
          </p>
          <h4><b> {t("LABEL_PAGE_ID")}:</b></h4>
          <p>
            {news.infraction.page_id}
          </p>
          <h4><b>{t("LABEL_PROOF_LINK")} :</b></h4>
          <p>
            {news.infraction.proof_link}
          </p>
          <h4><b>{t("LABEL_PREUVES")} :</b></h4>
          <p>
          {news.infraction.files.map((file)=>
            <div>
              <a href={apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}>
                {apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}
              </a>
            </div>
          )} 
          </p>
          <div>
          {news.infraction.files.map((file)=>
            <div>
              <div  className="html2pdf__page-break" ></div>
              <img src={apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId} alt="preuve"/>
            </div>
          )}
          </div>
        </div>
        }
        </div>;
  } 

  const printDocument = (title) => {
    const element = renderToString(<MyDocument/>)
    var opt = {
      margin:       1,
      filename:     title+'.pdf',
      image:        { type: 'jpeg', quality: 0.98 },
      html2canvas:  { scale: 2 },
      jsPDF:        { unit: 'in', format: 'letter', orientation: 'portrait' }
    };
    
    // New Promise-based usage:
    html2pdf().set(opt).from(element).save();
  }

  const [viewPdf, setViewPdf] = useState(false);
  useEffect(() => {
    dispatch(Tags.get());
  }, []);

  return (
    <> 
    <div style={{display : viewPdf ? "block" : "none"}} className="inf-to-print" id="divToPrint">
          <div  ref={refContainer} style={{ padding: "20px", margin: "20px", width: "95%", direction : "rtl !important" }}>
          {lang == "ar" ?
        <div style={{width: "95%", textAlign:"right !important"}}>
          <h2 className="text-center"><b>{news.title}</b></h2>
          {/* <h4><b>: {t("LABEL_MONITOR_NAME")}</b></h4>
          <p>
            {news.creatorInfo.fName + " " + news.creatorInfo.lName}
          </p> */}
          <h4><b>: {t("LABEL_TEAM")}</b></h4>
          <p>
            {roleName}
          </p>
          {/* <h4><b>: {t("LABEL_SUBJECTS")}</b></h4>
          <p>
            {news.subjects.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </p> */}
          <h4><b>: {t("LABEL_DESCRIPTION_INFRACTION")}</b></h4>
          <p>
            {news.infraction.comment}
          </p>
          <h4><b>: {t("LABEL_RESPONSIBLE_PART")}</b></h4>
          <p>
            {news.infraction.responsible}
          </p>
          <h4><b>: {t("LABEL_RESPONSIBLE_TYPE")}</b></h4>
          <p>
            {news.infraction.responsibleType}
          </p>
          <h4><b>: {t("LABEL_TYPE_INFRACTION")}</b></h4>
          <p>
            {news.infraction.infractionType}
          </p>
          <h4><b>: {t("LABEL_TEXT_INFRACTION")}</b></h4>
          <p>
            {news.infraction.text_infraction}
          </p>
          <h4><b>: {t("LABEL_INFRACTION_DATE")}</b></h4>
          <p>
            {news.infraction.infraction_date}
          </p>
          <h4><b>: {t("LABEL_CREATION_DATE")}</b></h4>
          <p>
            {news.infraction.createdAt? new Date(news.infraction.createdAt).toISOString().slice(0,10) : ""}
          </p>
          <h4><b>: {t("LABEL_PAGE_ID")}</b></h4>
          <p>
            {news.infraction.page_id}
          </p>
          <h4><b>: {t("LABEL_PROOF_LINK")}</b></h4>
          <p>
            {news.infraction.proof_link}
          </p>
          <h4><b>: {t("LABEL_PREUVES")}</b></h4>
          <p>
          {news.infraction.files.map((file)=>
            <div>
              <a href={apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}>
                {apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}
              </a>
            </div>
          )}
          </p>
        </div>
        :
        <div style={{width: "95%" }}>
          <h2 className="text-center"><b>{news.title}</b></h2>
          {/* <h4><b> {t("LABEL_MONITOR_NAME")} :</b></h4>
          <p>
            {news.creatorInfo.fName + " " + news.creatorInfo.lName}
          </p> */}
          <h4><b> {t("LABEL_TEAM")} :</b></h4>
          <p>
            {roleName}
          </p>
          {/* <h4><b>{t("LABEL_SUBJECTS")} :</b></h4>
          <p>
            {news.subjects.map((tag) => (
              <Tag tag={tag} key={tag} />
            ))}
          </p> */}
          <h4><b>{t("LABEL_DESCRIPTION_INFRACTION")} :</b></h4>
          <p>
            {news.infraction.comment}
          </p>
          <h4><b>{t("LABEL_RESPONSIBLE_PART")} :</b></h4>
          <p>
            {news.infraction.responsible}
          </p>
          <h4><b>{t("LABEL_RESPONSIBLE_TYPE")} :</b></h4>
          <p>
            {news.infraction.responsibleType}
          </p>
          <h4><b>{t("LABEL_TYPE_INFRACTION")} :</b></h4>
          <p>
            {news.infraction.infractionType}
          </p>
          <h4><b>{t("LABEL_TEXT_INFRACTION")} :</b></h4>
          <p>
            {news.infraction.text_infraction}
          </p>
          <h4><b>{t("LABEL_INFRACTION_DATE")} :</b></h4>
          <p>
            {news.infraction.infraction_date}
          </p>
          <h4><b>{t("LABEL_CREATION_DATE")} :</b></h4>
          <p>
            {news.infraction.createdAt? new Date(news.infraction.createdAt).toISOString().slice(0,10) : ""}
          </p>
          <h4><b> {t("LABEL_PAGE_ID")}:</b></h4>
          <p>
            {news.infraction.page_id}
          </p>
          <h4><b>{t("LABEL_PROOF_LINK")} :</b></h4>
          <p>
            {news.infraction.proof_link}
          </p>
          <h4><b>{t("LABEL_PREUVES")} :</b></h4>
          <p>
          {news.infraction.files.map((file)=>
            <div>
              <a href={apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}>
                {apiEndpoint + "static/infractions/" + file.filename.replaceAll(" ","") + "?load="+file.serverId}
              </a>
            </div>
          )}
          </p>
        </div>
        }
          </div>
        </div>     
      &nbsp;&nbsp;
      <div className="d-flex">
        {window.location.pathname !== "/infractions" && window.location.pathname !== "/monitoring-infractions"? <span style={{...linkStyle, cursor:"pointer"}} onClick={()=>setViewPdf(!viewPdf)}>
            <FontAwesomeIcon className={"margin-r-5"} icon={viewPdf?splitIcon("fa-eye-slash"): splitIcon("fa-eye")} />
            {t("VIEW_PDF")}
        </span> : null}
        <a href="#" style={linkStyle} onClick={()=>printDocument(news.title)}>
              <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fas-download")} />
              {t("DOWNLOAD")}
        </a>
        <ReactToPrint
          trigger={() => (
            <a href="#" style={linkStyle}>
              <FontAwesomeIcon className={"margin-r-5"} icon={splitIcon("fas-print")} />
              {t("PRINT")}
            </a>
          )}
          content={() => refContainer.current}
        />     
      </div>
      
    </>
  );
}
