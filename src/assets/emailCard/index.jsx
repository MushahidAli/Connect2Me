import React from 'react'
import moment from 'moment'
import { deleteEmail } from '../../components/utils/'
import Delete from '../../assets/delete.png'
import './index.css'

export default function index({ element }) {

    return (
        <div className="email-card-main my-5" title={atob(element.dateTime)}>
            <img onClick={() => { if (confirm('You Sure?') == true) { deleteEmail(element._id) } }} src={Delete} alt="Delete" title="Click To Delete" className="delete-icon" />
            <p>From: {element.from}</p>
            <p>Mail Sent: {moment(atob(element.dateTime)).fromNow().toUpperCase()}</p>
            <p>Message: {atob(element.message)}</p>
        </div>
    );
}