import React, { useEffect } from "react";
import FileComponent from "components/File";
import InfractionToPrint from "./InfractionToPrint";
import { infractionsFilePath, User, Role } from "modules/ressources";
import { connect } from "react-redux";



function Infraction({ news, t , getUsers, getRoles, users, roles}) {
  useEffect (() =>{
    getUsers();
    getRoles();
  },[getUsers, getRoles])
  return (
    <div className="infraction-container">
      <div className="box-body row">
        <span>{t("INFRACTIONS_TYPE")}</span> : {news.infraction.infractionType}
      </div>
      <div className="box-body row">
        <span>{t("LABEL_RESPONSIBLE_PART")}</span> : {news.infraction.responsible}
      </div>
      <div className="box-body row">
        <span>{t("LABEL_RESPONSIBLE_TYPE")}</span> : {news.infraction.responsibleType}
      </div>
      <div className="box-body row">
        <span> {t("LABEL_DESCRIPTION_INFRACTION")}</span> : {news.infraction.comment}
      </div>
      <div className="box-body row">
        <span> {t("LABEL_LINK")}</span> :<a href={news.infraction.link}>{news.infraction.link}</a>
      </div>
      <div className="box-body row">
        <span> {t("LABEL_TEXT_INFRACTION")}</span> : {news.infraction.text_infraction}
      </div>
      <div className="box-body row">
        <span> {t("LABEL_INFRACTION_DATE")}</span> : {news.infraction.infraction_date}
      </div>
      <div className="box-body row">
        <span> {t("LABEL_CREATION_DATE")}</span> : {news.infraction.createdAt? new Date(news.infraction.createdAt).toISOString().slice(0,10) : ""}
      </div>
      <div className="box-body row">
        <span> {t("LABEL_PAGE_ID")}</span> : {news.infraction.page_id}
      </div>
      <div className="box-body row">
        <span> {t("LABEL_PROOF_LINK")}</span> :<a href={news.infraction.proof_link}>{news.infraction.proof_link}</a>
      </div>
      <div className="box-body row">
        <span> {t("LABEL_PREUVES")}</span> :
        {news.infraction.files.map((fileItem) => (
          <FileComponent file={fileItem} key={fileItem.serverId} staticPath={infractionsFilePath} />
        ))}
      </div>
      <InfractionToPrint
        news={news}
        t={t}
        users = {users}
        roles = {roles}
        linkStyle={{
          outline: "none",
          textDecoration: "none",
          color: "#72afd2",
          display: "inline-block",
          width: "100%",
          textAlign: "center",
        }}
      />
    </div>
  );
}
Infraction.defaultProps = {
  users: [],
  roles: []
};
function mapStateToProps(state) {
  return {
    tags: state.data.tags,
    fName: state.persistedData.fName,
    lName: state.persistedData.lName,
    settings: state.data.settings,
    users : state.data.users,
    roles : state.data.roles
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getUsers: () => dispatch(User.get()),
    getRoles: () => dispatch(Role.get())
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(Infraction);
