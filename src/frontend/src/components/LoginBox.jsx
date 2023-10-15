import { Hero, Card, Form, Input, Button, Link } from 'react-daisyui'

function LoginBox({ display, title, eLabel, eExists, email, eChange, pLabel, pExists, password, pChange, fpClick, click }) {
    return (
        <>
            <div id='logincomponent' style={{ display: display }}>
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
                                <Card.Title tag="h1">{title}</Card.Title>
                                <Form>
                                    <Form.Label title={eLabel} />
                                    <Input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className={`input-bordered ${(eExists) ? `input-error` : ``}`}
                                        value={email}
                                        onChange={eChange}
                                    />
                                </Form>
                                <Form>
                                    <Form.Label title={pLabel} />
                                    <Input
                                        type="password"
                                        placeholder="Type a strong password..."
                                        className={`input-bordered ${(pExists) ? `input-error` : ``}`}
                                        value={password}
                                        onChange={pChange}
                                    />
                                    <label className="label">
                                        <Link href="#" className="label-text-alt" hover onClick={fpClick}>
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
                                    <Button color='info' variant='outline' className='no-animation' onClick={click}>Login</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Hero.Content>
                </Hero>
            </div>
        </>
    )
}

export default LoginBox