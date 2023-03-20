import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
const { Text } = Inputs;
class DictionariesForm extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    };
    render() {
        const { t, item, onChange } = this.props;
        const { name, corpus } = item;
        return (
            <Form className={"form-horizontal"}>
                <Text
                    onChange={onChange}
                    name={"name"}
                    labelClass={"required"}
                    iconLeft={"fa-pen"}
                    sm={8}
                    labelSm={4}
                    label={t("LABEL_TITLE") + ":"}
                    placeholder={t("LABEL_TITLE")}
                    value={name || ""}
                />
                <Text
                    inputType="textarea"
                    onChange={onChange}
                    name={"corpus"}
                    labelClass={"required"}
                    iconLeft={"fa-pen"}
                    sm={8}
                    labelSm={4}
                    label={t("LABEL_CORPUS") + ":"}
                    placeholder={t("LABEL_CORPUS")}
                    value={corpus || ""}
                />
            </Form>
        );
    }
}
export default withTranslation()(DictionariesForm);
