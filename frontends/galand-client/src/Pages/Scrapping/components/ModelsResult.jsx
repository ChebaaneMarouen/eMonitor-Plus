import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import { connect } from "react-redux";
import ModelsResultPrediction from "./ModelsResultPrediction";
import { Feed, Optimize } from "modules/ressources";
import _ from "lodash";

class ModelsResult extends Component {
  constructor(props) {
    super(props);
    this.suggestPrediction = this.suggestPrediction.bind(this);
  }

  suggestPrediction(model, prediction) {
    if (!model) return; //model no longuer exist

    const { data, updateFeed, addTrainingData } = this.props;
    updateFeed({
      ...data,
      models: {
        ...data.models,
        [model.name]: prediction
      }
    });
    // Add the new data in training files
    const trainingFiles = _.get(model, "classificationInfo.trainingFiles", []);
    const text = data[model.target];
    // check if data is string
    if (typeof text === "string")
      addTrainingData({ prediction, text, trainingFiles });
  }

  render() {
    const { t, selectedModels, data, definedModels } = this.props;
    const predictions = data.models || {};
    return (
      <div>
        {selectedModels.map(modelId => {
          const definedModel = definedModels.filter(
            definedModel => definedModel._id === modelId
          )[0];

          if (!definedModel) return null;
          console.log("\npredictions\n", predictions)
          console.log("\ndefinedModel.name\n", definedModel.name)
          console.log("\ndefinedModel\n", definedModel)
          console.log("\npredictions[definedModel.name]\n", predictions[definedModel.name])

          if (predictions[definedModel.name]) {
            const prediction = predictions[definedModel.name];
            return (
              <div>
                <b>{definedModel.name} : </b>
                  <div className="d-inline-block">
                    <ModelsResultPrediction
                      prediction={prediction}
                      onChange={prediction =>
                        this.suggestPrediction(definedModel, prediction)
                      }
                    />
                  </div>
              </div>
            );
          } else {
            return (
              <div>
                <b>{definedModel.name}:</b> {t("MESSAGE_UNAVAILABLE")}
              </div>
            );
          }
        })}
      </div>
    );
  }
}
ModelsResult.propTypes = {
  selectedModels: PropTypes.arrayOf(PropTypes.string),
  definedModels: PropTypes.arrayOf(PropTypes.object),
  t: PropTypes.func
};

ModelsResult.defaultProps = {
  selectedModels: [],
  definedModels: [],
  t: String
};

function mapStateToProps(state) {
  return {
    definedModels: state.data.models
  };
}
function mapDispatchToProps(dispatch) {
  return {
    updateFeed: data => dispatch(Feed.update(data)),
    addTrainingData: data => dispatch(Optimize.insert(data))
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(ModelsResult)
);
