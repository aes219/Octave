import axios from 'axios'
import { useEffect } from "react";
import { useState } from "react";
import ProfileSetup from '../components/ProfileSetup';
import Sidebar from '../components/Sidebar';
import ChatWindow from '../components/ChatWindow';
const api = `http://localhost:8000`;

function Dashboard() {
    const [recipientNick, setRecipientNick] = useState('')
    const [recipientEmail, setRecipientEmail] = useState('')
    if (!window.localStorage.getItem('mail') && !window.localStorage.getItem('e'))
        window.location = '/login'
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
    }, [])

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
            const email = window.localStorage.getItem('e')

            axios.post(`${api}/users/profiles`, {
                email: email,
                name: name,
                bio: bio,
            })
                .then(
                    window.localStorage.removeItem('e'),
                    window.localStorage.setItem('mail', email),
                    setProfileComponent('none'),
                    setDashComponent('block')
                )
        }

    }

    const handleRecipientChange = (nickname, email) => {
        setRecipientNick(nickname)
        setRecipientEmail(email);
    }

    
    return (
        <>
            <ProfileSetup
                display={profilecomponent}
                name={name}
                nChange={e => setName(e.target.value)}
                nExists={nameExists}
                bio={bio}
                bChange={e => setBio(e.target.value)}
                bExists={bioExists}
                click={accountSetup}
            />
            <div display={{ display: dashcomponent }}>
                <div style=
                {{
                    display: 'flex',
                    flexDirection: 'column',
                }}>
                    <Sidebar onRecipientChange={handleRecipientChange} style={{ display: dashcomponent }}/>
                    <ChatWindow recipientNickname={recipientNick} recipientEmail={recipientEmail} style={{ display: dashcomponent }}/>
                </div>
            </div>
        </>
    )
}

export default Dashboard