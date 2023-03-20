import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
import ClonableInputs from "@shared/ClonableInputs/ClonableInputs";
import QueryBuilder from "@shared/Components/QueryBuilder";

const { Text } = Inputs;

class RulesForm extends Component {
  constructor(props) {
    super(props);
    this.defaultRule = {
      propName: "",
      propPath: "",
      propAttribute: "",
      propScript: "params.value"
    };
  }
  getDecription(t) {
    return {
      propName: {
        placeholder: t("LABEL_PROP_NAME"),
        type: "text"
      },
      propPath: {
        placeholder: t("LABEL_CSS_SELECTOR"),
        type: "text"
      },
      propAttribute: {
        placeholder: t("LABEL_ATTRIBUTE"),
        type: "text",
        defaultValue: "text"
      },
      propScript: {
        placeholder: t("LABEL_SCRIPT"),
        inputType: "script",
        defaultValue: "params.value"
      }
    };
  }

  render() {
    const { onChange, item, t } = this.props;
    const { parsingRules, name, urlCondition, priority } = item;
    return (
      <Form className={"form-horizontal"}>
        <Text
          onChange={onChange}
          name="name"
          labelClass={"required"}
          sm={8}
          labelSm={4}
          label={t("LABEL_NOM") + ":"}
          placeholder={t("LABEL_NOM")}
          value={name}
        />
        <Text
          title={t("TEXT_REGEX_EXPRESSION_TO_TEST_WHEN_THE_RULE_IS_APPLIED")}
          onChange={onChange}
          name="urlCondition"
          labelClass={"required"}
          sm={8}
          labelSm={4}
          label={t("LABEL_FILTER") + ":"}
          placeholder={t(
            "TEXT_EXPRESSION_REGEX_QUI_IDENTIFIE_LE_CIBLE_DU_RÉGLE"
          )}
          value={urlCondition}
        />
        <Text
          onChange={onChange}
          name="priority"
          labelClass={"required"}
          inputType={"number"}
          sm={8}
          labelSm={4}
          label={t("LABEL_PRIORITÉ") + ":"}
          placeholder={t("TEXT_DÉFINIR_LA_PRIORITÉ_DE_LA_RÉGLE")}
          value={priority}
        />
        <ClonableInputs
          maxElements={20}
          minElements={1}
          initButtonText={t("BTN_AJOUTER_UNE_RÉGLE")}
          value={parsingRules}
          name="parsingRules"
          defaultValue={{}}
          onChange={onChange}
        >
          <QueryBuilder description={this.getDecription(t)} />
        </ClonableInputs>
      </Form>
    );
  }
}
export default withTranslation()(RulesForm);
