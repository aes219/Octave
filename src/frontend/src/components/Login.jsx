import axios from 'axios'
import { useState } from 'react'
import { Hero, Card, Form, Input, Link, Button } from 'react-daisyui'
const api = `http://localhost:8000`;
function Login() {

    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [emailLabel, setEmailLabel] = useState('Email')
    const [passLabel, setPassLabel] = useState('Password')
    const [emailExists, setEmailExists] = useState(false)
    const [passExists, setPassExists] = useState(false)
    const [cardTitle, setCardTitle] = useState('')

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
        <div>
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
                                    <Link href="#" className="label-text-alt" hover>
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
    )
}

export default Login