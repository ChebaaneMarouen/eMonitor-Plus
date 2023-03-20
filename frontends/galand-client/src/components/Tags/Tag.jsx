import React, { Component } from "react";
import PropTypes from "prop-types";
import { connect } from "react-redux";

class Tag extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string
  };

  render() {
    const { tags, tag, className } = this.props;
    const targetTag = tags.filter(t => t._id === tag)[0];
    if (!targetTag) return null;
    return (
      <span
        className={"label margin-r-5 " + className}
        style={{ backgroundColor: targetTag.color }}
      >
        {targetTag.label}
      </span>
    );
  }
}

function mapStateToProps(state) {
  return {
    tags: state.data.tags
  };
}

export default connect(mapStateToProps)(Tag);

Tag.propTypes = {
  className: PropTypes.string,
  tag: PropTypes.string.isRequired
};
Tag.defaultProps = {
  tags: []
};
