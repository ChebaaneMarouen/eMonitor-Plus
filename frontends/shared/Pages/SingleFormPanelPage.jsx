import React, { Component } from 'react';
import Form from 'reactstrap/es/Form';
import { Inputs, Button, ICheck } from 'adminlte-2-react';
import PropTypes from 'prop-types';
import { connect } from "react-redux";

const { Text, Checkbox } = Inputs;
class SignleFormPanelPage extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
  }

  componentDidMount() {
    const { onMount} = this.props;
    this.props.clear_switch_home();
    if (typeof onMount === 'function') onMount.call(this);
    document.body.className = 'hold-transition register-page';
  }

  componentDidUpdate(prevProps){
    if(this.props.switch_home !== prevProps.switch_home){
      if(this.props.switch_home){
        window.location.href = '/'
      }
    }
  }

  onChange(e) {
    const { name, value } = e.target;
    this.setState({
      [name]: value,
    });
  }

  onSubmit(e) {
    console.log('SUBMITTING ');
    console.log(this.state);
    e.preventDefault();
    const { onSubmit } = this.props;
    onSubmit(this.state);
  }

  render() {
    const {
      footer,
      userFields,
      welcomeMsg,
      headerText,
      submitButtonText,
      submitButtonIcon,
      t,
    } = this.props;
    return (
      <div className="login-box">
        <div className="login-logo">
          <b>{t(headerText)}</b>
        </div>
        <div className="login-box-body">
          <p className="login-box-msg">{t(welcomeMsg)}</p>
          <Form
            className="form-horizontal margin-b-15"
            onSubmit={this.onSubmit}
          >
            {userFields.map((field) => (
              <Text
                key={field.name}
                placeholder={t(field.placeholder)}
                inputType={field.type}
                labelSm={0}
                sm={12}
                name={field.name}
                onChange={this.onChange}
                iconLeft={field.icon}
              />
            ))}
            <Button
              flat
              icon={submitButtonIcon}
              type="primary"
              id="button-register"
              block
              text={t(submitButtonText)}
              onClick={this.onSubmit}
            />
          </Form>
          {footer}
        </div>
      </div>
    );
  }
}
SignleFormPanelPage.propTypes = {
  welcomeMsg: PropTypes.string,
  submitButtonText: PropTypes.string,
  submitButtonIcon: PropTypes.string,
  onSubmit: PropTypes.func.isRequired,
  userFields: PropTypes.arrayOf(PropTypes.object).isRequired,
  headerText: PropTypes.string,
  footer: PropTypes.element,
  onMount: PropTypes.oneOf([null, PropTypes.func]),
  t: PropTypes.func,
};
SignleFormPanelPage.defaultProps = {
  welcomeMsg: '',
  submitButtonText: 'Submit',
  submitButtonIcon: '',
  headerText: '',
  footer: null,
  onMount: null,
  t: (text) => text,
};
function mapStateToProps(state) {
  return {
    switch_home: state.persistedData.switch_home,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    clear_switch_home: () =>
      dispatch({
        type: "authLogin",
        switch_home : false
      })
  };
}
export default connect(mapStateToProps, mapDispatchToProps)(SignleFormPanelPage);
