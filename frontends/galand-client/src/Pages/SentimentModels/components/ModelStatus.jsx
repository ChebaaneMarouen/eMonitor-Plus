import React from "react";
import PropTypes from "prop-types";
import MyModal from "@shared/Components/MyModal";
import { useTranslation } from "react-i18next";
import { Button } from "adminlte-2-react";

function ModelStatus({ activated, trained, hasError, error }) {
  const { t } = useTranslation();
  if (hasError)
    return (
      <MyModal
        button={<Button icon={"fa-info"} type="danger" text={t("BTN_ERROR")} />}
        hideSubmit={true}
        title={t("TITLE_VIEW_ERROR")}
      >
        {error}
      </MyModal>
    );
  if (activated) return <span>{t("MESSAGE_MODEL_IS_ACTIVE")}</span>;

  if (trained) return <span>{t("MESSGAE_MODEL_IS_READY")}</span>;

  return <span>{t("MESSGAE_MODEL_IS_QUEUED_FOR_TRAINING")}</span>;
}

ModelStatus.defaultProps = {
  trained: false,
  hasError: false,
  error: ""
};

ModelStatus.propTypes = {
  trained: PropTypes.bool,
  hasError: PropTypes.bool,
  error: PropTypes.string
};

export default ModelStatus;
