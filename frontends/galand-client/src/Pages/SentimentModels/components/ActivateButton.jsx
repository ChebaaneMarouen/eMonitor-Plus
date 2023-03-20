import React from "react";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import { connect } from "react-redux";
import { Models } from "modules/ressources";

import { useTranslation } from "react-i18next";

function ActivateButton({ model, update }) {
  const { t } = useTranslation();
  const { activated = false, trained = false } = model;
  if(!trained) return null;

  const label = activated ? "BTN_DISABLE" : "BTN_ACTIVATE";
  const type = activated ? "danger" : "success";
  const icon = activated ? "fa-eye-slash" : "fa-eye";
  return (
    <Button
      size="xs"
      icon={icon}
      type={type}
      text={t(label)}
      onClick={() => update({ ...model, activated: !activated })}
    />
  );
}

ActivateButton.defaultProps = {
  model: {}
};

ActivateButton.propTypes = {
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
)(ActivateButton);
