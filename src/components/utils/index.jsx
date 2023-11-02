import axios from 'axios'
import * as Yup from 'yup'

//DOMAIN LINK FOR BACKEND API'S
export const domain = 'https://connect2meapi.onrender.com/';

//For Making Use Of JWT Token Data
export var profile = JSON.parse(localStorage.getItem('connect2me'));

//DELETE EMAILS
export async function deleteEmail(id) {
    await axios.post(domain + 'delete_email', { id: id });
    document.getElementById(id).remove();
    var emailNumber = parseInt(document.getElementById("email-count").innerText.match(/\d+/g)) - 1;
    document.getElementById("email-count").innerHTML = emailNumber;
}

//VERIFY TOKEN
export async function verifyToken(token) {
    var verify;
    await axios.post(domain + 'verify_token', { token: token })
        .then(res => verify = res.data.message)
    if (verify !== "success") { localStorage.removeItem("connect2me") }
}

//YUP SCHEMA'S FOR ALL VALIDATIONS

export const loginSchema = Yup.object().shape({
    email: Yup.string()
        .email('Must Be A Valid Email!')
        .required('Email Address Is Mandatory!'),
    password: Yup.string()
        .required('Password Is Mandatory!'),
});

export const signupSchema = Yup.object().shape({
    username: Yup.string()
        .min(5, 'Too Short')
        .max(15, 'Too Long')
        .required('User Name Is Mandatory!'),
    email: Yup.string()
        .email('Must Be A Valid Email!')
        .required('Email Address Is Mandatory!'),
    password: Yup.string()
        .required('Password Is Mandatory!'),
});

export const emailSchema = Yup.object().shape({
    to: Yup.string()
        .email('Must Be A Valid Email!')
        .required('TO Email Address Is Mandatory!'),
    message: Yup.string()
        .max(500, 'You Have Hit The Limit - 500 Characters')
        .required('Message Is Mandatory!'),
});