import React, { Component } from "react";
import PropTypes from "prop-types";
import { Button } from "adminlte-2-react";
import MyModal from "@shared/Components/MyModal";

export default class UpdateItemModal extends Component {
  constructor(props) {
    super(props);
    this.state = { ...props.item };
    this.onChange = this.onChange.bind(this);
    this.submit = this.submit.bind(this);
  }

  onChange(e) {
    const { value, name, files } = e.target;
        if(files){
            console.log("in addItemModal", files[0])
            this.setState({file : files[0]})
        }
        if(name !== "file"){
            this.setState({
            [name]: value,
        });
        } 
  }

  submit(toggleModal) {
    const { onSubmit } = this.props;
    onSubmit(this.state, toggleModal);
  }

  render() {
    const { t, Form } = this.props;
    return (
      <MyModal
        className="inline"
        button={
          <Button
            onClick={() => this.openModal(false)}
            className="margin-r-5"
            size="xs"
            icon="fa-edit"
            type="warning"
          />
        }
        submitText={t("BTN_MODIFIER")}
        submitType="warning"
        submit={this.submit}
      >
        <Form onChange={this.onChange} item={this.state} />
      </MyModal>
    );
  }
}
UpdateItemModal.propTypes = {
  t: PropTypes.func,
  Form: PropTypes.node.isRequired,
  onSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line
  item: PropTypes.object.isRequired,
};
UpdateItemModal.defaultProps = {
  t: (text) => text,
};
