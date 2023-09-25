import axios from 'axios'
import { useState } from 'react'
import { Hero, Card, Form, Input, Link, Button } from 'react-daisyui'
const api = `http://localhost:8000`;

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
            })
    }
    async function sendOTP() {
        const otpCode = await generateOTP();
        setSecret(otpCode);

        setSignupcomponent('none')
        setOtpcomponent('block')

        axios.post(`${api}/mail?recipient=${email}&subject=One+Time+Password&msg=${otpCode}`)
    }

    async function checkOTP() {
        console.log(otp)
        console.log(`secret :-\n${secret}`)
        if (parseInt(otp) === secret) {
            createAccount(email, pass)
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
                <div id="otpcomponent" style={{ display: otpcomponent, margin: 170 }}>
            <h1 align="center" className='text-3xl m-10'>
                <strong>
                    {otpLabel}
                </strong>
            </h1>
            <Hero>
                <Hero.Content className="flex-col lg:flex-row-reverse">
                    <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <Card.Body>
                            <Form>
                                <Input
                                    type='number'
                                    value={otp}
                                    onChange={e => setOtp(e.target.value)}
                                />
                            </Form>
                            <Button color='info' variant='outline' className='no-animation' onClick={checkOTP}>Submit</Button>
                        </Card.Body>
                    </Card>
                </Hero.Content>
            </Hero>
        </div>
        {/* Signup Component */}
        <div id="sigupcomponent" style={{ display: signupcomponent, margin: 80 }}>
            <h1 align="center" className='text-3xl m-10'>
                <strong>
                    Welcome to Octave!
                    <br />
                    Please SignUp below:
                </strong>
            </h1>
            <Hero>
                <Hero.Content className="flex-col lg:flex-row-reverse">
                    <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <Card.Body>
                            <Form>
                                <Form.Label title={emailLabel} />
                                <Input
                                    type="email"
                                    placeholder="hello@example.com"
                                    className={`input-bordered ${emailExists ? 'input-error' : ''}`}
                                    value={email}
                                    onChange={e => setEmail(e.target.value)}
                                    name='email'
                                />
                            </Form>
                            <Form>
                                <Form.Label title={passLabel} />
                                <Input
                                    type="password"
                                    placeholder="Type a strong password..."
                                    className={`input-bordered ${passExists ? 'input-error' : ''}`}
                                    value={pass}
                                    onChange={e => setPass(e.target.value)}
                                    name='password'
                                />
                                <label className='label'>
                                    <Link href="/" className="label-text-alt" hover>
                                        Already have an account? Login here →
                                    </Link>
                                </label>
                            </Form>
                            <Form className="mt-6">
                                <Button color='info' variant='outline' className='no-animation' onClick={handleSubmit}>Sign Up</Button>
                            </Form>
                        </Card.Body>
                    </Card>
                </Hero.Content>
            </Hero>
        </div>
        </>
    )
}

export default SignUp
