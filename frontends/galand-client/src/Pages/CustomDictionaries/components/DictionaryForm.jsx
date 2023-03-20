import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import PropTypes from "prop-types";
import { Inputs } from "adminlte-2-react";
import { Form } from "reactstrap";
import WordsEditor from "./WordsEditor";
const { Text } = Inputs;
class DictionariesForm extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.updateWords = this.updateWords.bind(this);
    }

    updateWords(words) {
        this.props.onChange({
            target: {
                name: "words",
                value: words,
            },
        });
    }

    render() {
        const { t, item, onChange } = this.props;
        const { name, words } = item;
        console.log("dict from recieve : ", name, words);
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
                <WordsEditor updateWords={this.updateWords} propWords={words || []} t={t} />
            </Form>
        );
    }
}
export default withTranslation()(DictionariesForm);
