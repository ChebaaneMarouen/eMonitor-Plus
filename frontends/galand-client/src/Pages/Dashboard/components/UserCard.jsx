import React, { Component} from "react";
import "./UserCard.css"

const backgrounds=["bg-aqua-gradient", "bg-red-gradient", "bg-purple-gradient", "bg-green-gradient", "bg-orange-gradient"]

const UserCard = ({indice, user, news}) =>{

    const numFakeNews = news.filter(el=>el["monitor"] === user["_id"]);
    const numInfractions = news.filter(el=>el["monitor"] === user["_id"] && el["infraction"]["status"] === 1);
    const fiability = numFakeNews.length?((numInfractions.length/numFakeNews.length) * 100).toFixed(2) : 100;
    return (
        <div className="card hovercard">
            <div className={"cardheader " + backgrounds[indice % backgrounds.length]}>
                <span className="text-left d-block first-title">{user.fName + " " + user.lName}</span>
                <span className="text-center d-block second-title">{user.company}</span>
            </div>
            <div className="avatar">
                <div className="profile-image">
                    <div className="text-image">{user.fName.slice(0,1) + user.lName.slice(0,1)}</div>
                </div>
            </div>
            <div className="d-flex justify-content-around flex-wrap">
               <h5 className="text-center padd-5">
                  <b> {numFakeNews.length} <br/> FAKENEWS</b>
               </h5>
               <h5 className="text-center padd-5">
                  <b> {numInfractions.length} <br/> INFRACTIONS</b>
               </h5>
               <h5 className="text-center padd-5">
                   <b>{fiability} % <br/> FIABILITÉ</b>
               </h5>
            </div>
            <div className="bottom">
               
            </div>
        </div>
    )
}

export default UserCard;