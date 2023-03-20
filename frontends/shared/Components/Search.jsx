import React, { Component } from 'react';
import PropTypes from 'prop-types';
import {
  Col, Button, Form, FormGroup, Label, Input,
} from 'reactstrap';

class Search extends Component {
  constructor(props) {
    super(props);
    this.clear = this.clear.bind(this);
    this.getClearButton = this.getClearButton.bind(this);
  }

  getClearButton(attr) {
    const { filter } = this.props;
    const val = filter[attr];
    if (!val) return null;
    return (
      <Button color="danger" title="clear" onClick={() => this.clear(attr)}>
        -
      </Button>
    );
  }

  clear(attr) {
    const { onChange } = this.props;
    onChange({
      target: {
        name: [attr],
        value: undefined,
      },
    });
  }

  render() {
    const { descriptions, filter, onChange } = this.props;
    return (
      <Form onSubmit={(e) => e.preventDefault()}>
        {descriptions.map((d) => {
          const key = d.key.split('.').pop();
          switch (d.type) {
            case 'keyword':
              return (
                <FormGroup key={d.key} row>
                  <Label for={d.key}>{key}</Label>
                  <Col sm="10">
                    <Input
                      id={d.key}
                      type="select"
                      name={d.key}
                      value={filter[d.key] || ''}
                      onChange={onChange}
                    >
                      {d.values.map((value) => (
                        <option key={value} value={value}>
                          {value}
                        </option>
                      ))}
                    </Input>
                    <div className="input-group-append">
                      {this.getClearButton(d.key)}
                    </div>
                  </Col>
                </FormGroup>
              );
            case 'long':
            case 'text': {
              const type = d.type === 'long' ? 'number' : 'text';
              return (
                <FormGroup key={d.key} row>
                  <Label for={d.key}>{key}</Label>
                  <Col sm="10">
                    <Input
                      id={d.key}
                      type={type}
                      name={d.key}
                      value={filter[d.key] || ''}
                      onChange={onChange}
                    />
                    <div className="input-group-append">
                      {this.getClearButton(d.key)}
                    </div>
                  </Col>
                </FormGroup>
              );
            }
            default:
              return null;
          }
        })}
      </Form>
    );
  }
}

Search.defaultProps = {
  descriptions: [],
};

Search.propTypes = {
  // eslint-disable-next-line
  filter: PropTypes.object.isRequired,
  descriptions: PropTypes.arrayOf(PropTypes.object),
  onChange: PropTypes.func.isRequired,
};

export default Search;
