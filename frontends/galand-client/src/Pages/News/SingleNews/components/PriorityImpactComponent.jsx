import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Box, Button } from "adminlte-2-react";
import "../../News.css";
import { Form } from "reactstrap";
import { ImpactEnum, PrioriteEnum } from "Enums";
import PropTypes from "prop-types";
import Select from "components/Select";

class PriorityImpactComponent extends Component {
  render() {
    const { roles, t } = this.props;
    return (
      <Box className="noScroll" title={t("TITLE_PRIORITÉ_&_IMPACT")} type="info">
        <Form className={"form-horizontal"}>
          <Select
            name={"priority"}
            disabled={roles === 0}
            placeholder={t("LABEL_PRIORITÉ")}
            iconLeft={"fa-exclamation"}
            options={Object.values(PrioriteEnum).map(v => ({
              label: t(v.label),
              value: v.value
            }))}
            sm={12}
            labelSm={0}
            value={this.props.priority}
            onChange={this.props.onChange}
          />
          <Select
            name={"impact"}
            placeholder={t("LABEL_IMPACT")}
            disabled={roles === 0}
            iconLeft={"fa-poll"}
            options={Object.values(ImpactEnum).map(v => ({
              label: t(v.label),
              value: v.value
            }))}
            sm={12}
            labelSm={0}
            value={this.props.impact}
            onChange={this.props.onChange}
          />
          {roles > 0 && (
            <Button
              size={"sm"}
              block={true}
              className={"col-sm-8"}
              type="info"
              text={t("BTN_CONFIRMER")}
              onClick={this.props.onSubmit}
            />
          )}
        </Form>
      </Box>
    );
  }
}

export default withTranslation()(PriorityImpactComponent);
