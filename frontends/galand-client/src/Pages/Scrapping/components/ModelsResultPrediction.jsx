import React from "react";
import PropTypes from "prop-types";
import { useTranslation } from "react-i18next";
import ModelsResultSuggestion from "./ModelsResultSuggestion";
import ModelsResultChart from "./ModelsResultChart"; 

function ModelsResultPrediction({ prediction, onChange }) {
  const { t } = useTranslation();

  const submit = (i, j, value) => {
    const newPrediction = prediction[i].map((pred, index) =>
      index === j ? value : pred
    );
    // update predictions
    onChange([
      [...prediction.slice(0, i), newPrediction, ...prediction.slice(i + 1)]
    ]);
  };

  if (!prediction) return t("MESSAGE_PREDICTION_IS_STILL_NOT_READY");
  if (Array.isArray(prediction) && prediction.length === 1)
    return prediction[0].map((pred, j) => {
      return (
        <ModelsResultSuggestion
          prediction={pred}
          submit={value => submit(0, j, value)}
        />
      );
    });

  return <ModelsResultChart prediction={prediction} />;
}

ModelsResultPrediction.defaultProps = {};

ModelsResultPrediction.propTypes = {};

export default ModelsResultPrediction;
