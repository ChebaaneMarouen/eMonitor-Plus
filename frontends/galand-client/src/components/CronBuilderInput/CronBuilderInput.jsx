import React, { Component } from "react";
import MyModal from "@shared/Components/MyModal";
import { withTranslation } from "react-i18next";
import { Button } from "adminlte-2-react";
import CronComponent from "./Cron";
class CronBuilderInput extends Component {
  constructor(props) {
    super(props);
    this.submit = this.submit.bind(this);
    this.onChange = this.onChange.bind(this);
  }
  submit(toggleModal) {
    toggleModal();
  }

  onChange(cronExp) {
    const { onChange, name } = this.props;
    let replaceAt = (index, replacement, str) => {
      if (index >= str.length) {
        return str.valueOf();
      }

      return str.substring(0, index) + replacement + str.substring(index + 1);
    };

    for (var i = 0; i < cronExp.length; i++) {
      if (cronExp[i] == "/") {
        cronExp = replaceAt(i - 1, "*", cronExp);
      }
    }
    console.log(cronExp);

    onChange({
      target: {
        value: cronExp,
        name,
      },
    });
  }

  render() {
    const { value, placeholder, t } = this.props;
    return (
      <MyModal
        button={
          <Button icon={"fa-gear"} type="secondary" text={value || placeholder} className="cron_btn" />
        }
        title={t("BTN_EDIT_CRON_EXPRESSION")}
        submitText={t("BTN_CONFIRMER")}
        submit={(cb) => cb()}
      >
        <CronComponent onChange={this.onChange} value={value} t={t}></CronComponent>
        <div className="cron_display">{value}</div>
      </MyModal>
    );
  }
}

export default withTranslation()(CronBuilderInput);
