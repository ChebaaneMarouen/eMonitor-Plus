import React from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { StatusEnum } from "Enums";
function getTime(date) {
  if (date) return new Date(date).toISOString().replace("T", " ").replace(/\..*/, "");
}
function ActionComments({ comments, t }) {
  if (!comments) return null;
  return (
    <div>
      {comments.map((c, i) => (
        <div key={i} className="box box-default">
          <div className="box-header with-border">
            <h3 className="box-title">
              <b> {t(StatusEnum[c.actionUpdate])} </b>
              {t("BY")} <u>{c.userName}</u>
            </h3>
            <span className="pull-right text-info">{getTime(c.date)}</span>
          </div>
          <div className="box-body">{c.comment}</div>
        </div>
      ))}
    </div>
  );
}

ActionComments.defaultProps = {};

ActionComments.propTypes = {};

export default withTranslation()(ActionComments);
