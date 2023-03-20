import React, { Component } from "react";
import PropTypes from "prop-types";
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Form,
  Label,
  FormGroup,
  Col,
  Input
} from "reactstrap";
import { login } from "../actions/auth-actions";

class LoginModal extends Component {
  constructor(props) {
    super(props);
    this.state = {
      userName: "",
      password: ""
    };
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  onChange(e) {
    this.setState({
      [e.target.name]: e.target.value
    });
  }

  onSubmit(e) {
    const { userName, password } = this.state;
    const { authenticate, hostname } = this.props;
    e.preventDefault();
    login(userName, password, hostname).then(data => {
      console.log(data);
      if (data && data.success) {
        authenticate();
      }
    });
  }

  render() {
    const { isOpen } = this.props;
    const { userName, password } = this.state;
    return (
      <Modal isOpen={isOpen} centred="middle">
        <ModalHeader>Login Form</ModalHeader>
        <Form onSubmit={this.onSubmit}>
          <ModalBody>
            <FormGroup row>
              <Label for="userName" sm={4}>
                UserName
              </Label>
              <Col sm={8}>
                <Input
                  id="userName"
                  value={userName}
                  onChange={this.onChange}
                  name="userName"
                  placeholder="UserName"
                />
              </Col>
            </FormGroup>
            <FormGroup row>
              <Label for="password" sm={4}>
                Password
              </Label>
              <Col sm={8}>
                <Input
                  name="password"
                  type="password"
                  value={password}
                  onChange={this.onChange}
                  id="password"
                  placeholder="password"
                />
              </Col>
            </FormGroup>
          </ModalBody>
          <ModalFooter>
            <Button color="success">Login</Button>
          </ModalFooter>
        </Form>
      </Modal>
    );
  }
}

export default LoginModal;
