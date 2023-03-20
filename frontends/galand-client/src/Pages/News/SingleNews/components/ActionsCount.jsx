import React from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { StatusEnum } from "Enums";
import { Label } from "reactstrap";
import { Box } from "adminlte-2-react";

function count(actions, type) {
  return actions.reduce((acc, v) => {
    const exist = v.status !== undefined &&  v.status !== null && v.status === type.value ? 1 : 0;
    return acc + exist;
  }, 0);
}

function ActionsCount({ actions, t }) {
  console.log("action plan", actions)
  return (
    <Box title={t("TITLE_PLAN_DACTIONS")} type="info">
      <Label className={"text-default"}>
        {t("LABEL_ACTIONS_À_FAIRE")} :
        <strong>{count(actions, StatusEnum["NONE"])}</strong>
      </Label>
      <br />
      <Label className={"text-info"}>
        {t("LABEL_ACTIONS_EN_ATTENTE_DE_VALIDATION")}:
        <strong>{count(actions, StatusEnum["DONE"])}</strong>
      </Label>
      <br />
      <Label className={"text-success"}>
        {t("LABEL_ACTIONS_FAITES")}:
        <strong>{count(actions, StatusEnum["VALIDATED"])}</strong>
      </Label>
      <br />
      <Label className={"text-danger"}>
        {t("LABEL_ACTIONS_ABANDONNÉES")}:
        <strong>{count(actions, StatusEnum["CANCELED"])}</strong>
      </Label>
    </Box>
  );
}

ActionsCount.defaultProps = {
  actions: []
};

ActionsCount.propTypes = {
  actions: PropTypes.arrayOf(PropTypes.object)
};

export default withTranslation()(ActionsCount);
