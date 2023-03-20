import React, { Component } from 'react';
import PropTypes from 'prop-types';
import { Input } from 'reactstrap';
import {
  Row, Col, Inputs, Button,
} from 'adminlte-2-react';

const { Text, ImportWrapper } = Inputs;

class MultiInput extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.setNewSettings = this.setNewSettings.bind(this);
    this.onChange = this.onChange.bind(this);
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
    const { onChange } = this.props;
    const { name, value } = e.target;
    this.setState(
      {
        [name]: value,
      },
      () => {
        onChange({ target: { value: this.state } });
      },
    );
  }

  setNewSettings(settings) {
    const settingsValue = {};
    Object.keys(settings).forEach((key) => {
      // _id is a special key that we should ignore
      if (key !== '_id') settingsValue[key] = settings[key].value;
    });
    this.setState({
      ...settingsValue,
    });
  }

  render() {
    const { state } = this;
    const { settings, buttonRight, value } = this.props;
    const keys = Object.keys(settings).filter((s) => s !== '_id');

    return (
      <ImportWrapper buttonRight={buttonRight}>
        <div className="row">
          {keys.map((key) => (
            <Col
              key={key}
              md={Math.round(12 / keys.length)}
              title={settings[key].description}
              xs={12}
            >
              <ImportWrapper
                labelSm={2}
                label={settings[key].label}
                sm={10}
              >
                <Input
                  title={settings[key].description}
                  placeholder={settings[key].description}
                  value={value[key] || ''}
                  type={settings[key].inputType}
                  name={key}
                  onChange={this.onChange}
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
          ))}
        </div>
      </ImportWrapper>
    );
  }
}

export default MultiInput;
