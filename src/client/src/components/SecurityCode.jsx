import { Hero, Card, Form, Input, Button } from 'react-daisyui'

function SecurityCode({ display, label, value, change, submission }) {
    return (
        <>
            <div id="otpcomponent" style={{ display: display, margin: 170 }}>
                <h1 align="center" className='text-3xl m-10'>
                    <strong>
                        {label}
                    </strong>
                </h1>
                <Form onSubmit={submission}>
                    <Hero>
                        <Hero.Content className="flex-col lg:flex-row-reverse">
                            <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                                <Card.Body>
                                    <Input
                                        type='number'
                                        value={value}
                                        onChange={change}
                                    />
                                    <Button color='info' variant='outline' className='no-animation' type='submit'>Submit</Button>
                                </Card.Body>
                            </Card>
                        </Hero.Content>
                    </Hero>
                </Form>
            </div>
        </>
    )
}

export default SecurityCode