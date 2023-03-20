import React, { Component, Fragment } from "react";
import { withTranslation } from "react-i18next";
import { Box, Button, Inputs } from "adminlte-2-react";
import "../../News.css";
import { Form } from "reactstrap";
import { connect } from "react-redux";
import { infractionStatusEnum } from "Enums";
import PropTypes from "prop-types";
import { Monitors } from "modules/ressources";
import AddInfractionModal from "./AddInfractionModal";
import MyModal from "@shared/Components/MyModal";
import { TypedNews } from "modules/ressources";
const NEWS = TypedNews("projects", "", "projectsInfractions");
const { Text } = Inputs;

class InfractionWidget extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string,
    };
    constructor(props) {
        super(props);
        this.state = {
            confirmComment: "",
            showAlertConfirm: false,
        };
        this.submit = this.submit.bind(this);
        this.canValidate = this.canValidate.bind(this);
        this.canRefuse = this.canRefuse.bind(this);
        this.wasAffected = this.wasAffected.bind(this);
        this.canSignalInfraction = this.canSignalInfraction.bind(this);
    }
    closeModal = () =>{
        document.querySelector(" div.fade.in.modal > div > div > div.modal-header > button").click()
    }
    submit(type) {
        console.log("type = ", type)
        const { updateInfraction, infraction } = this.props;
        if (type === "confirmer") {
            return () => {
                updateInfraction({
                    ...infraction,
                    confirmComment: this.state.confirmComment,
                    status: infractionStatusEnum.INFRACTION_VALIDE,
                },this.closeModal());
            };
        }
        if (type === "annuler") {
            return () => {
                updateInfraction({
                    ...infraction,
                    confirmComment: "",
                    status: infractionStatusEnum.NO_INFRACTION,
                },this.closeModal(),this.props.filterNews());
            };
        }
    }
    canValidate(status) {
        const { permissions } = this.props;
        return (
            status === infractionStatusEnum.INFRACTION_A_VALIDER && permissions["P_VALIDATE_INFRACTION"]
        );
    }
    canRefuse(status) {
        const { permissions } = this.props;

        return (
            (this.wasAffected() && status === infractionStatusEnum.INFRACTION_A_VALIDER) ||
            (Number(status) !== infractionStatusEnum.NO_INFRACTION &&
                permissions["P_VALIDATE_INFRACTION"])
        );
    }

    wasAffected() {
        const { currentUserId, monitor } = this.props;
        return currentUserId === monitor;
    }

    canSignalInfraction(status) {
        // return Number(status) === infractionStatusEnum.NO_INFRACTION && this.wasAffected();
        return Number(status) === infractionStatusEnum.NO_INFRACTION;
    }
   
    render() {
        const { infraction, t, updateInfraction, fromPage, singleNews } = this.props;
        const { confirmComment } = this.state;
        const status = infraction.status || 0;

        if (!this.canSignalInfraction(status) && !this.canValidate(status) && !this.canRefuse(status))
            return null;

        return !fromPage ? (
            <Box title={t("TITLE_INFRACTION")} type="info">
                <Form className={"form-horizontal"}>
                    {this.canSignalInfraction(status) && (
                        <AddInfractionModal
                            createInfraction={updateInfraction}
                            singleNews={singleNews}
                        />
                    )}
                    {this.canValidate(status) && (
                        <MyModal
                            submitText={t("BTN_AJOUTER")}
                            submit={this.submit("confirmer")}
                            title={t("BTN_CONFIRMER_LINFRACTION")}
                            size="xs"
                            button={
                                <Button
                                    block={true}
                                    type={"success"}
                                    text={t("BTN_CONFIRMER_LINFRACTION")}
                                />
                            }
                        >
                            <Text
                                label={t("LABEL_COMMENT")}
                                placeholder={t("LABEL_COMMENT")}
                                inputType="textarea"
                                name={"confirmComment"}
                                value={confirmComment}
                                onChange={(e) => this.setState({ confirmComment: e.target.value })}
                            />
                            <br></br>
                        </MyModal>
                    )}
                    {this.canRefuse(status) && (
                        <MyModal
                        submitText={t("BTN_AJOUTER")}
                        hideSubmit={true}
                        submit={this.submit("annuler")}
                        title={t("BTN_ANNULER_LINFRACTION")}
                        size="xs"
                        button={
                            <Button
                                block={true}
                                type={"warning"}
                                text={t("BTN_ANNULER_LINFRACTION")}
                               
                            />
                        }
                    >
                        <div className="sweet-alert"  
                        style={{display: "block", 
                                width:"100%",
                                position:"relative",
                                left: "unset",
                                top: "unset",
                                marginLeft: 0,
                                marginTop: 0,}}>
                            <div className="sa-icon sa-warning pulseWarning" >
                                <span className="sa-body pulseWarningIns"></span>
                                <span className="sa-dot pulseWarningIns"></span>
                            </div><h2>{t("IRREVERSIBLE_ACTION")}</h2>
                            <p>{t("CONFIRM_ACTION")}</p>
                            <fieldset>
                                <div className="sa-input-error"></div>
                            </fieldset>
                            <div className="sa-error-container">
                                <div className="icon">!</div>
                                <p>Not valid!</p>
                            </div>
                            <div className="sa-button-container">
                                <button className="cancel" style={{display: "inline-block"}} onClick={()=>this.closeModal()}>Annuler</button>
                                <div className="sa-confirm-button-container">
                                    <button className="confirm" style={{display: "inline-block",
                                    backgroundColor: "rgb(0, 166, 90)",
                                    boxShadow: "rgba(0, 166, 90, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset"
                                    }}
                                    onClick={this.submit("annuler")}>Confirmer</button><div className="la-ball-fall">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MyModal>
                    )}
                    {singleNews.infraction.confirmComment ? (
                        <span>{`${t("LABEL_COMMENT")} : ${singleNews.infraction.confirmComment}`}</span>
                    ) : (
                        <Fragment />
                    )}
                </Form>
            </Box>
        ) : (
            <span>
                {this.canValidate(status) && (
                    <MyModal
                        submitText={t("BTN_AJOUTER")}
                        submit={this.submit("confirmer")}
                        title={t("BTN_CONFIRMER_LINFRACTION")}
                        size="xs"
                        button={
                            <Button
                                size="xs"
                                block={true}
                                type={"success"}
                                text={t("BTN_CONFIRMER_LINFRACTION")}
                            />
                        }
                    >
                        <Text
                            label={t("LABEL_COMMENT")}
                            placeholder={t("LABEL_COMMENT")}
                            inputType="textarea"
                            name={"confirmComment"}
                            value={confirmComment}
                            onChange={(e) => this.setState({ confirmComment: e.target.value })}
                        />
                        <br></br>
                    </MyModal>
                )}
                {this.canRefuse(status) && (
                    <React.Fragment>
                    <MyModal
                        submitText={t("BTN_AJOUTER")}
                        hideSubmit={true}
                        submit={this.submit("annuler")}
                        title={t("BTN_ANNULER_LINFRACTION")}
                        size="xs"
                        button={
                            <Button
                                size="xs"
                                block={true}
                                type={"success"}
                                text={t("BTN_ANNULER_LINFRACTION")}
                               
                            />
                        }
                    >
                        <div className="sweet-alert"  
                        style={{display: "block", 
                                width:"100%",
                                position:"relative",
                                left: "unset",
                                top: "unset",
                                marginLeft: 0,
                                marginTop: 0,}}>
                            <div className="sa-icon sa-warning pulseWarning" >
                                <span className="sa-body pulseWarningIns"></span>
                                <span className="sa-dot pulseWarningIns"></span>
                            </div><h2>{t("IRREVERSIBLE_ACTION")}</h2>
                            <p>{t("CONFIRM_ACTION")}</p>
                            <fieldset>
                                <div className="sa-input-error"></div>
                            </fieldset>
                            <div className="sa-error-container">
                                <div className="icon">!</div>
                                <p>Not valid!</p>
                            </div>
                            <div className="sa-button-container">
                                <button className="cancel" style={{display: "inline-block"}} onClick={()=>this.closeModal()}>Annuler</button>
                                <div className="sa-confirm-button-container">
                                    <button className="confirm" style={{display: "inline-block",
                                    backgroundColor: "rgb(0, 166, 90)",
                                    boxShadow: "rgba(0, 166, 90, 0.8) 0px 0px 2px, rgba(0, 0, 0, 0.05) 0px 0px 0px 1px inset"
                                    }}
                                    onClick={this.submit("annuler")}>Confirmer</button><div className="la-ball-fall">
                                    </div>
                                </div>
                            </div>
                        </div>
                    </MyModal>
                   
                    </React.Fragment>
        )}
        </span>
    
)
                }
            }
InfractionWidget.propTypes = {
    className: PropTypes.string,
    monitors: PropTypes.arrayOf(PropTypes.object),
    infraction: PropTypes.shape({
        status: PropTypes.number,
        description: PropTypes.string,
    }),
    updateInfraction: PropTypes.func.isRequired,
};

InfractionWidget.defaultProps = {
    monitors: [],
    infraction: { status: 0 },
    permissions: {},
};

function mapStateToProps(state) {
    return {
        monitors: state.data.monitors,
        currentUserId: state.persistedData._id,
        permissions: state.persistedData.permissions,
    };
}

function mapDispatchToProps(dispatch) {
    return {
        getMonitors: () => dispatch(Monitors.get()),
        filterNews: () =>
        dispatch(
          NEWS.search(
            {
              filter: { "after_infraction.status": "1"},
              sort: [{}],
            },
            { page:0, size: 10 }
          )
        ),
    };
}

export default withTranslation()(connect(mapStateToProps, mapDispatchToProps)(InfractionWidget));
