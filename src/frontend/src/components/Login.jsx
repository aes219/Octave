import axios from 'axios'
import { useState } from 'react'
import { Hero, Card, Form, Input, Link, Button } from 'react-daisyui'
const api = `http://localhost:8000`;
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
            axios.post(`${api}/mail?recipient=${email}&subject=One+Time+Password&msg=${otpCode}`)
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
        if(!newpass)
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
            else window.location = '/dash';
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

            <div id="forgotpasscomponent" style={{ display: forgotpasscomponent, margin: 170 }}>
                <h1 align="center" className='text-3xl m-10'>
                    <strong>
                        Enter a new password
                    </strong>
                </h1>
                <Hero>
                    <Hero.Content className="flex-col lg:flex-row-reverse">
                        <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <Card.Body>
                                <Form>
                                    <Input
                                        type='password'
                                        value={newpass}
                                        className={`input-bordered ${(newPassexists) ? `input-error` : ``}`}
                                        onChange={e => setNewpass(e.target.value)}
                                    />
                                </Form>
                                <Button color='info' variant='outline' className='no-animation' onClick={changePassword}>Submit</Button>
                            </Card.Body>
                        </Card>
                    </Hero.Content>
                </Hero>
            </div>

            <div id='logincomponent' style={{ display: logincomponent }}>
                <h1 align="center" className='text-3xl m-10'>
                    <strong>
                        Welcome back
                        <br />
                        Please Login below:
                    </strong>
                </h1>
                <Hero>
                    <Hero.Content className="flex-col lg:flex-row-reverse">
                        <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <Card.Body>
                                <Card.Title tag="h1">{cardTitle}</Card.Title>
                                <Form>
                                    <Form.Label title={emailLabel} />
                                    <Input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className={`input-bordered ${(emailExists) ? `input-error` : ``}`}
                                        value={email}
                                        onChange={e => setEmail(e.target.value)}
                                    />
                                </Form>
                                <Form>
                                    <Form.Label title={passLabel} />
                                    <Input
                                        type="password"
                                        placeholder="Type a strong password..."
                                        className={`input-bordered ${(passExists) ? `input-error` : ``}`}
                                        value={pass}
                                        onChange={e => setPass(e.target.value)}
                                    />
                                    <label className="label">
                                        <Link href="#" className="label-text-alt" hover onClick={resetPassword}>
                                            Forgot Password?
                                        </Link>
                                    </label>
                                    <label className='label'>
                                        <Link href="/signup" className="label-text-alt" hover>
                                            New to Octave? SignUp now →
                                        </Link>
                                    </label>
                                </Form>
                                <Form className="mt-6">
                                    <Button color='info' variant='outline' className='no-animation' onClick={handleSubmit}>Login</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Hero.Content>
                </Hero>
            </div>
        </>
    )
}

export default Login