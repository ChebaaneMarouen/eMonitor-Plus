import PropTypes from 'prop-types';
import React from 'react';
import {FontAwesomeIcon} from "@fortawesome/react-fontawesome";
import {splitIcon} from "adminlte-2-react/src/components/Utilities";
import './TimeLine.css'

export const Timeline = ({children}) => (

    <ul className="timeline timeline-inverse">
        {children}
        <li>
            <span className={"bg-gray timeline-done"}>
            <FontAwesomeIcon icon={['far', 'clock']} />
            </span>
        </li>
    </ul>
);

export const TimeLineLabelItem = ({className,children}) => (

    <li className={'time-label'}>
        <span className={className}>
            {children}
        </span>
    </li>
);
export const TimeLineItem = ({time,icon, iconClass,title, footer, children }) => (

    <li>
        <span className={iconClass+" timeline-done"}>
       <FontAwesomeIcon className={iconClass} icon={splitIcon(icon)} />
          </span>
        <div className="timeline-item">
        <span className="time">
             <FontAwesomeIcon icon={['far', 'clock']} /> {time}
        </span>
            {title && <h3 className="timeline-header">{title}</h3>}
            {children && <div className="timeline-body">{children}</div>}
            {footer && <div className="timeline-footer">{footer}</div>}
        </div>

    </li>
);
TimeLineItem.propTypes = {
    time:PropTypes.string.isRequired,
    icon:PropTypes.string.isRequired,
    iconClass:PropTypes.string.isRequired,
    footer:PropTypes.string,

};
TimeLineLabelItem.TimeLineLabelItem = {
    className:PropTypes.string.isRequired,
};
TimeLineLabelItem.defaultProps = {
    className: null,
};
TimeLineLabelItem.defaultProps = {
    time:null,
    icon:null,
    iconClass:null,
    footer:null,
};
