import { Hero, Card, Form, Input, Button } from 'react-daisyui'

function SecurityCode({ display, label, value, change, click }) {
    return (
        <>
            <div id="otpcomponent" style={{ display: display, margin: 170 }}>
                <h1 align="center" className='text-3xl m-10'>
                    <strong>
                        {label}
                    </strong>
                </h1>
                <Hero>
                    <Hero.Content className="flex-col lg:flex-row-reverse">
                        <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                            <Card.Body>
                                <Form>
                                    <Input
                                        type='number'
                                        value={value}
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

export default SecurityCode