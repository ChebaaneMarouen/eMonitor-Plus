import React from "react";
import { Navbar } from "adminlte-2-react";
import {makeNotifSeen} from "../../modules/actions";
import { Link } from "react-router-dom";

const { Core, Entry,TaskItem } = Navbar;
const langs = ["fr", "en", "ar", "es", "pt"];

function NavBar(props) {
  const { changeLang, notifications, t, changeParentState, lang, Logout, activated}=props;
  let unseeNotif = notifications ? notifications.filter(el=> el.seen === false) : [];
  let countNotif = unseeNotif.length;
  
  console.log("activated", activated)
  return (
    lang !== "ar"?<Core>
      {notifications? <Entry title={"notifications"} labelValue={countNotif>0 ? countNotif : -1} icon="fa-bell" headerText={t("TITLE_NOTIFICATIONS")}>
      {notifications.map((el,i)=>
        !el.seen?<li className="notification-item" 
                      title={el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}
                      key={el._id}
                      onClick={()=>{
                        makeNotifSeen(el._id, el.idNew,(newNotif)=>changeParentState(newNotif));
                        }}>
                    <Link to={"/news/"+ el.idNew}>
                      <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="eye-slash" className="svg-inline--fa fa-eye-slash fa-w-20 text-blue color-blue" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path></svg>
                      <span className="padd-l-5 color-black">{el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}</span>
                    </Link>
                      
                  </li>:
                  <li className="notification-item" 
                      title={el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}
                      key={el._id}>
                  <Link to={"/news/"+ el.idNew}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="eye" className="svg-inline--fa fa-eye-slash fa-w-18 text-black" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path></svg> 
                    <span className="padd-l-5 color-black">{el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}</span>
                  </Link>
                  
              </li>
        )}
      </Entry>:null}
      <Entry title={"language"} labelValue={-1} icon="fa-globe">
        <div>
          {langs.map(lang => (
            <button
            key={lang}
              onClick={() => changeLang(lang)}
              style={{
                display: "block",
                width: "100%",
                border: " none",
                margin: "1px",
                borderRadius: "5px",
                padding: "2px",
                color: activated===lang?"white":"black",
                backgroundColor: activated===lang?"#534a42":"#FFFFFF"
              }}
            >
              {lang.toUpperCase()}
            </button>
          ))}
        </div>
      </Entry>
      <Entry title={"logout"} labelValue={-1} icon="fa-sign-out-alt" onClick={()=>Logout()}/>
    </Core>:
    <Core>
        <Entry title={"logout"} labelValue={-1} icon="fa-sign-out-alt" onClick={()=>Logout()}/>
        <Entry title={"language"} labelValue={-1} icon="fa-globe">
      <div>
        {langs.map(lang => (
          <button
          key={lang}
            onClick={() => changeLang(lang)}
            style={{
              display: "block",
              width: "100%",
              border: " none",
              margin: "1px",
              borderRadius: "5px",
              padding: "2px",
              color: "white",
              backgroundColor: "#c64333"
            }}
          >
            {lang.toUpperCase()}
          </button>
        ))}
      </div>
    </Entry>
    {notifications? <Entry title={"notifications"} labelValue={countNotif>0 ? countNotif : -1} icon="fa-bell" headerText={t("TITLE_NOTIFICATIONS")}>
    {notifications.map((el,i)=>
      !el.seen?<li className="notification-item" 
      key={el._id}
      title={el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}
                    onClick={()=>{
                      makeNotifSeen(el._id, el.idNew,(newNotif)=>changeParentState(newNotif));
                      }}>
                  <Link to={"/news/"+ el.idNew}>
                    <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="eye-slash" className="svg-inline--fa fa-eye-slash fa-w-20 text-blue color-blue" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 640 512"><path fill="currentColor" d="M320 400c-75.85 0-137.25-58.71-142.9-133.11L72.2 185.82c-13.79 17.3-26.48 35.59-36.72 55.59a32.35 32.35 0 0 0 0 29.19C89.71 376.41 197.07 448 320 448c26.91 0 52.87-4 77.89-10.46L346 397.39a144.13 144.13 0 0 1-26 2.61zm313.82 58.1l-110.55-85.44a331.25 331.25 0 0 0 81.25-102.07 32.35 32.35 0 0 0 0-29.19C550.29 135.59 442.93 64 320 64a308.15 308.15 0 0 0-147.32 37.7L45.46 3.37A16 16 0 0 0 23 6.18L3.37 31.45A16 16 0 0 0 6.18 53.9l588.36 454.73a16 16 0 0 0 22.46-2.81l19.64-25.27a16 16 0 0 0-2.82-22.45zm-183.72-142l-39.3-30.38A94.75 94.75 0 0 0 416 256a94.76 94.76 0 0 0-121.31-92.21A47.65 47.65 0 0 1 304 192a46.64 46.64 0 0 1-1.54 10l-73.61-56.89A142.31 142.31 0 0 1 320 112a143.92 143.92 0 0 1 144 144c0 21.63-5.29 41.79-13.9 60.11z"></path></svg>
                    <span className="padd-l-5 color-black">{el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}</span>
                  </Link>
                    
                </li>:
                <li className="notification-item" 
                  title={el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}
                  key={el._id}>
                <Link to={"/news/"+ el.idNew}>
                  <svg aria-hidden="true" focusable="false" data-prefix="fa" data-icon="eye" className="svg-inline--fa fa-eye-slash fa-w-18 text-black" role="img" xmlns="http://www.w3.org/2000/svg" viewBox="0 0 576 512"><path fill="currentColor" d="M572.52 241.4C518.29 135.59 410.93 64 288 64S57.68 135.64 3.48 241.41a32.35 32.35 0 0 0 0 29.19C57.71 376.41 165.07 448 288 448s230.32-71.64 284.52-177.41a32.35 32.35 0 0 0 0-29.19zM288 400a144 144 0 1 1 144-144 143.93 143.93 0 0 1-144 144zm0-240a95.31 95.31 0 0 0-25.31 3.79 47.85 47.85 0 0 1-66.9 66.9A95.78 95.78 0 1 0 288 160z"></path></svg> 
                  <span className="padd-l-5 color-black">{el.video ? t("VIDEO_DOWNLOADED_SUCCESFULLY") + " ( "+ el.title + " )" : t("NOTIFICATION_AFFECTED") + " ( "+ el.title + " )"}</span>
                </Link>
                
            </li>
      )}
    </Entry>:null}
  </Core>
  );
}
export default NavBar;
