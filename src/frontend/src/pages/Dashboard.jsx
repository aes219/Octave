import axios from 'axios'
import { useEffect } from "react";
import { useState } from "react";
import { Hero, Input, Card, Button, Textarea, Form } from "react-daisyui";
const api = `http://localhost:8000`;

function Dashboard() {
    const [profilecomponent, setProfileComponent] = useState('')
    const [dashcomponent, setDashComponent] = useState('')
    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [nameExists, setNameExists] = useState(true)
    const [bioExists, setBioExists] = useState(true)

    useEffect(() => {
        if (window.localStorage.getItem("e")) {
            setDashComponent('none')
            setProfileComponent('block')
        }
        else {
            setDashComponent('block')
            setProfileComponent('none')
        }
    })

    const accountSetup = () => {
        if (!name && !bio) {
            setNameExists(false)
            setBioExists(false)
        } else if (!name) {
            setNameExists(false)
            setBioExists(true)
        } else if (!bio) {
            setBioExists(false)
            setNameExists(true)
        } else {
            axios.post(`${api}/users/profiles?email=${window.localStorage.getItem('e')}&nick=${name}&bio=${bio}`)
            .then(
                window.localStorage.removeItem('e'),
                setProfileComponent('none'),
                setDashComponent('block')
            )
        }

    }
    return (
        <>
            <div id="profilecomponent" style={{ display: profilecomponent, margin: 80 }}>
                <h1 align="center" className='text-3xl m-10'>
                    <strong>
                        Please finish your account setup
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
                                        onChange={e => setName(e.target.value)}
                                        className={`input-bordered ${(nameExists) ? `` : `input-error`}`}
                                    />
                                    <Form.Label title="About Me" />
                                    <Textarea
                                        value={bio}
                                        onChange={e => setBio(e.target.value)}
                                        style={{
                                            height: 150,
                                            width: 300
                                        }}
                                        className={`input-bordered ${(bioExists) ? `` : `textarea-error`}`}
                                    />
                                </Form>
                                <Button color='info' variant='outline' className='no-animation' onClick={accountSetup}>Done!</Button>
                            </Card.Body>
                        </Card>
                    </Hero.Content>
                </Hero>
            </div>
            <div style={{display: dashcomponent}}>
                <Hero>
                    <Hero.Content>
                        <h1 className="text-9xl font-bold">Dashboard</h1>
                    </Hero.Content>
                </Hero>
            </div>
        </>
    )
}

export default Dashboard