import React, { Component } from 'react';
import { connect } from 'react-redux';
import PropTypes from 'prop-types';
import Notifications, { notify } from 'react-notify-toast';
import { alerts as actions } from '@shared/redux';

class MyNotifications extends Component {
  constructor(props) {
    super(props);
    this.state = {
      lastMessage: '',
    };
    this.show = notify.createShowQueue({ timeout: 1500 });
    const { socket, addAlert } = this.props;
    this.notify = this.notify.bind(this);
    socket.on('notification', addAlert);
    socket.on('notif-user-affected', addAlert);
  }

  componentDidUpdate() {
    const { alerts, t, dismissAlert } = this.props;
    if (alerts && alerts[0]) {
      const userAlert = alerts[0];
      dismissAlert(userAlert);
      this.notify(userAlert);
    }
  }

  notify(data) {
    const { t } = this.props;
    const { lastMessage } = this.state;

    if (lastMessage !== data.message) {
      this.show(t(data.message), data.type);
      this.setState({
        lastMessage: data.message,
      });

      // seprate simmilar messages by 3 seconds
      setTimeout(() => {
        this.setState({
          lastMessage: '',
        });
      }, 3000);
    }
  }

  render() {
    return <Notifications options={{ zIndex: 30000000, timeout: 1500 }} />;
  }
}

MyNotifications.propTypes = {
  socket: PropTypes.object.isRequired,
  alerts: PropTypes.arrayOf(PropTypes.object),
  dismissAlert: PropTypes.func.isRequired,
  // translation
  t: PropTypes.func,
};
MyNotifications.defaultProps = {
  alerts: [],
  t: (text) => text,
};

function mapStateToProps(state) {
  return {
    alerts: state.data.alerts,
  };
}
function mapDispatchToProps(dispatch) {
  return {
    dismissAlert: (alerts) => dispatch(actions.dismissAlert(alerts)),
    addAlert: (alert) => dispatch(actions.addAlert(alert)),
  };
}

export default connect(
  mapStateToProps,
  mapDispatchToProps,
)(MyNotifications);
