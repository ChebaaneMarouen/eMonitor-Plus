import React from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { NewsStateENum } from "Enums";
import { Box } from "adminlte-2-react";

function StatusComponent({ status, t }) {
  if (status === undefined) return null;
  return (
    <Box title={t("TITLE_ETAT_DU_NEWS")} type="info">
      <center className="text-primary" style={{ fontSize: "18px" }}>
        {t(NewsStateENum[status])}
      </center>
    </Box>
  );
}

StatusComponent.propTypes = {
  status: PropTypes.number
};

export default withTranslation()(StatusComponent);
