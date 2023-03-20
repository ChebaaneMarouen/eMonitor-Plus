import React, { Component } from "react";
import { Inputs } from "adminlte-2-react";
import PropTypes from "prop-types";
import Select from "react-select";
const { ImportWrapper } = Inputs;

class MySelect extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };

  constructor(props) {
    super(props);
    this.onChange = this.onChange.bind(this);
  }

  onChange(e) {
    const { onChange, name } = this.props;
    if (!e) {
      // empty list
      return onChange({ target: { name, value: [] } });
    }
    const data = e instanceof Array ? e.map((val) => val.value) : e.value;
    onChange({ target: { name, value: data } });
  }

  render() {
    let { value, multiple } = this.props;
    const { options } = this.props;
    if (value != null && options) {
      // fix formating of value
      value = options.filter((option) => [].concat(value).indexOf(option.value) >= 0);
    }

    // rename "multiple" property to "isMulti"
    const isMulti = multiple;
    const props = { ...this.props, onChange: this.onChange, value, isMulti };
    const disableWrapper = this.props.disableWrapper;
    return disableWrapper ? (
      <Select
        className="mySelect"
        classNamePrefix="mySelect"
        {...props}
        options={options}
        styles={{
          menu: (provided, state) => ({
            ...provided,
            zIndex: 500,
          }),
        }}
      />
    ) : (
      <ImportWrapper {...props}>
        <Select
          className="mySelect"
          classNamePrefix="mySelect"
          {...props}
          options={options}
          styles={{
            menu: (provided, state) => ({
              ...provided,
              zIndex: 500,
            }),
          }}
        />
      </ImportWrapper>
    );
  }
}

export default MySelect;
