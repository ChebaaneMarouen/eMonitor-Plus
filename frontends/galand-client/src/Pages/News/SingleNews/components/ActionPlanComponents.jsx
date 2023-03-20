import React, { Component } from "react";
import { withTranslation } from "react-i18next";
import "../../News.css";
import PropTypes from "prop-types";
import { getKeyByValue } from "../../../../Enums";
import TodoItem, { TodoList } from "./Todo/Todo";
import { StatusEnum, ImportanceEnum } from "Enums";
import ActionComments from "./ActionComments";

class ActionPlanComponents extends Component {
  constructor(props) {
    super(props);
  }
  count(actions, type) {
    return actions.reduce((acc, v) => {
      const exist = v.status && v.status === type.value ? 1 : 0;
      return acc + exist;
    }, 0);
  }
  render() {
    const { actionPlan, t} = this.props;
    return (
      <TodoList
        ActionPlanTitle={
          t("TEXT_PLAN_DACTIONS") +
          " (" +
          this.count(actionPlan, StatusEnum["VALIDATED"]) +
          "/" +
          actionPlan.length +
          " )"
        }
        {...this.props}
      >
        {actionPlan.map((action, key) => (
          <TodoItem
            id={key}
            title={action.title}
            status={action.status}
            actionState={t(
              getKeyByValue(StatusEnum, action.status, null, null, "label")
            )}
            importance={action.importance}
            changeActionStatus={this.props.changeActionStatus}
          >
            <p>{action.additionalInfo}</p>

            <ActionComments comments={action.comments} />
          </TodoItem>
        ))}
      </TodoList>
    );
  }
}
ActionPlanComponents.defaultProps = {
  actionPlan: PropTypes.object
};
ActionPlanComponents.defaultProps = {
  actionPlan: []
};
export default withTranslation()(ActionPlanComponents);
