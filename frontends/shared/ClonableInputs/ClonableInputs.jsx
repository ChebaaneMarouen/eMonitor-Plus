import PropTypes from 'prop-types';
import React, { Component } from 'react';
import { Button } from 'adminlte-2-react';
import './ClonableInputs.css';

class ClonableInputs extends Component {
  constructor(props) {
    super(props);
    this.createNewElement = this.createNewElement.bind(this);
    this.deleteValue = this.deleteValue.bind(this);
    this.getRightButton = this.getRightButton.bind(this);
    this.onChange = this.onChange.bind(this);
    this.handleOnChange = this.handleOnChange.bind(this);
    this.createPaddingValues = this.createPaddingValues.bind(this);
  }

  componentDidUpdate() {
    const { value, minElements } = this.props;
    const paddedValue = value.length >= minElements
      ? value
      : value.concat(this.createPaddingValues(minElements - value.length));
    if (value !== paddedValue) this.onChange(paddedValue);
  }

  onChange(newValues) {
    const { name, onChange } = this.props;
    onChange({ target: { name, value: newValues } });
  }

  upContent = (i) =>{
    const {value} = this.props;
    let arr = value;
    arr.splice(i-1, 0, arr.splice(i, 1)[0]);
    this.onChange(arr);
  
  }
  downContent = (i) =>{
    const {value} = this.props;
    let arr = value;
    arr.splice(i+1, 0, arr.splice(i, 1)[0]);
    this.onChange(arr);
  }

  getRightButton(i) {
    const {
      value, disabled, minElements, maxElements, showDelete, from
    } = this.props;
    if (i === 0 && minElements > 0) {
      return (
        <Button
          onClick={() => this.createNewElement()}
          disabled={disabled || value.length >= maxElements}
          icon="fa-plus"
          type="success"
        />
      );
    }
    return (
      <>
        <Button
          onClick={() => this.deleteValue(i)}
          disabled={disabled || value.length <= minElements}
          icon="fa-trash"
          type="danger"
        />
       {from==="form"? i===0?
       null:
        <Button
        onClick={() => this.upContent(i)}
        disabled={disabled || i===0}
        icon="fa-angle-up"
        className="pull-left"
        type="danger"
      /> :null}
      {from ==="form" ? i===value.length-1?
      null:
      <Button
        onClick={() => this.downContent(i)}
        disabled={disabled || i===value.length-1}
        icon="fa-angle-down"
        className="pull-left"
        type="danger"
      /> : null}
      </>
    );
  }

  handleOnChange(e, i) {
    const { value } = this.props;
    const inputValue = e.target.value;
    const newValues = value.map((v, ind) => (i === ind ? inputValue : v));
    this.onChange(newValues);
  }

  createNewElement() {
    const { defaultValue, value } = this.props;
    this.onChange(value.concat([defaultValue]));
  }

  deleteValue(i) {
    const { value } = this.props;
    this.onChange(value.filter((v, ind) => i !== ind));
  }

  createPaddingValues(count) {
    const { defaultValue } = this.props;
    const padd = [];
    while (count) {
      padd.push(defaultValue);
      // eslint-disable-next-line
      count--;
    }
    return padd;
  }

  render() {
    const { children } = this.props;
    if (!children) {
      throw new Error('ClonableInputs require a child');
    }
    const {
      disabled,
      value,
      initButtonText,
      maxElements,
      minElements,
      className,
    } = this.props;

    return (
      <>
        {value.map((v, i) => React.cloneElement(children, {
          value: v,
          // eslint-disable-next-line
            key: i,
          onChange: (e) => this.handleOnChange(e, i),
          buttonRight: this.getRightButton(i),
          className,
          draggable : true
        }))}
        <br />
        {value.length < maxElements && minElements === 0 && !disabled ? (
          <Button
            block
            className="btn-center"
            text={initButtonText}
            icon="fa-plus"
            type="outline-success"
            onClick={this.createNewElement}
          />
        ) : null}
      </>
    );
  }
}

export default ClonableInputs;

ClonableInputs.propTypes = {
  disabled: PropTypes.bool,
  value: PropTypes.arrayOf(PropTypes.any),
  maxElements: PropTypes.number.isRequired,
  minElements: PropTypes.number,
  defaultValue: PropTypes.oneOfType([PropTypes.object, PropTypes.string]),
  children: PropTypes.node.isRequired,
  onChange: PropTypes.func.isRequired,
  name: PropTypes.string.isRequired,
  initButtonText: PropTypes.string,
  className: PropTypes.string,
};

ClonableInputs.defaultProps = {
  className: 'CustomClonableInput',
  minElements: 0,
  disabled: false,
  defaultValue: '',
  value: [],
};
