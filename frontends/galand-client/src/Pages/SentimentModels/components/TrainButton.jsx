import React from "react";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import { connect } from "react-redux";
import { Models } from "modules/ressources";

import { useTranslation } from "react-i18next";

function TrainButton({ model, update }) {
  const { t } = useTranslation();
  const { trained = false } = model;
  if (!trained) return null;
  return (
    <Button
      size="xs"
      icon={"fa-running"}
      type={"info"}
      text={t("LABEL_TRAIN")}
      onClick={() =>
        update({ ...model, trained: false, hasError: false, activated: false })
      }
    />
  );
}

TrainButton.defaultProps = {
  model: {}
};

TrainButton.propTypes = {
  model: PropTypes.object
};
function mapDispatchToProps(dispatch) {
  return {
    update: data =>
      dispatch(
        Models.update(data, err => {
          console.log(err);
        })
      )
  };
}
export default connect(
  null,
  mapDispatchToProps
)(TrainButton);
