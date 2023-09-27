import { Hero, Card, Form, Input, Button } from 'react-daisyui'

function ForgotPassword({ display, value, exists, change, click }) {
    return (
        <>
            <div id="forgotpasscomponent" style={{ display: display, margin: 170 }}>
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
                                        value={value}
                                        className={`input-bordered ${(exists) ? `input-error` : ``}`}
                                        onChange={change}
                                    />
                                </Form>
                                <Button color='info' variant='outline' className='no-animation' onClick={click}>Submit</Button>
                            </Card.Body>
                        </Card>
                    </Hero.Content>
                </Hero>
            </div>
        </>
    )
}

export default ForgotPassword