import React, { Component } from "react";
import PropTypes from "prop-types";
import { Content, Button } from "adminlte-2-react";

class MyModal extends Component {
    constructor(props) {
        super(props);
        this.toggle = this.toggle.bind(this);
        this.create = this.create.bind(this);
        this.state = {
            showModal: false,
        };
    }

    toggle() {
        const { showModal } = this.state;
        if (this.props.onToggle) this.props.onToggle(!showModal);
        this.setState({
            showModal: !showModal,
        });
    }

    create() {
        const { submit } = this.props;
        submit(this.toggle);
    }

    render() {
        const {
            hideSubmit,
            children,
            submitText,
            submitType,
            title,
            className,
            button,
            size,
        } = this.props;
        const ButtonWithListener = React.cloneElement(button, {
            onClick: this.toggle,
        });
        const { showModal } = this.state;
        return (
            <div className={className}>
                {ButtonWithListener}
                <Content
                    show={showModal}
                    size={size}
                    modal
                    title={title}
                    onHide={this.toggle}
                    onOpen={console.log}
                    modalFooter={
                        !hideSubmit && (
                            <Button block type={submitType} text={submitText} onClick={this.create} />
                        )
                    }
                >
                    {children}
                </Content>
            </div>
        );
    }
}
MyModal.propTypes = {
    children: PropTypes.node.isRequired,
    submit: PropTypes.func,
    className: PropTypes.string,
    title: PropTypes.string,
    submitText: PropTypes.string,
    submitType: PropTypes.string,
    size: PropTypes.string,
    button: PropTypes.element.isRequired,
};

MyModal.defaultProps = {
    title: "",
    className: "",
    submit: null,
    size: "sm",
    submitType: "success",
    submitText: "Submit",
};
export default MyModal;
