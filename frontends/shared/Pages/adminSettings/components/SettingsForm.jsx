import React, { Component } from 'react';
import { connect } from 'react-redux';
import ClonableInputs from '@shared/ClonableInputs';
import { Input } from 'reactstrap';
import {
  Row, Col, Inputs, Button,
} from 'adminlte-2-react';
import PropTypes from 'prop-types';
import QueryBuilder from '@shared/Components/QueryBuilder';
import MultiInput from './MultiInput';

const { Text, ImportWrapper } = Inputs;

class SettingsForm extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.onChange = this.onChange.bind(this);
    this.onSubmit = this.onSubmit.bind(this);
    this.setNewSettings = this.setNewSettings.bind(this);
  }

  componentDidMount() {
    const { settings } = this.props;
    this.setNewSettings(settings);
  }

  componentDidUpdate(prevProps) {
    const { settings } = this.props;
    if (settings !== prevProps.settings) {
      this.setNewSettings(settings);
    }
  }

  onChange(e) {
    const { name, value, type, checked } = e.target;
    this.setState({
      [name]: type !=="checkbox"? value : checked,
    });
  }

  onSubmit(e) {
    e.preventDefault();
    const { onSubmit } = this.props;
    onSubmit(this.state);
  }

  setNewSettings(settings) {
    const settingsValue = {};
    Object.keys(settings).forEach((key) => {
      // _id is a special key that we should ignore
      if (key !== '_id') settingsValue[key] = settings[key].value;
    });
    this.setState({
      ...settingsValue,
      _id: settings._id,
    });
  }

  createDescription(setting) {
    const result = {};
    Object.keys(setting).forEach((key) => {
      result[key] = {};
      result[key].label = setting[key].label;
      result[key].type = setting[key].inputType;
      result[key].placeholder = setting[key].description;
      result[key].options = setting[key].options;
    });
    return result;
  }

  render() {
    const { state } = this;
    const { settings } = this.props;
    const keys = Object.keys(settings).filter((s) => s !== '_id');
    return (
      <form onSubmit={this.onSubmit}>
        {keys.map((key) => (!settings[key][0] ? (
          <Row key={key}>
            <Col title={settings[key].description} xs={12}>
              <ImportWrapper label={settings[key].label} sm={10} labelSm={2}>
                <Input
                  title={settings[key].description}
                  placeholder={settings[key].description}
                  value={state[key] || ''}
                  type={settings[key].inputType}
                  name={key}
                  onChange={this.onChange}
                  style={{ margin: '3px 0px' }}
                  checked={settings[key].inputType === "checkbox" ? state[key] : null}
                >
                  <option value=""> </option>
                  {(settings[key].options || []).map((option) => (
                    <option value={option.value} key={option.value}>
                      {option.label}
                    </option>
                  ))}
                </Input>
              </ImportWrapper>
            </Col>
          </Row>
        ) : (
          <Row key={key}>
            <ClonableInputs
              maxElements={100}
              minElements={0}
              initButtonText="Add New Config"
              value={state[key]}
              name={key}
              defaultValue={{}}
              onChange={this.onChange}
            >
              <QueryBuilder
                description={this.createDescription(settings[key][0])}
              />
            </ClonableInputs>
          </Row>
        )))}

        <br />
        <Row>
          <Col md={{ span: 6, offset: 3 }}>
            <Button
              onClick={this.onSubmit}
              className="btn-block"
              type="success"
              text={`Update settings of ${state._id}`}
            />
          </Col>
        </Row>
      </form>
    );
  }
}

SettingsForm.propTypes = {
  onSubmit: PropTypes.func.isRequired,
  // eslint-disable-next-line
  settings: PropTypes.object.isRequired
};
SettingsForm.defaultProps = {};
export default connect()(SettingsForm);
