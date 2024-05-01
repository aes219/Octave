import axios from "axios"
import { useEffect, useState } from "react"
import ProfileSetup from "../components/ProfileSetup"
const api = `http://localhost:8000`;


function Profile() {

    const [name, setName] = useState('')
    const [bio, setBio] = useState('')
    const [nameExists, setNameExists] = useState(true)
    const [bioExists, setBioExists] = useState(true)

    const client = window.localStorage.getItem("mail")

    useEffect(() => {
        async function fetchProfileData() {
            await axios.get(`${api}/users/profile?email=${client}`)
                .then(response => {
                    setName(response.data.values[0].nickname)
                    setBio(response.data.values[0].bio)
                })
        }

        fetchProfileData()
    }, [client])


    const handleClick = async () => {
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
            const email = window.localStorage.getItem('mail')

            axios.put(`${api}/users/profile?email=${email}&nickname=${name}&bio=${bio}`)
                .catch(e => console.log(e))
                .then(
                    window.location = '/'
                )
        }
    }
    return (
        <>
            <ProfileSetup
                display='block'
                name={name}
                nChange={e => setName(e.target.value)}
                nExists={nameExists}
                bio={bio}
                bChange={e => setBio(e.target.value)}
                bExists={bioExists}
                click={handleClick}
            />
        </>
    )
}

export default Profile