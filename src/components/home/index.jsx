import React, { useState, useEffect } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import { Modal, Spinner } from 'react-bootstrap'
import CustomErrorMessage from '../../assets/elements/ErrorMessage'
import EmailCard from '../../assets/emailCard/'
import Loader from '../../assets/loader'
import { Formik } from 'formik'
import axios from 'axios'
import { domain, profile, emailSchema, verifyToken } from '../utils/'
import { MdCreate } from 'react-icons/md'
import { MdDeleteSweep } from 'react-icons/md'
import { MdClose } from 'react-icons/md'
import { MdWarning } from 'react-icons/md'
import Logout from '../../assets/logout.jpg'
import SendEmail from '../../assets/logo.png'
import './index.css'

export default function index() {

    //To Contain Error Log Eg: 'JWT EXPIRED', 'JWT MALFORMED', 'INVALID SIGNATURE'
    var error;

    //Loader State Management
    const [loadingMail, setLoadingMail] = useState(false);
    const [loadingMore, setLoadingMore] = useState(false);

    //Modal-Handles, Increment-Counters, Email-Containers etc.,
    const handleClose = () => setShow(false);
    const handleShow = () => setShow(true);
    const deleteHandleClose = () => setDeleteShow(false);
    const deleteHandleShow = () => setDeleteShow(true);
    const [show, setShow] = useState(false);
    const [deleteShow, setDeleteShow] = useState(false);
    const [increment, setIncrement] = useState(5);
    const [viewEmailData, setViewEmailData] = useState([]);
    const [howManyEmails, setHowManyEmails] = useState();
    const [personalContent, setPersonalContent] = useState();

    //Auto-Logout Upon When `SESSION` Not Found
    useEffect(() => {
        setInterval(() => {
            const connect2me = localStorage.getItem('connect2me');
            if (!connect2me) { window.location.href = "" }
        }, 1000)
    }, []);

    //Verify-Token-OnLoad
    useEffect(() => {
        verifyToken(profile.token);
    }, []);

    //Onload, saves IP DATA To Later Send When `EMAIL` Is Sent
    useEffect(() => {
        axios.get('https://ipwho.is')
            .then(res => setPersonalContent("IP : " + res.data.ip + " | City : " + res.data.city + " | Region : " + res.data.region + " | Country : " + res.data.country))
    }, []);

    //To View Mails And Get A Count Of All Mails
    async function viewMails() {
        await axios.get(domain + `view_email/5/0/${profile.token}`)
            .then(res => setViewEmailData(res.data))
        await axios.get(domain + `how_many_emails/${profile.token}`)
            .then(res => setHowManyEmails(res.data.emails))
    }

    //To Avoid Multiple Renders
    useEffect(() => {
        viewMails();
    }, []);

    //To Delete Account -> IF `SESSION` Exists
    async function deleteAccount() {
        await axios.post(domain + 'delete_account', { email: profile.email, token: profile.token })
            .then(res => error = res.data.error);
        if (error) {
            toast.error(JSON.stringify(error).toUpperCase(), {
                position: toast.POSITION.TOP_RIGHT
            });
            error = "";
        }
        else {
            localStorage.removeItem('connect2me');
        }
    }

    //Loads 5++ EMAILS Upon Click
    async function loadMore() {
        setIncrement(increment + 5);
        setLoadingMore(true);
        await axios.get(domain + `view_email/5/${increment}/${profile.token}`)
            .then(res => setViewEmailData(res.data))
        setLoadingMore(false);
    }

    return (
        <div className="home-main">

            <ToastContainer />

            <nav className="navbar navbar-expand-lg navbar-dark">
                <div className="container-fluid">
                    <a className="logo-heading navbar-brand" href="" title="CONNECT2ME - EMAILING SERVICE :)">&lt;CONNECT2ME /&gt;</a>
                    <button className="navbar-toggler" type="button" data-bs-toggle="collapse" data-bs-target="#navbarColor01" aria-controls="navbarColor01" aria-expanded="false" aria-label="Toggle navigation">
                        <span className="navbar-toggler-icon"></span>
                    </button>
                    <div className="collapse navbar-collapse" id="navbarColor01">
                        <ul className="navbar-nav ms-auto mb-2 mb-lg-0 d-flex align-items-center">
                            <li className="nav-item" title="USER NAME" onClick={deleteHandleShow}>
                                <div className="user-name">{profile.email.split('@')[0].toUpperCase()} [{howManyEmails} EMAIL(S)]&nbsp;&nbsp;</div>
                            </li>
                            <li className="nav-item">
                                <img src={SendEmail} width={50} height={50} title="SEND AN EMAIL" alt="SEND AN EMAIL" onClick={handleShow} />&nbsp;&nbsp;
                            </li>
                            <li className="nav-item" title="LOGOUT" alt="LOGOUT" onClick={() => localStorage.removeItem('connect2me')}>
                                <img src={Logout} width={50} height={50} alt="Logout" />
                            </li>
                        </ul>
                    </div>
                </div>
            </nav>

            <Modal show={show} onHide={handleClose} centered>
                <div className="send-email-modal">
                    <div className="heading display-5 d-flex align-items-center">
                        <MdCreate />SEND EMAIL <MdClose onClick={handleClose} className="modal-close" />
                    </div><br />
                    <Formik
                        initialValues={{
                            to: "",
                            message: ""
                        }}
                        validationSchema={emailSchema}
                        onSubmit={
                            async (values) => {
                                var checkAvailability = "";
                                setLoadingMail(true);
                                await axios.get(domain + 'check_availability/' + values.to.toLowerCase())
                                    .then(res => checkAvailability = res.data._id)
                                setLoadingMail(false);
                                if (!checkAvailability) {
                                    toast.error('No Such Email Exists!', {
                                        position: toast.POSITION.TOP_RIGHT
                                    });
                                }
                                else {
                                    values.to = values.to.toLowerCase();
                                    var data = { ...values, from: profile.email.toLowerCase(), dateandtime: new Date(), personalContent: personalContent, token: profile.token };
                                    await axios.post(domain + 'send_email', data)
                                        .then(
                                            res => error = res.data.error
                                        );
                                    if (error) {
                                        toast.error(JSON.stringify(error).toUpperCase(), {
                                            position: toast.POSITION.TOP_RIGHT
                                        });
                                        error = "";
                                    }
                                    else {
                                        toast.success('EMAIL SENT!', {
                                            position: toast.POSITION.TOP_RIGHT
                                        });
                                    }
                                }
                            }
                        }
                    >
                        {({
                            values,
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <div className="subheading my-2">
                                    <input type="email" name="to" placeholder="  To Email Address" value={values.to} onChange={handleChange} onBlur={handleBlur} /><br />
                                    <CustomErrorMessage errors={errors} touched={touched} name="to" /><br /><br />
                                    <textarea name="message" rows="4" placeholder="  Type In Your Message . . ." value={values.message} onChange={handleChange} onBlur={handleBlur}></textarea><br />
                                    <CustomErrorMessage errors={errors} touched={touched} name="message" /><br /><br />
                                    <button type="submit">
                                        {loadingMail ? (<Loader />) : ('SEND')}
                                    </button>
                                </div>
                            </form>
                        )}
                    </Formik>
                </div>
            </Modal>

            <Modal show={deleteShow} onHide={deleteHandleClose} centered>
                <div className="send-email-modal">
                    <div className="heading display-5 d-flex align-items-center">
                        <MdDeleteSweep />  DELETE<br />ACCOUNT? <MdClose onClick={deleteHandleClose} className="modal-close" />
                    </div><br />
                    <div className="subheading text-center">
                        <button type="submit" onClick={deleteAccount}>YES</button>
                    </div>
                </div>
            </Modal>

            <center>
                <div className="email-card">
                    {
                        (viewEmailData.length > 0) ?
                            <div>
                                {viewEmailData.map((element, i) => <EmailCard key={i} element={element} />)}
                                <button className="load-more" onClick={loadMore}>
                                    {loadingMore ? (<Loader />) : ('LOAD MORE')}
                                </button><br /><br />
                            </div>
                            :
                            <div className="my-5">
                                <MdWarning style={{ fontSize: '200px' }} /><br />
                                <h3>INBOX <br />
                                    NO EMAIL(S) LEFT TO <a href="">LOAD</a>
                                </h3>
                            </div>
                    }
                </div>
            </center>

        </div>
    );
}