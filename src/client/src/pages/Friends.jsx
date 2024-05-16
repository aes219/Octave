import { useEffect, useState } from "react"
import { Button, Card, Hero, Input } from "react-daisyui"
import axios from "axios"
import Loading from "../components/Loading";
const api = `http://localhost:8000`;

function Friends() {

    const [reload, forceReload] = useState()

    const [cards, setCards] = useState([])

    const [loading, setLoading] = useState(true)

    const client = window.localStorage.getItem("mail")

    const removeFriend = async (friend) => {
        try {
            await axios.delete(`${api}/users/profile/friends?email=${client}&friend=${friend}`)
            forceReload(Math.random())
        } catch (e) {
            console.log("Error removing friend: ", e)
        }
    }
    const fetchData = async () => {
        try {
            const response = await axios.get(`${api}/users/profile/friends?email=${client}`)
            const values = response.data.values
            const list = JSON.parse(values)

            const cardPromises = list.map(async (friend) => {
                const response = await axios.get(`${api}/users/profile?email=${friend}`)
                const values = response.data.values
                return (
                    <div key={friend} className="flex flex-wrap gap-2 justify-center">
                        <Card className="w-96 bg-neutral text-neutral-content">
                            <Card.Body className="card-body">
                                <Card.Title tag="h2">{values[0].nickname}</Card.Title>
                                <p>{values[0].bio}</p>
                                <Card.Actions className="justify-end">
                                    <Button color="error" onClick={() => removeFriend(values[0].email)}>Remove Friend</Button>
                                </Card.Actions>
                            </Card.Body>
                        </Card>
                    </div>
                )
            })

            const cardsData = await Promise.all(cardPromises)
            setCards(cardsData)
        } catch (error) {
            console.error("Error fetching data:", error)
        } finally {
            setLoading(false)
        }
    }

    useEffect(() => {
        fetchData()
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, [reload])

    if (loading) return <Loading />

    return (
        <Hero>
            <Hero.Content>
                <div className="grid grid-cols-1 items-center">
                    <Hero>
                        <Hero.Content className="text-center">
                            <div className="max-w-md">
                                <h1 className="text-5xl font-bold"><b>Add a friend</b></h1>
                                <Input className="w-full" placeholder="bro@club.xyz" />
                                <Button color="primary" style={{ margin: 10 }}>Send Request</Button>
                                <Button color="info" style={{ margin: 10 }} onClick={() => { window.location = "/" }}>Back</Button>
                            </div>
                        </Hero.Content>
                    </Hero>
                    <div className="flex flex-wrap gap-2 justify-center">
                        {cards}
                    </div>
                </div>
            </Hero.Content>
        </Hero>
    )
}

export default Friends
