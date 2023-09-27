function SignupBox({ display, eLabel, eExists, email, eChange, pLabel, pExists, password, pChange, click }) {
    return (
        <>
            <div id="sigupcomponent" style={{ display: display, margin: 80 }}>
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
                                    <Form.Label title={eLabel} />
                                    <Input
                                        type="email"
                                        placeholder="hello@example.com"
                                        className={`input-bordered ${eExists ? 'input-error' : ''}`}
                                        value={email}
                                        onChange={eChange}
                                        name='email'
                                    />
                                </Form>
                                <Form>
                                    <Form.Label title={pLabel} />
                                    <Input
                                        type="password"
                                        placeholder="Type a strong password..."
                                        className={`input-bordered ${pExists ? 'input-error' : ''}`}
                                        value={password}
                                        onChange={pChange}
                                        name='password'
                                    />
                                    <label className='label'>
                                        <Link href="/" className="label-text-alt" hover>
                                            Already have an account? Login here →
                                        </Link>
                                    </label>
                                </Form>
                                <Form className="mt-6">
                                    <Button color='info' variant='outline' className='no-animation' onClick={click}>Sign Up</Button>
                                </Form>
                            </Card.Body>
                        </Card>
                    </Hero.Content>
                </Hero>
            </div>
        </>
    )
}

export default SignupBox