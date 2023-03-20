import React from 'react';
import PropTypes from 'prop-types';
import {
  Row, Col, FormGroup, Label, Input,
} from 'reactstrap';
import { Inputs } from 'adminlte-2-react';
import Editor from 'react-simple-code-editor';
import { highlight, languages } from 'prismjs/components/prism-core';
import 'prismjs/components/prism-clike';
import 'prismjs/components/prism-javascript';
import 'prismjs/components/prism-markup';
import './highlighting.css';
import Select from 'components/Select';

require('prismjs/components/prism-jsx');

const { ImportWrapper } = Inputs;

function QueryBuilder({
  description, buttonRight, onChange, value,
}) {
  const keys = Object.keys(description);
  const itemChanged = (e) => {
    const { name } = e.target;
    const itemValue = e.target.value;
    onChange({
      target: {
        value: {
          ...value,
          [name]: itemValue,
        },
      },
    });
  };
  return (
    <ImportWrapper labelSm={0} sm={12} buttonRight={buttonRight}>
      <Row>
        {keys.map((key, i) => {
          const item = description[key];
          return (
            <Col key={i} md={12 / keys.length}>
              <FormGroup style={{ marginBottom: 0 }}>
                {item.label && (
                  <Label for={key} sm={2}>
                    {item.label}
                  </Label>
                )}
                <Col style={{ padding: 0 }} sm={item.label ? 10 : 12}>
                  {item.type && item.type == 'script' ? (
                    <Editor
                      value={value[key] || ''}
                      onValueChange={(code) => {
                        const e = { target: { value: code, name: key } };
                        itemChanged(e);
                      }}
                      highlight={(code) => highlight(code, languages.js)}
                      name={key}
                      id={key}
                      placeholder={item.placeholder}
                      padding={10}
                      className="script-input"
                    />
                  ) : item.type == 'select' ? (
                    <Select
                      disableWrapper="true"
                      name={key}
                      id={key}
                      placeholder={item.placeholder}
                      onChange={itemChanged}
                      value={value[key] || ''}
                      options={item.options.map((option) => ({
                        label: option.label,
                        value: option.value,
                      }))}
                    />
                  ) : (
                    <Input
                      type={item.type}
                      name={key}
                      id={key}
                      placeholder={item.placeholder}
                      onChange={itemChanged}
                      value={value[key] || ''}
                    />
                  )}
                </Col>
              </FormGroup>
            </Col>
          );
        })}
      </Row>
    </ImportWrapper>
  );
}

QueryBuilder.propTypes = {
  // eslint-disable-next-line
  description: PropTypes.object.isRequired,
  onChange: PropTypes.func,
  // eslint-disable-next-line
  value: PropTypes.object,
  // eslint-disable-next-line
  buttonRight: PropTypes.node
};
QueryBuilder.defaultProps = {};
export default QueryBuilder;
