import React, { Component } from "react";
import { Col, Row, Container, Nav, NavItem, NavLink } from "reactstrap";
import EventsHandler from "./@shared/Components/EventsHandler";
import "./App.css";
import StatusDataGrid from "./components/status-data-grid";
import LogsDataGrid from "./components/logs-data-grid";
import LoginModal from "./components/LoginModal";
import LogsModal from "./components/LogsModal";
import ApplicationLogs from "./components/ApplicationLogs";
import { hostname } from "config";
import { getTypes } from "./helpers/extract-info-from-name";
import { addTrailingSlash } from "./helpers/fix-url";
import monitorActions from "./actions/monitoring-actions";
import * as socketActions from "./modules/socket";

class App extends Component {
  constructor(props) {
    super(props);

    this.handleChange = this.handleChange.bind(this);
    this.doAction = this.doAction.bind(this);
    this.changeType = this.changeType.bind(this);
    this.updateServiceStatus = this.updateServiceStatus.bind(this);
    this.getMonitored = this.getMonitored.bind(this);
    this.updateMonitored = this.updateMonitored.bind(this);
    this.checkAuthenticated = this.checkAuthenticated.bind(this);
    this.authenticate = this.authenticate.bind(this);
    this.removeContainerLogs = this.removeContainerLogs.bind(this);
    this.setLogData = this.setLogData.bind(this);

    this.loadLogs = this.loadLogs.bind(this);
    this.state = {
      data: [],
      isAuthenticated: true,
      hostname: hostname,
      types: {
        all: /.*/
      },
      Containerlogs: [],
      openContainer: "",
      tab: "3",
      activeType: "all",
      monitoredServices: []
    };
    this.logData = [];
    this.socket = socketActions.start();
    this.socket.on("logData", this.setLogData);
  }

  setLogData({ payload }) {
    const { Containerlogs, openContainer } = this.state;
    if (openContainer !== payload.containerId) return;
    if (this.setLogTimer) clearTimeout(this.setLogTimer);
    this.logData.push(payload.line);
    // buffer state changes
    this.setLogTimer = setTimeout(() => {
      const MAX_LOG_LENGTH = 1000;
      this.setState({
        Containerlogs: Containerlogs.concat(this.logData).slice(-MAX_LOG_LENGTH)
      });
      this.logData = [];
    }, 100);
  }

  loadLogs(containerId) {
    this.setState({
      openContainer: containerId
    });

    this.socket.emit("getLogs", {
      containerId
    });
    this.keepLogingContainer = setInterval(() => {
      this.socket.emit("updateLogsProcessLifetime", { containerId });
    }, 1000 * 60); // minute
  }

  authenticate() {
    this.socket = socketActions.start();
    this.setState({
      isAuthenticated: true
    });
  }

  checkAuthenticated(resp) {
    this.setState({
      isAuthenticated: resp.status !== 401
    });
    return resp;
  }

  getMonitored() {
    const { hostname } = this.state;
    monitorActions(hostname)
      .getMonitoredServices()
      .then(data => {
        if (typeof data === "object") {
          const monitoredServices = data.map(d => d.containerId);
          this.setState({
            monitoredServices
          });
        }
      });
  }

  removeContainerLogs(containerId) {
    if (this.keepLogingContainer) clearInterval(this.keepLogingContainer);
    this.setState({
      Containerlogs: [],
      openContainer: ""
    });
  }

  updateMonitored(containerId, isMonitored) {
    const { hostname } = this.state;
    monitorActions(hostname)
      .updateMonitoredService({
        containerId,
        isMonitored
      })
      .then(() => {
        this.getMonitored();
      });
  }

  handleChange(event) {
    this.setState({
      hostname: event.target.value
    });
  }

  changeType(event) {
    this.setState({
      activeType: event.target.value
    });
  }

  updateServiceStatus(timeout) {
    return new Promise((resolve, reject) => {
      // Set timeout timer
      let timer = setTimeout(
        () => reject(new Error("Request timed out")),
        timeout
      );

      const { isAuthenticated } = this.state;
      if (!isAuthenticated) return reject(new Error("not authenticated"));

      fetch(addTrailingSlash(this.state.hostname))
        .then(this.checkAuthenticated)
        .then(res => {
          if (res.status !== 200) {
            console.log(
              "Looks like there was a problem. Status Code: " + res.status
            );
            throw new Error(JSON.stringify(res));
          }
          return res;
        })
        .then(res => res.json())
        .then(data => {
          this.setState({
            data: data.status,
            types: getTypes(data.status),
            monitoredServices: data.monitoredContainers,
            logs: data.logs
          });
        })
        .then(resolve)
        .catch(function(err) {
          reject(err);
          console.log("Fetch Error :-S", err);
        })
        .finally(() => clearInterval(timer));
    }).catch(err => console.log(err));
  }

  componentDidMount() {
    this.updateServiceStatus(2000);
    this.timerID = setInterval(() => this.updateServiceStatus(2000), 5000);
  }

  componentWillUnmount() {
    clearInterval(this.timerID);
  }

  doAction(containerId, action) {
    fetch(addTrailingSlash(this.state.hostname) + "/actions", {
      method: "POST",
      headers: {
        "content-type": "application/json"
      },
      body: JSON.stringify({
        containerId,
        action
      })
    })
      .then(this.checkAuthenticated)
      .then(data => data.json())
      .catch(e => console.log(e));
  }

  render() {
    let {
      tab,
      data,
      logs,
      types,
      isAuthenticated,
      monitoredServices,
      activeType,
      Containerlogs,
      openContainer
    } = this.state;
    data = data.filter(d => {
      // name of container match type pattern
      return types[activeType].exec(d.name) != null;
    });
    return (
      <div className="App">
        <LoginModal
          authenticate={this.authenticate}
          hostname={hostname}
          isOpen={!isAuthenticated}
        />
        <LogsModal
          removeContainerLogs={this.removeContainerLogs}
          openContainer={openContainer}
          logs={Containerlogs}
        />
        <div style={{ backgroundColor: "#f9f9f9" }}>
          <div>
            <Nav tabs className="justify-content-end">
              <NavItem className="mr-auto">
                <NavLink
                  style={{ color: "#222222" }}
                  className="mr-auto"
                  href="#"
                  disabled
                >
                  <b style={{ color: "black" }}>BotStudio :</b> Monitor
                </NavLink>
              </NavItem>
              <NavItem>
                <NavLink
                  href="#"
                  onClick={e => {
                    e.preventDefault();
                    this.setState({
                      tab: "1"
                    });
                  }}
                  active={tab === "1"}
                >
                  Container Statistics
                </NavLink>
              </NavItem>
              <NavItem
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    tab: "2"
                  });
                }}
              >
                <NavLink href="#" active={tab === "2"}>
                  System Logs
                </NavLink>
              </NavItem>
              <NavItem
                onClick={e => {
                  e.preventDefault();
                  this.setState({
                    tab: "3"
                  });
                }}
              >
                <NavLink href="#" active={tab === "3"}>
                  Application Logs
                </NavLink>
              </NavItem>
            </Nav>
          </div>
        </div>
        <form className="hostPicker">
          <label>
            host address:
            <input
              type="text"
              value={this.state.hostname}
              onChange={this.handleChange}
            />
          </label>
          &nbsp; &nbsp;
          <label>
            Application Type:
            <select
              className="from-control"
              value={this.state.activeType}
              onChange={this.changeType}
            >
              {Object.keys(types).map(type => (
                <option value={type}>{type}</option>
              ))}
            </select>
          </label>
        </form>
        <div className="App-intro" hidden={tab !== "1"}>
          <StatusDataGrid
            updateMonitored={this.updateMonitored}
            monitored={monitoredServices}
            data={data}
            getContainerLogs={this.loadLogs}
            action={this.doAction}
          />
        </div>
        <div className="App-intro" hidden={tab !== "2"}>
          <LogsDataGrid data={logs} />
        </div>
        <div className="App-intor" hidden={tab !== "3"}>
          <ApplicationLogs socket={this.socket} />
        </div>
      </div>
    );
  }
}

export default App;
