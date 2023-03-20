import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';

class EventsHandler extends Component {
  constructor(props) {
    super(props);
    const { socket } = this.props;
    this.setData = this.setData.bind(this);
    this.updateData = this.updateData.bind(this);

    socket.on('data', this.setData);
    socket.on('data-updated', this.updateData);
  }

  setData(data) {
    this.props.setData(data);
  }

  updateData(data) {
    const { updateData, deleteData } = this.props;
    if (data.value && data.value.deleted) return deleteData(data);

    updateData(data);
  }

  render() {
    return <div />;
  }
}

EventsHandler.propTypes = {
  socket: PropTypes.object.isRequired,
  setData: PropTypes.func.isRequired,
  updateData: PropTypes.func.isRequired,
};

function mapStateToProps(state) {
  return {};
}
function mapDispatchToProps(dispatch) {
  return {
    setData: (data) => dispatch({ type: 'fetch', payload: data }),
    updateData: (data) => dispatch({ type: 'update', payload: data }),
    deleteData: (data) => dispatch({ type: 'remove', payload: data }),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(EventsHandler);
