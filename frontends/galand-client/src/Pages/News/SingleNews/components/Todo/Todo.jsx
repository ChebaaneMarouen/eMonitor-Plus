import PropTypes from "prop-types";
import { withTranslation } from "react-i18next";
import React, { Component } from "react";
import { Button, ButtonGroup } from "adminlte-2-react";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { splitIcon } from "adminlte-2-react/src/components/Utilities";
import "./Todo.css";
import { ImportanceEnum, StatusEnum } from "Enums";
import SweetAlert from "sweetalert-react";
import "sweetalert/dist/sweetalert.css";
import AddActionModal from "./AddActionModal";
import ActionCommentModal from "./ActionCommentModal";

export class TodoList extends Component {
  constructor(props) {
    super(props);
  }
  render() {
    return (
      <div>
        <h3>
          <FontAwesomeIcon icon={splitIcon("fa-clipboard-list")} />{" "}
          {this.props.ActionPlanTitle}
          {<AddActionModal {...this.props} className={"display-contents"} />}
        </h3>

        <ul className="todo-list">{this.props.children}</ul>
      </div>
    );
  }
}

class TodoItem extends Component {
  constructor(props) {
    super(props);
    this.state = {
      showAlertConfirm: false
    };
    this.classNames = {
      0: "callout",
      1: "Moyenne",
      2: "Faible",
      [-1]: "Importante"
    };
  }

  render() {
    const { t,  actionState, status } = this.props;
    return (
      <li className={" callout " + this.classNames[status]}>
        <span className="title">{this.props.title}</span>

        <small className={"label label-primary"}>{actionState}</small>
        {this.props.importance === ImportanceEnum.FAIBLE.value && (
          <small className={"label label-success"}>
            {t(ImportanceEnum.FAIBLE.label)}
          </small>
        )}
        {this.props.importance === ImportanceEnum.MOYENNE.value && (
          <small className={"label label-warning"}>
            {t(ImportanceEnum.MOYENNE.label)}
          </small>
        )}
        {this.props.importance === ImportanceEnum.IMPORTANTE.value && (
          <small className={"label label-danger"}>
            {t(ImportanceEnum.IMPORTANTE.label)}
          </small>
        )}
        { status !== StatusEnum.VALIDATED.value && (
          <div className="tools">
            <ButtonGroup>
              <div title={t("TEXT_MARQUER_LACTION_COMME_FAITE")}>
                <ActionCommentModal
                  onSubmit={({ comment }, cb) => {
                    this.props.changeActionStatus(
                      this.props.id,
                      StatusEnum.DONE.value,
                      null,
                      comment
                    );

                    cb();
                  }}
                  actionButton={
                    <Button
                      disabled={status === StatusEnum.DONE.value}
                      type={"success"}
                      size={"xs"}
                      circle={true}
                      flat={true}
                      icon={"fa-check"}
                    />
                  }
                />
              </div>

              <div title={t("TEXT_MARQUER_LACTION_COMME_ABONDONNÉE")}>
                <ActionCommentModal
                  onSubmit={({ comment }, cb) => {
                    this.props.changeActionStatus(
                      this.props.id,
                      StatusEnum.CANCELED.value,
                      null,
                      comment
                    );

                    cb();
                  }}
                  actionButton={
                    <Button
                      disabled={status === StatusEnum.CANCELED.value}
                      type={"danger"}
                      size={"xs"}
                      circle={true}
                      flat={true}
                      icon={"fa-times"}
                      title={t("TEXT_MARQUER_LACTION_COMME_ABONDONNÉE")}
                    />
                  }
                />
              </div>
            </ButtonGroup>
          </div>
        )}
        {(
          <div className="tools">
            <ButtonGroup>
              <div title={t("BTN_VALIDER_LACTION")}>
                <ActionCommentModal
                  onSubmit={({ comment }, cb) => {
                    this.props.changeActionStatus(
                      this.props.id,
                      StatusEnum.VALIDATED.value,
                      null,
                      comment
                    );
                    cb();
                  }}
                  actionButton={
                    <Button
                      disabled={status === StatusEnum.VALIDATED.value}
                      type={"success"}
                      size={"xs"}
                      circle={true}
                      flat={true}
                      icon={"fa-check"}
                      title={t("BTN_VALIDER_LACTION")}
                    />
                  }
                />
              </div>

              <div title={t("TITLE_REINITIALISER_LACTION")}>
                <ActionCommentModal
                  onSubmit={({ comment }, cb) => {
                    this.props.changeActionStatus(
                      this.props.id,
                      StatusEnum.NONE.value,
                      null,
                      comment
                    );

                    cb();
                  }}
                  actionButton={
                    <Button
                      disabled={status === StatusEnum.NONE.value}
                      type={"warning"}
                      size={"xs"}
                      circle={true}
                      flat={true}
                      icon={"fa-times"}
                      title={t("BTN_REINITIALISER_LACTION")}
                    />
                  }
                />
              </div>
              <div title={t("TEXT_MARQUER_LACTION_COMME_ABONDONNÉE")}>
                <ActionCommentModal
                  onSubmit={({ comment }, cb) => {
                    this.props.changeActionStatus(
                      this.props.id,
                      StatusEnum.CANCELED.value,
                      null,
                      comment
                    );

                    cb();
                  }}
                  actionButton={
                    <Button
                      disabled={status === StatusEnum.CANCELED.value}
                      type={"danger"}
                      size={"xs"}
                      circle={true}
                      flat={true}
                      icon={"fa-times"}
                      title={t("TEXT_MARQUER_LACTION_COMME_ABONDONNÉE")}
                    />
                  }
                />
              </div>

              <div title={t("BTN_SUPPRIMER")}>
                <Button
                  onClick={() => this.setState({ showAlertConfirm: true })}
                  type={"default"}
                  size={"xs"}
                  circle={true}
                  flat={true}
                  title={t("BTN_SUPPRIMER")}
                  icon={"fa-trash"}
                />
              </div>
            </ButtonGroup>
          </div>
        )}
        <span className="text">{this.props.children}</span>
        <SweetAlert
          showCancelButton
          show={this.state.showAlertConfirm}
          title={t("MESSAGE_CETTE_ACTION_EST_IRRÉVERSIBLE")}
          text={t("MESSAGE_ÊTES-VOUS_SÛR_DE_VOULOIR_SUPPRIMER_CETTE_ACTION_?")}
          type="warning"
          confirmButtonText={t("BTN_CONFIRMER")}
          cancelButtonText={t("BTN_ANNULER")}
          confirmButtonColor="#00a65a"
          onCancel={() => {
            this.setState({ showAlertConfirm: false });
          }}
          onConfirm={() => {
            this.setState({ showAlertConfirm: false }, () =>
              this.props.changeActionStatus(this.props.id, null, "DELETE")
            );
          }}
        />
      </li>
    );
  }
}

export default withTranslation()(TodoItem);

TodoItem.propTypes = {
  importance: PropTypes.object.isRequired,
  actionState: PropTypes.object.isRequired,
  title: PropTypes.string.isRequired
};

TodoList.propTypes = {
  title: PropTypes.string
};
