import axios from 'axios'
import { useState } from 'react'
import SecurityCode from '../components/SecurityCode';
import ForgotPassword from '../components/ForgotPassword';
import LoginBox from '../components/LoginBox';
const api = require("../config.json").SERVER_URL
function Login() {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [otp, setOtp] = useState('')
    const [newpass, setNewpass] = useState('')
    const [secret, setSecret] = useState(1234)
    const [emailLabel, setEmailLabel] = useState('Email')
    const [passLabel, setPassLabel] = useState('Password')
    const [otpLabel, setOtpLabel] = useState('Please enter the OTP sent to your email address')
    const [emailExists, setEmailExists] = useState(false)
    const [passExists, setPassExists] = useState(false)
    const [newPassexists, setNewpassexists] = useState(false)
    const [cardTitle, setCardTitle] = useState('')
    const [logincomponent, setLoginComponent] = useState('block')
    const [otpcomponent, setOtpcomponent] = useState('none')
    const [forgotpasscomponent, setForgotpasscomponent] = useState('none')

    async function generateOTP() {
        return new Promise((resolve) => {
            const otpCode = Math.floor(1000 + Math.random() * 9000);
            resolve(otpCode);
        });
    }

    async function checkUser(email, password) {
        const response = await axios.get(`${api}/hash?string=${password}`)
        const res = await axios.get(`${api}/search?email=${email}`)
        let userEmail = res.data[0].email === email;
        let userPass = res.data[0].password === response.data;
        if (userEmail && userPass) return true
    }

    function smh(n) {
        switch (n) {
            case 1:
                setEmailLabel('Please provide a valid email to login')
                setEmailExists(true)
                setPassLabel('Password')
                setPassExists(false)
                break;
            case 2:
                setPassLabel('Please provide a valid password to login')
                setPassExists(true)
                setEmailLabel('Email')
                setEmailExists(false)
                break;
            default: break;
        }
    }

    const resetPassword = async (e) => {
        e.preventDefault()
        if (!email) smh(1)
        else {
            const otpCode = await generateOTP();
            setSecret(otpCode);
            setLoginComponent('none')
            setOtpcomponent('block')
            axios.post(`${api}/mail?recipient=${email}&subject=Security+Code&msg=Here+is+your+4+digit+security+code+to+create+an+Octave+Account:+<strong>${otpCode}</strong>`)
        }
    }

    async function checkOTP() {
        if (parseInt(otp) === secret) {
            setForgotpasscomponent('block')
            setOtpcomponent('none')
        }
        else
            setOtpLabel('Invalid OTP Provided')
    }

    const changePassword = async () => {
        if (!newpass)
            setNewpassexists(true)
        else {
            axios.get(`${api}/hash?string=${newpass}`)
                .then((r) => {
                    axios.put(`${api}/users/update?email=${email}&key=password&value=${r.data}`)
                        .then(
                            window.location = '/'
                        )
                })
        }
    }

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (!email)
            smh(1)
        else if (!pass)
            smh(2)
        else {
            const c = await checkUser(email, pass)
            if (!c) {
                setEmailLabel('Email')
                setPassLabel('Password')
                setEmailExists(true)
                setPassExists(true)
                setCardTitle('Incorrect Email or Password')
            }
            else {
                window.localStorage.setItem('mail', email)
                window.location = '/';
            }
        }
    }
    return (
        <>
            <SecurityCode
                display={otpcomponent}
                label={otpLabel}
                value={otp}
                change={e => setOtp(e.target.value)}
                click={checkOTP}
            />

            <ForgotPassword
                display={forgotpasscomponent}
                value={newpass}
                exists={newPassexists}
                change={e => setNewpass(e.target.value)}
                click={changePassword}
            />

            <LoginBox
                display={logincomponent}
                title={cardTitle}
                eLabel={emailLabel}
                eExists={emailExists}
                email={email}
                eChange={e => setEmail(e.target.value)}
                pLabel={passLabel}
                pExists={passExists}
                password={pass}
                pChange={e => setPass(e.target.value)}
                fpClick={resetPassword}
                click={handleSubmit}
            />
        </>
    )
}

export default Login