import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import Upload from "@shared/Components/Upload";
import Select from "components/Select";
import { ClassificationEnum } from "Enums";
import { Form } from "reactstrap";
import { sentimentPath } from "modules/ressources";
const { Text } = Inputs;

class SentimentsForm extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    }; 

    render() {
        const { t, item, onChange } = this.props;
        const { classificationType, trainingFiles, name } = item;
        return (
            <Form className={"form-horizontal"}>
                <Text
                    onChange={this.props.onChange}
                    name={"name"}
                    labelClass={"required"}
                    iconLeft={"fa-pen"}
                    sm={8}
                    labelSm={4}
                    label={t("LABEL_NAME") + ":"}
                    placeholder={t("LABEL_NAME")}
                    value={name || ""}
                />
                <Select
                    placeholder={t("LABEL_CLASSIFICATION_TYPE")}
                    iconLeft={"fab-searchengin"}
                    name="classificationType"
                    onChange={onChange}
                    sm={12}
                    labelSm={0}
                    value={classificationType || 0}
                    options={Object.keys(ClassificationEnum).map((v) => ({
                        value: v,
                        label: t(ClassificationEnum[v]),
                    }))}
                />  
                <Upload
                    maxFiles={100000}
                    name={"trainingFiles"}
                    onChange={onChange}
                    defaultValue={trainingFiles}
                    server={sentimentPath}
                />
            </Form>
        );
    }
}
export default withTranslation()(SentimentsForm);
