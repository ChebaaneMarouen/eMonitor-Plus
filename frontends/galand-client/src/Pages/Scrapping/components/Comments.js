import React, { useState, useEffect } from "react";
import ReactPaginate from "react-paginate";
import ShowMore from '../../../assests/show-more.svg';
import CommentsAnalyse from "./CommentsAnalyseModal";


const SIZE = 15;

export default function Comments({ comments, item, t }) {
  const [commentsRes, setCommentRes] = useState([]);
  const [from, setFrom] = useState(0);
  const [to, setTo] = useState(SIZE);
  const [display, setDisplay] = useState(false);
  useEffect(() => {
    if (comments) facebookComments(comments);
  }, [comments]);

  const facebookComments = (data) =>{
    console.log("dataComments \t", data)
    console.log("dataComments2 \t", data.data)
    /*let result = [];
    function res(obj, indented) {
      if(obj.data){
        let sortedData = obj["data"].sort((x,y)=>{
          return y["reactions"]["summary"]["total_count"] - x["reactions"]["summary"]["total_count"]
        })
        for (let i = 0; i < sortedData.length; i++) {
          if (sortedData[i].message){
            if(indented){
              result.push("╚>\t" + sortedData[i].message);
            }else{
              result.push(sortedData[i].message);
            }
            
          } 
          if (sortedData[i].comments && sortedData[i].comments.data.length) res(sortedData[i].comments, true);
      }
      }
    }
    res(data);
    setCommentRes(result);
    */
   let result = data.data ? data.data : [];
    setCommentRes(result);
  }
  
  let paginate = (e) => {
    let { selected } = e;
    setFrom(selected * SIZE);
    setTo(selected * SIZE + SIZE);
  };

  const hideInhideComments = () =>{
      setDisplay(!display)
  }

  return commentsRes.length != 0 ? (
    <div>
      <h5 className="d-inline-block" style={{ fontWeight: 600 }}>{t("LABEL_COMMENTS")} </h5><span onClick={hideInhideComments} style={{cursor:"pointer", marginLeft : "5px", marginTop:"3px"}}>➤</span>
     { display ?
     <div>
          <div>
          {commentsRes.slice(from, to).map((com) => (
            <span className="comment"><b>{com.userName} </b>:  {com.comment}<CommentsAnalyse text={com.comment} comment={com} item={item} t={t}  label={t("COMMENT_ANALYSER")}/></span>
          ))}
        </div>
        <ReactPaginate
          pageCount={Math.ceil(commentsRes.length / SIZE)}
          onPageChange={paginate}
          marginPagesDisplayed={2}
          pageRangeDisplayed={5}
          containerClassName="pagination"
          subContainerClassName="pages pagination"
          activeClassName="active"
          breakClassName="break-me"
          previousLabel={t("TEXT_PRECEDENT")}
          nextLabel={t("TEXT_SUIVANT")}
          breakLabel="..."
        />
      </div> :null}
      
    </div>
  ) : (
    <></>
  );
}
