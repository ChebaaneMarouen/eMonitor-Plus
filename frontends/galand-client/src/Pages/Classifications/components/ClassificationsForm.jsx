import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import Upload from "@shared/Components/Upload";
import { Inputs } from "adminlte-2-react";
import Select from "components/Select";
import { Form } from "reactstrap";
import { trainingPath } from "modules/ressources";
import { ClassificationEnum } from "Enums";
const { Text } = Inputs;
class ClassificationsForm extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    };
    constructor(props) {
        super(props);
    }

    render() {
        const { t, item, onChange } = this.props;
        const { name, classificationType, trainingFiles } = item;
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
                    server={trainingPath}
                />
            </Form>
        );
    }
}
ClassificationsForm.propTypes = {
    classification: PropTypes.object,
    onChange: PropTypes.func.isRequired,
};
ClassificationsForm.defaultProps = {
    classification: {},
};

export default withTranslation()(ClassificationsForm);
