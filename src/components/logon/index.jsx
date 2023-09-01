import React, { useState } from 'react'
import { ToastContainer, toast } from 'react-toastify'
import md5 from 'md5'
import { Tabs, Tab, Spinner } from 'react-bootstrap'
import { Formik } from 'formik'
import axios from 'axios'
import { domain, loginSchema, signupSchema } from '../utils/'
import { PasswordInput } from '../../assets/FormElements'
import CustomErrorMessage from '../../assets/elements/ErrorMessage'
import Logo from '../../assets/logo.png'
import './index.scss'

export default function index() {

    //Checking Whether `isLog` is {auth: true} OR {auth: false}
    var isLog;

    //Loader State Management
    const [loadingSignup, setLoadingSignup] = useState(false);
    const [loadingLogin, setLoadingLogin] = useState(false);

    return (
        <div className="logon-main">
            <ToastContainer style={{ position: 'relative', top: '0px' }} />
            <center><a href=""><img src={Logo} width={100} height={100} alt="Logo" /></a></center>
            <Tabs defaultActiveKey="login" className="mb-3">
                <Tab eventKey="login" title="LOGIN">
                    <Formik
                        initialValues={{
                            email: "",
                            password: ""
                        }}
                        validationSchema={loginSchema}
                        onSubmit={
                            async (values) => {
                                values.email = values.email.toLowerCase();
                                values.password = md5(values.password);
                                setLoadingLogin(true);
                                await axios.post(domain + 'sign_in', values)
                                    .then(res => isLog = res.data)
                                setLoadingLogin(false);
                                values.password = "";
                                if (isLog.auth == "success") {
                                    localStorage.setItem('connect2me', JSON.stringify(isLog));
                                    window.location.href = "";
                                }
                                else {
                                    toast.error('Invalid Email/Password!', {
                                        position: toast.POSITION.BOTTOM_RIGHT
                                    });
                                }
                            }
                        }
                    >
                        {({
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <input type="email" name="email" placeholder="  Email Address" onChange={handleChange} onBlur={handleBlur} /><br />
                                <CustomErrorMessage errors={errors} touched={touched} name="email" /><br />
                                <PasswordInput type="password" name="password" placeholder="  Password" onChange={handleChange} onBlur={handleBlur} /><br />
                                <CustomErrorMessage errors={errors} touched={touched} name="password" /><br />
                                <br />
                                <button type="submit">
                                    { loadingLogin ? (<Spinner animation="grow" variant="secondary" />) : ('LOGIN') }
                                </button>
                            </form>
                        )}
                    </Formik>
                </Tab>
                <Tab eventKey="signup" title="SIGNUP">
                    <Formik
                        initialValues={{
                            username: "",
                            email: "",
                            password: ""
                        }}
                        validationSchema={signupSchema}
                        onSubmit={
                            async (values) => {
                                var checkAvailability = "";
                                setLoadingSignup(true);
                                await axios.get(domain + 'check_availability/' + values.email.toLowerCase())
                                    .then(res => checkAvailability = res.data._id)
                                setLoadingSignup(false);
                                if (checkAvailability) {
                                    toast.error('Email Already In Use!', {
                                        position: toast.POSITION.BOTTOM_RIGHT
                                    });
                                }
                                else {
                                    values.username = values.username.toUpperCase();
                                    values.email = values.email.toLowerCase();
                                    values.password = md5(values.password);
                                    axios.post(domain + 'sign_up', values);
                                    toast.success('Signup Was Successful!', {
                                        position: toast.POSITION.BOTTOM_RIGHT
                                    });
                                }
                            }
                        }
                    >
                        {({
                            errors,
                            touched,
                            handleChange,
                            handleBlur,
                            handleSubmit,
                        }) => (
                            <form onSubmit={handleSubmit}>
                                <input type="text" name="username" placeholder="  User Name" onChange={handleChange} onBlur={handleBlur} /><br />
                                <CustomErrorMessage errors={errors} touched={touched} name="username" /><br />
                                <input type="email" name="email" placeholder="  Email Address" onChange={handleChange} onBlur={handleBlur} /><br />
                                <CustomErrorMessage errors={errors} touched={touched} name="email" /><br />
                                <PasswordInput type="password" name="password" placeholder="  Password" onChange={handleChange} onBlur={handleBlur} /><br />
                                <CustomErrorMessage errors={errors} touched={touched} name="password" /><br />
                                <br />
                                <button type="submit">
                                { loadingSignup ? (<Spinner animation="grow" variant="secondary" />) : ('SIGNUP') }
                                </button>
                            </form>
                        )}
                    </Formik>
                </Tab>
            </Tabs>
        </div>
    );
}