import React, { Component } from "react";
import { connect } from "react-redux";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";

export default class AddItemModal extends Component {
    constructor(props) {
        super(props);
        this.state = {};
        this.onChange = this.onChange.bind(this);
        this.submit = this.submit.bind(this);
    }

    onChange(e) {
        const { value, name, files } = e.target;
        if(files){
            this.setState({file : files[0]})
        }
        if(name !== "file"){
            this.setState({
            [name]: value,
        });
        } 
    
    }

    submit(toggleModal) {
        if (this.props.insertAdditionalValues) {
            const { onSubmit, insertAdditionalValues } = this.props;
            onSubmit({ ...this.state, ...insertAdditionalValues }, toggleModal);
        } else {
            const { onSubmit } = this.props;
            onSubmit(this.state, toggleModal);
        }
    }

    render() {
        const { t, addTitle, Form } = this.props;
        return (
            <MyModal
                button={<Button block pullRight icon="fa-plus" type="success" text={t("BTN_AJOUTER")} />}
                submitText={t("BTN_AJOUTER")}
                submit={this.submit}
                title={t(addTitle)}
            >
                <Form item={this.state} onChange={this.onChange}/>
            </MyModal>
        );
    }
}
AddItemModal.defaultProps = {
    t: PropTypes.func,
};
AddItemModal.defaultProps = {
    t: String,
};
