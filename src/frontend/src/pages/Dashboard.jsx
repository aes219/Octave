import axios from 'axios'
import { useEffect } from "react";
import { useState } from "react";
import ProfileSetup from '../components/ProfileSetup';
import Sidebar from '../components/Sidebar';
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
            const e = window.localStorage.getItem('e')
            axios.post(`${api}/users/profiles?email=${e}&nick=${name}&bio=${bio}`)
                .then(
                    window.localStorage.removeItem('e'),
                    window.localStorage.setItem('mail', e),
                    setProfileComponent('none'),
                    setDashComponent('block')
                )
        }

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
            <div style={{ display: dashcomponent }}>
                <Sidebar/>
            </div>
        </>
    )
}

export default Dashboard