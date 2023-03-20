import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import { Box, Button, Inputs } from "adminlte-2-react";
import "../../News.css";
import { Form } from "reactstrap";
import { connect } from "react-redux";
import Select from "../../../../components/Select";
import PropTypes from "prop-types";
import { Monitors } from "modules/ressources";
const { Date } = Inputs;

class AffectationComponent extends Component {
  static propTypes = {
    children: PropTypes.node,
    className: PropTypes.string,
  };
  constructor(props) {
    super(props);
  }

  componentWillMount() {
    const { getMonitors } = this.props;
    getMonitors();
  }

  render() {
    let { currentMonitor, currentDueDate, monitors, permissions, t, currentUserId, lang } = this.props;
    const affectedMonitor = monitors.filter((m) => m._id === currentMonitor)[0];
    return (
      <Box className={"noScroll"} title={t("TITLE_AFFECTATION")} type="info">
        <Form className={"form-horizontal"}>
          {affectedMonitor ? (
            <span>
              <b className={lang === "ar" ? "pull-right":null}>{lang === "ar" ? " : ":null}{t("LABEL_AFFECTÉ_À")}{lang !== "ar" ? " : ":null} </b>
              <span style={{ marginLeft: "15px" }} className="text-info">
                {" " + affectedMonitor.fName + " " + affectedMonitor.lName + " "}
              </span>
              <br />
              <b className={lang === "ar" ? "pull-right":null}>{lang === "ar" ? " : ":null}{t("LABEL_DATE")}{lang !== "ar" ? " : ":null}</b>
              <span style={{ marginLeft: "15px" }} className="text-info">
                {currentDueDate ? " " +  currentDueDate.slice(0, 10) + " ":" " +  t("TEXT_NON_DÉFINIT")+ " "}
              </span>
            </span>
          ) : (
            <center className="text-info">{t("TEXT_NEST_PAS_AFFECTÉ")}</center>
          )}

          {permissions["P_AFFECT_FAKENEWS"] > 1 && (
            <div>
              <br />
              <Select
                name={"monitor"}
                disabled={permissions["P_AFFECT_FAKENEWS"] < 1}
                placeholder={t("LABEL_AFFECTER_LA_NEWS")}
                iconLeft={"fa-user-tag"}
                options={monitors.map((monitor) =>
                  monitor._id == currentUserId
                    ? {
                        label: `${monitor.fName} ${monitor.lName} | ${t("TEXT_YOU")}`,
                        value: monitor._id,
                      }
                    : {
                        label: `${monitor.fName} ${monitor.lName}`,
                        value: monitor._id,
                      }
                )}
                sm={12}
                labelSm={0}
                value={this.props.monitor}
                onChange={this.props.onChange}
              />
              <Date
                onChange={this.props.onChange}
                sm={12}
                labelSm={0}
                placeholder={t("LABEL_DATE_LIMITE")}
                iconLeft={"fa-globe"}
                value={this.props.dueDate}
                name="dueDate"
              />
              <Button
                value={"AFFECT"}
                size={"sm"}
                block={true}
                className={"col-sm-8"}
                type="info"
                text={t("BTN_AFFECTER")}
                onClick={this.props.onSubmit}
              />
            </div>
          )}
        </Form>
      </Box>
    );
  }
}
AffectationComponent.propTypes = {
  className: PropTypes.string,
  monitors: PropTypes.arrayOf(PropTypes.object),
};

AffectationComponent.defaultProps = {
  monitors: [],
};

function mapStateToProps(state) {
  if (state.data.monitors) {
    //PUT CURRENT USER FIRST ON THE LIST
    var currentUser = state.data.monitors.filter((monitor) => monitor._id == state.persistedData._id);
    var monitorsSorted = state.data.monitors.filter((monitor) => monitor._id != state.persistedData._id);
    monitorsSorted.unshift(currentUser[0]);
  }
  return {
    monitors: monitorsSorted,
    permissions: state.persistedData.permissions,
    currentUserId: state.persistedData._id,
    lang : state.persistedData.lang
  };
}

function mapDispatchToProps(dispatch) {
  return {
    getMonitors: () => dispatch(Monitors.get()),
  };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(AffectationComponent));
