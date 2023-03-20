import React, { Component } from "react";
import PropTypes from "prop-types";
import {Button, ButtonGroup} from "adminlte-2-react";


class DisplayType extends Component {
    static propTypes = {
        children: PropTypes.node,
        className: PropTypes.string
    };


    render() {
        return (
            <ButtonGroup pullRight={true}  >
                <Button   disabled={this.props.displayType===6} onClick={()=>this.props.onClick(6)} size={"sm"} icon={"fa-th-large"}/>
                <Button  disabled={this.props.displayType===4}  onClick={()=>this.props.onClick(4)} size={"sm"} icon={"fa-grip-horizontal"}/>
                <Button  disabled={this.props.displayType===12}  onClick={()=>this.props.onClick(12)} size={"sm"} icon={"fa-th-list"}/>
            </ButtonGroup>
        );
    }
}


export default DisplayType;
