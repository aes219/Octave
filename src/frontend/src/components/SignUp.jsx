import { useState } from 'react'
import { Hero, Card, Form, Input, Link, Button } from 'react-daisyui'
const api = `https://sheetdb.io/api/v1/hm4a4crnu81v7`;

function SignUp() {
    const [email, setEmail] = useState('')
    const [pass, setPass] = useState('')
    const [emailLabel, setEmailLabel] = useState('Email')
    const [passLabel, setPassLabel] = useState('Password')
    const [emailExists, setEmailExists] = useState(false)
    const [passExists, setPassExists] = useState(false)

    async function createAccount(email, password) {
        await fetch(`${api}`, {
            method: 'POST',
            headers: {
                'Accept': 'application/json',
                'Content-Type': 'application/json'
            },
            body: JSON.stringify(
                [
                    {
                        'email': email,
                        'password': password,
                    }
                ]
            )
        })
            .then((res) => {
                console.log(res)
                window.location = '/dash'
            })
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
                createAccount(email, pass)
        }
    }
    return (
        <div>
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
    )
}

export default SignUp
