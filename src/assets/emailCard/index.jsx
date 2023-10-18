import React from 'react'
import moment from 'moment'
import { deleteEmail } from '../../components/utils/'
import New from '../../assets/new.webp'
import Delete from '../../assets/delete.png'
import './index.css'

export default function index({ element }) {

    //To Evaluate Whether The Email Is New OR OLD
    var time = new Date() - new Date(atob(element.dateTime));

    return (
        <div id={element._id} className="email-card-main my-5" title={atob(element.dateTime)}>
            <span className="new-or-old">{(time <= 86400000) ? (<img src={New} alt="UNDER A DAY OLD" title="UNDER A DAY OLD" />) : ''}</span>
            <img onClick={() => { if (confirm('You Sure?') == true) { deleteEmail(element._id) } }} src={Delete} alt="Delete" title="Click To Delete" className="delete-icon" />
            <p>From: {element.from}</p>
            <p>Mail Sent: {moment(atob(element.dateTime)).fromNow().toUpperCase()}</p>
            <p>Message: {atob(element.message)}</p>
        </div>
    );
}