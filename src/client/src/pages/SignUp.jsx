import axios from 'axios'
import { useState } from 'react'
import SecurityCode from '../components/SecurityCode';
import SignupBox from '../components/SignupBox';
const api = require("../config.json").SERVER_URL

function SignUp() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [otp, setOtp] = useState('')
    const [secret, setSecret] = useState(1234)
    const [emailLabel, setEmailLabel] = useState('Email')
    const [passLabel, setPassLabel] = useState('Password')
    const [otpLabel, setOtpLabel] = useState('Please enter the OTP sent to your email address')
    const [emailExists, setEmailExists] = useState(false)
    const [passExists, setPassExists] = useState(false)
    const [signupcomponent, setSignupcomponent] = useState('block')
    const [otpcomponent, setOtpcomponent] = useState('none')

    async function generateOTP() {
        return new Promise((resolve) => {
            const otpCode = Math.floor(1000 + Math.random() * 9000);
            resolve(otpCode);
        });
    }

    async function createAccount(email, password) {
        axios.get(`${api}/hash?string=${password}`)
            .then((response) => {
                const hashedPass = response.data
                axios.post(`${api}/users?email=${email}&password=${hashedPass}`)
                axios.post(`${api}/users/notifs?email=${email}&notifs=[]`)
            })
        window.localStorage.setItem('e', email)
    }
    async function sendOTP() {
        const otpCode = await generateOTP();
        setSecret(otpCode);

        setSignupcomponent('none')
        setOtpcomponent('block')

        axios.post(`${api}/mail?recipient=${email}&subject=Security+Code&msg=Here+is+your+4+digit+security+code+to+create+an+Octave+Account:+<strong>${otpCode}</strong>`)
    }

    async function checkOTP() {
        console.log(otp)
        console.log(`secret :-\n${secret}`)
        if (parseInt(otp) === secret) {
            createAccount(email, pass)
                .then(window.localStorage.setItem('e', email))
                .then(window.location.href = '/')
        }
        else
            setOtpLabel('Invalid OTP Provided')
    }
    const checkExists = async (email) => {
        const res = await fetch(`${api}/search?email=${email}`, {
            method: 'GET'
        })
        const data = await res.json();
        let exists = data.some(user => user.email === email);
        return exists
    }
    function smh(n) {
        switch (n) {
            case 1:
                setEmailLabel('Please provide a valid email to signup')
                setEmailExists(true)
                setPassLabel('Password')
                setPassExists(false)
                break;
            case 2:
                setPassLabel('Please provide a valid password to signup')
                setPassExists(true)
                setEmailLabel('Email')
                setEmailExists(false)
                break;
            default: break;
        }
    }
    const handleSubmit = async (e) => {
        e.preventDefault();
        if (!email)
            smh(1)
        else if (!pass)
            smh(2)
        else {
            const c = await checkExists(email)
            if (c) {
                setPassLabel('Password')
                setPassExists(false)
                setEmailLabel('Email already in use')
                setEmailExists(true)
            }
            else
                sendOTP()
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
            {/* Signup Component */}
            <SignupBox
                display={signupcomponent}
                eLabel={emailLabel}
                eExists={emailExists}
                email={email}
                eChange={e => setEmail(e.target.value)}
                pLabel={passLabel}
                pExists={passExists}
                password={pass}
                pChange={e => setPass(e.target.value)}
                click={handleSubmit}
            />
        </>
    )
}

export default SignUp
