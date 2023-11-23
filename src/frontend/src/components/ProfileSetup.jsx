import { Hero, Card, Form, Input, Button, Textarea } from 'react-daisyui'

function ProfileSetup({ display, name, nChange, nExists, bio, bChange, bExists, click }) {
    return (
        <div id="profilecomponent" style={{ display: display, margin: 80 }}>
            <h1 align="center" className='text-3xl m-10'>
                <strong>
                    Finish Your Profile
                </strong>
            </h1>
            <Hero>
                <Hero.Content className="flex-col lg:flex-row-reverse">
                    <Card className="flex-shrink-0 w-full max-w-sm shadow-2xl bg-base-100">
                        <Card.Body>
                            <Form>
                                <Form.Label title="Nickname" />
                                <Input
                                    type='text'
                                    value={name}
                                    onChange={nChange}
                                    className={`input-bordered ${(nExists) ? `` : `input-error`}`}
                                />
                                <Form.Label title="About Me" />
                                <Textarea
                                    value={bio}
                                    onChange={bChange}
                                    style={{
                                        height: 150,
                                        width: 300
                                    }}
                                    className={`input-bordered ${(bExists) ? `` : `textarea-error`}`}
                                />
                            </Form>
                            <Button color='info' variant='outline' className='no-animation' onClick={click}>Done!</Button>
                        </Card.Body>
                    </Card>
                </Hero.Content>
            </Hero>
        </div>
    )
}

export default ProfileSetup