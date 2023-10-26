import React from 'react'
import { OverlayTrigger, Tooltip } from 'react-bootstrap'
import moment from 'moment'
import { deleteEmail } from '../../components/utils/'
import New from '../../assets/new.webp'
import Delete from '../../assets/delete.png'
import './index.css'

export default function index({ element }) {

    //To Evaluate Whether The Email Is New OR OLD
    var time = new Date() - new Date(atob(element.dateTime));

    //For `Tooltip` Title
    var title = new Date(atob(element.dateTime)).toString();

    const renderTooltip = (props) => (
        <Tooltip id="button-tooltip" {...props}>
            {title}
        </Tooltip>
    );

    return (
        <OverlayTrigger
            placement="top"
            delay={{ show: 50, hide: 50 }}
            overlay={renderTooltip}
        >
            <div id={element._id} className="email-card-main my-5">
                <span className="new-or-old">{(time <= 86400000) ? (<img src={New} alt="UNDER A DAY OLD" title="UNDER A DAY OLD" />) : ''}</span>
                <img onClick={() => { if (confirm('You Sure?') == true) { deleteEmail(element._id) } }} src={Delete} alt="Delete" title="Click To Delete" className="delete-icon" />
                <p>From: {element.from}</p>
                <p>Mail Sent: {moment(atob(element.dateTime)).fromNow().toUpperCase()}</p>
                <p>Message: {atob(element.message)}</p>
            </div>
        </OverlayTrigger>
    );
}