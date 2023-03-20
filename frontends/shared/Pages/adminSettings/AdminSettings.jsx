import React, { Component } from "react";
import { connect } from "react-redux";
import { Button, Content, Row, Col, Box, Tabs, TabContent } from "adminlte-2-react";
import PropTypes from "prop-types";
import SettingsForm from "./components/SettingsForm";
import SettingsRessource from "./ressources/Settings";

class AdminSettings extends Component {
  constructor(props) {
    super(props);
    this.state = {};
    this.updateSettings = this.updateSettings.bind(this);
    this.importSettings = this.importSettings.bind(this);
    this.exportSettings = this.exportSettings.bind(this);
  }

  importSettings(e) {
    // allows for settings to be uploaded from file
    e.preventDefault();
    if (e.target.files.length === 0) return;
    const file = e.target.files[0];
    const reader = new FileReader();
    reader.onload = (event) => {
      const data = event.target.result;
      const settings = JSON.parse(data);
      settings.forEach((setting) => this.updateSettings(setting));
    };
    reader.readAsText(file);
  }

  exportSettings() {
    // allows for settings to be dowwnloaded as file
    const { settings } = this.props;

    const formatedSettings = settings.map((setting) =>
      Object.keys(setting).reduce((acc, v) => {
        if (v === "_id") return { ...acc, [v]: setting[v] };
        return { ...acc, [v]: setting[v].value };
      }, {})
    );

    const url = window.URL.createObjectURL(new Blob([JSON.stringify(formatedSettings)]));
    const a = document.createElement("a");
    a.style.display = "none";
    a.href = url;
    a.download = `settings-${window.location.hostname}-${new Date().toDateString()}`;
    document.body.appendChild(a);
    a.click();
    window.URL.revokeObjectURL(url);
  }

  updateSettings(settings) {
    const { endPoint } = this.props;
    const settingsRessource = new SettingsRessource(endPoint);
    this.props.dispatch(settingsRessource.insert(settings));
  }

  render() {
    const {
      className,
      title,
      browserTitle,
      settings,
      loadingScreen,
      customOptions,
      filter,
      t,
    } = this.props;

    let filteredSettings = settings;
    if (filter) {
      if (filter.trim().toLowerCase() == "more") {
        filteredSettings = settings.filter((s) => {
          const settingId = s._id.trim().toLowerCase();
          return (
            !settingId.includes("parser") &&
            !settingId.includes("crawler") &&
            !settingId.includes("display")
          );
        });
      } else {
        filteredSettings = settings.filter((s) =>
          s._id.trim().toLowerCase().includes(filter.trim().toLowerCase())
        );
      }
    }
    return filteredSettings.length === 0 ? (
      <Content className={className} title={title} browserTitle={browserTitle}>
        <Row>
          <Col xs={12}>
            <Box title="Settings" type="primary">
              {loadingScreen}
            </Box>
          </Col>
        </Row>
      </Content>
    ) : (
      <Content className={className} title={title} browserTitle={browserTitle}>
        <Row>
          <Col xs={12}>
            <Box
              type="primary"
              customOptions={customOptions}
              options={
                <div style={{ padding: "10px" }}>
                  <label htmlFor="importFile" className="btn btn-primary btn-block">
                    {t("IMPORT")}
                  </label>

                  <br />
                  <Button block text="export" type="primary" onClick={this.exportSettings} />
                  <input
                    id="importFile"
                    type="file"
                    style={{ visibility: "hidden" }}
                    onChange={this.importSettings}
                  />
                </div>
              }
            >
              {filteredSettings.length && (
                <Tabs defaultActiveKey={settings[0]._id} titleLeft>
                  {filteredSettings
                    .sort((a, b) => (a._id <= b._id ? -1 : 1))
                    .map((s) => (
                      <TabContent title={s._id} key={s._id} eventKey={s._id}>
                        <SettingsForm onSubmit={this.updateSettings} settings={s} />
                      </TabContent>
                    ))}
                </Tabs>
              )}
            </Box>
          </Col>
        </Row>
      </Content>
    );
  }
}

AdminSettings.propTypes = {
  endPoint: PropTypes.string,
  className: PropTypes.string,
  settings: PropTypes.arrayOf(PropTypes.object),
  title: PropTypes.string,
  browserTitle: PropTypes.string,
  loadingScreen: PropTypes.node,
  customOptions: PropTypes.node
};
AdminSettings.defaultProps = {
  className: "",
  settings: [],
  title: "Admin Settings",
  browserTitle: "Admin Settings",
  endPoint: "/api/manager/settings",
  customOptions: null,
  loadingScreen: null,
};

function mapStateToProps(state) {
  console.log("settings : ", state.data.settings)
  return {
    settings: state.data.settings,
  };
}

export default connect(mapStateToProps, null)(AdminSettings);
