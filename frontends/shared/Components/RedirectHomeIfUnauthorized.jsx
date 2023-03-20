import React, { Component } from 'react';
import PropTypes from 'prop-types';

class RedirectHomeIfUnauthorized extends Component {
  constructor(props) {
    super(props);
  }

  render() {
    const { isValid } = this.props;
    return <div className={styles.base} />;
  }
}

export default RedirectHomeIfUnauthorized;
