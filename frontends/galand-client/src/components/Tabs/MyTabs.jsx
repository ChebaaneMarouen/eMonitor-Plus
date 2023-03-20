import React, { Component } from "react";
import PropTypes from "prop-types";
import { Tab, TabContent, Nav, NavItem } from "react-bootstrap";
import uuidv4 from "uuid";

class MyTabs extends Component {
  state = {
    activeKey: null,
  };

  constructor(props) {
    super(props);
    const { activeKey, defaultActiveKey } = props;
    this.state = { stateActiveKey: activeKey || defaultActiveKey };
    this.onSelect = this.onSelect.bind(this);
  }

  onSelect(activeKeyParam) {
    const { stateActiveKey } = this.state;
    const { onSelect } = this.props;
    if (stateActiveKey !== activeKeyParam) {
      this.setState({ stateActiveKey: activeKeyParam });
      if (onSelect) {
        onSelect(activeKeyParam);
      }
    }
  }

  render() {
    const {
      children,
      tabsActions,
      pullRight = false,
      contentHeight,
      mountOnEnter = false,
      unmountOnExit = false,
      id = uuidv4(),
      activeKey,
      dropdownMenu,
    } = this.props;
    const { stateActiveKey } = this.state;
    const localChildren = children && children.length ? children : [children];
    return (
      <Tab.Container id={id} activeKey={activeKey || stateActiveKey} onSelect={this.onSelect}>
        <div className="nav-tabs-custom">
          <Nav bsStyle="tabs" role="tablist" pullRight={pullRight} bsClass="nav">
            {localChildren.map((p) => (
              <NavItem key={p.props && p.props.eventKey} eventKey={p.props && p.props.eventKey}>
                {p.props && p.props.title}
              </NavItem>
            ))}
            {dropdownMenu}
            {tabsActions.map((action, i) => (
              <li className="pull-right" key={i}>{action}</li>
            ))}
          </Nav>
          <TabContent
            bsclass="tab"
            animation={false}
            mountOnEnter={mountOnEnter}
            unmountOnExit={unmountOnExit}
            componentClass="div"
            style={{ minHeight: contentHeight || "auto" }}
          >
            {children}
          </TabContent>
        </div>
      </Tab.Container>
    );
  }
}

MyTabs.propTypes = {
  activeKey: PropTypes.string,
  defaultActiveKey: PropTypes.string,
  onSelect: PropTypes.func,
  children: PropTypes.oneOfType([PropTypes.arrayOf(PropTypes.node), PropTypes.node]).isRequired,
  pullRight: PropTypes.bool,
  contentHeight: PropTypes.oneOfType([PropTypes.number, PropTypes.string]),
  mountOnEnter: PropTypes.bool,
  unmountOnExit: PropTypes.bool,
  id: PropTypes.string,
  icon: PropTypes.string,
  title: PropTypes.string,
  titleLeft: PropTypes.bool,
};

MyTabs.defaultProps = {
  activeKey: null,
  defaultActiveKey: null,
  onSelect: null,
  pullRight: false,
  contentHeight: null,
  mountOnEnter: false,
  unmountOnExit: false,
  id: uuidv4(),
  icon: null,
  title: null,
  titleLeft: false,
};

export default MyTabs;
