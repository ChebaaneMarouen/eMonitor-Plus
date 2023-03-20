import "rc-steps/assets/index.css";
import "rc-steps/assets/iconfont.css";
import React, { Component } from "react";
import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import _ from "lodash";
import Steps, { Step } from "rc-steps";
import { connect } from "react-redux";
import { FormRessource } from "modules/ressources";
import { Row, Col, Inputs, Button } from "adminlte-2-react";
import Select from "components/Select";
import { alerts } from "@shared/redux";

const { Text, Checkbox } = Inputs;

function stepIcon({ status, node }) {
  const isProcessing = status === 'process';
  return isProcessing ? <div style={{ backgroundColor: "#ba2227" }}>{node}</div> : node;
}
class AnalysisTab extends Component {
  constructor(props) {
    super(props);
    this.state = {
      current: 0,
      themes: []
    };
    this.advanceForm = this.advanceForm.bind(this);
    this.onChange = this.onChange.bind(this);
  }

  componentDidUpdate(prevProps, prevState) {
    const { formInfos, getForms, forms } = this.props;
    if (formInfos !== prevProps.formInfos) {
      getForms(formInfos);
    }
    if (forms !== prevProps.forms) {
      const themes = forms.map(({ theme }) => theme);
      this.setState({
        themes: [...new Set(themes)]
      });
    }
    if (forms !== prevProps.forms || this.state.current !== prevState.current) {
      const { current } = this.state;
      const {form} = this.props;
      const themes = forms.map(({ theme }) => theme);
      const currentTheme = themes[current];
      const currentForms = forms.filter(({ theme }) => theme === currentTheme);
      const currentForm = form[currentForms[0]["name"]];
      let inputs = currentForms[0]?currentForms[0]["inputs"] : [];
      inputs.forEach(element => {
        this.setState({
          [element["name"]] : {
            value : currentForm?currentForm[element["name"]]:"",
            type : element["inputType"]
          }
        })
      });

    }
  }

  onChange(formName, e, type) {
    const { name, value } = e.target;
    const { form, onChange } = this.props;
    const subForm = form[formName] || {};
    this.setState({
      [name]:{
        value,
        type
      }
    })
    onChange({
      target: {
        name: "form",
        value: {
          ...form,
          [formName]: {
            ...subForm,
            [name]: value
          }
        }
      }
    });
  }
validateEmail = (email) => {
    return /^\S+@\S+\.\S+$/.test(email)
  };
  advanceForm() {
    const { current, themes } = this.state;
    const {alert} = this.props;
    let state = _.omit(this.state, ['current', 'themes']);
    for (const key in state) {
      if(state[key]["value"]==="" && state[key]["type"] !== "checkbox"){
            return alert({
                message: "MESSAGE_REMPLIR_LES_CHAMPS",
                type: "error"
              });
      }
      if(state[key]["type"] === "email"){
          if(!this.validateEmail(state[key]["value"])){
            return alert({
              message: "MESSAGE_EMAIL_IS_NOT_VALID",
              type: "error"
            });
          }
      }
    }
    
    const isLastForm = themes.length === current + 1;
    if (!isLastForm)
      return this.setState({
        current: current + 1
      });
    const { onSubmit } = this.props;
    onSubmit();
  }

  render() {
    const { t, formInfos, forms, form } = this.props;
    const { current, themes } = this.state;
    const isLastForm = themes.length === current + 1;
    const currentTheme = themes[current];
    const currentForms = forms.filter(({ theme }) => theme === currentTheme);
    return (
      <Row>
        <Col sm="12">
          <Steps stepIcon={stepIcon} current={current}>
            {themes.map(theme => (
              <Step key={theme} title={theme} />
            ))}
          </Steps>
        </Col>

        {currentForms.map(fr => (
          <div key={fr.name}>
            <Col sm="12">
              <Col sm="12">
                <hr />
              </Col>
              <div className="text-center">
                <strong >{fr.title}</strong>
              </div>
              <br />
            </Col>

            <Col sm="12">
              {fr.inputs
              .map(input => {
                return (
                  input.inputType === "select"?
                  <>
                  <Select
                    key={input.name}
                    placeholder={input.placeholder}
                    name={input.name}
                    onChange={e => this.onChange(fr.name, e, input.inputType)}
                    sm={10}
                    labelSm={2}
                    label={input.label}
                    value={_.get(form, fr.name + "." + input.name)}
                    options={input.options.map(option => ({
                      label: option,
                      value: option
                    }))}
                  />
                  <Col sm="12"><div style={{height:"20px"}}></div></Col>
                  </>:
                  input.inputType === "checkbox"?
                  <>
                  <Checkbox
                    text={input.name}
                    sm={12}
                    labelSm={0}
                    name={input.name}
                    value={!!_.get(form, fr.name + "." + input.name)}
                    onChange={(e) => this.onChange(fr.name,{target:{ name: input.name, value: !_.get(form, fr.name + "." + input.name) }}, input.inputType)}
                  />
                  <Col sm="12"><div style={{height:"20px"}}></div></Col>
                  </>:
                  <>
                  <Text
                    inputType={input.inputType}
                    required={true}
                    key={input.name}
                    placeholder={input.placeholder}
                    name={input.name}
                    onChange={e => this.onChange(fr.name, e, input.inputType)}
                    sm={10}
                    labelSm={2}
                    label={input.label}
                    value={_.get(form, fr.name + "." + input.name)}
                />
                <Col sm="12"><div style={{height:"20px"}}></div></Col>
                </>
                );
              })}
            </Col>
          </div>
        ))}

        <br />
        <Col sm="12">
          <Button
            className={current === 0 ? "invisible" : ""}
            type="secondary"
            text={t("BTN_PREVIOUS")}
            onClick={() =>
              this.setState({
                current: current - 1
              })
            }
          />
          <Button
            pullRight={true}
            type={isLastForm ? "success" : "primary"}
            text={isLastForm ? t("BTN_SUBMIT") : t("BTN_NEXT")}
            onClick={this.advanceForm}
          />
        </Col>
      </Row>
    );
  }
}
AnalysisTab.propTypes = {
  formInfos: PropTypes.array,
  forms: PropTypes.array,
  form: PropTypes.object
};

AnalysisTab.defaultProps = {
  formInfos: [],
  forms: [],
  form: {},
  getForms: PropTypes.func.isRequired
};

function mapStateToProps(state) {
  return {
    forms: state.data.forms
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getForms: names => dispatch(FormRessource.search({ multi_name: names })),
    alert: data => dispatch(alerts.addAlert(data))
  };
}

export default withTranslation()(
  connect(
    mapStateToProps,
    mapDispatchToProps
  )(AnalysisTab)
);
