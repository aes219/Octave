import axios from "axios"
import { useEffect, useState } from "react";
import { Alert, Button, Hero, Navbar } from "react-daisyui"
import Loading from "../components/Loading";

const api = require("../config.json").SERVER_URL

function Inbox() {

    const [loading, setLoading] = useState(true)

    const client = window.localStorage.getItem("mail")

    const [notifications, setNotifications] = useState([])

    const acceptFriendRequest = async (friend) => {
        setNotifications(notifications.filter(notification => notification.key === friend));
        const response = await axios.get(`${api}/users/profile/friends?email=${client}`);
        const values = response.data.values;
        let array = JSON.parse(values);
        array.push(friend);
        await axios.put(`${api}/users/profile/friends?email=${client}&friends=${JSON.stringify(array)}`)
            .then(() => {
                axios.delete(`${api}/users/notifs?email=${client}&notif=${friend}`);
            })
            .catch(error => {
                console.log("Error accepting friend request:", error);
            });
    };

    const denyFriendRequest = async (friend) => {
        setNotifications(notifications.filter(notification => notification.key === friend))
        await axios.delete(`${api}/users/notifs?email=${client}&notif=${friend}`)
            .catch(error => {
                console.log("Error denying friend request:", error);
            });
    };

    const fetchNotifs = async () => {
        try {
            const response = await axios.get(`${api}/users/notifs?email=${client}`)
            const values = response.data.values
            if (!values.length || values[0].notifications === "[]")
                setNotifications(
                    <Alert>
                        <div>
                            <h3>No notifications yet</h3>
                            <div className="text-xs">Come back later</div>
                        </div>
                    </Alert>
                )
            else {
                const Data = JSON.parse(values[0].notifications)

                const alertPromises = Data.map(async (notif) => {
                    const email = notif
                    const response = await axios.get(`${api}/users/profile?email=${email}`)
                    const values = response.data.values
                    return (
                        <Alert
                            icon={
                                <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><path d="M16 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="8.5" cy="7" r="4"></circle><line x1="20" y1="8" x2="20" y2="14"></line><line x1="23" y1="11" x2="17" y2="11"></line></svg>
                            }
                            key={values[0].email}
                        >
                            <div>
                                <h3>New friend request!</h3>
                                <div className="text-xs">{values[0].nickname} added you as a friend</div>
                            </div>
                            <div className="!flex !space-x-4">
                                <Button size="sm" color="success" onClick={() => acceptFriendRequest(values[0].email)}>Accept</Button>
                                <Button size="sm" onClick={() => denyFriendRequest(values[0].email)}>Deny</Button>
                            </div>
                        </Alert>
                    )
                })
                const alertData = await Promise.all(alertPromises)
                setNotifications(alertData)
            }

        } catch (e) {
            console.log("Error fetchNotifs():\n", e)
        } finally {
            setLoading(false)
        }
    }

    // eslint-disable-next-line react-hooks/exhaustive-deps
    useEffect(() => { fetchNotifs() }, [client])

    if (loading) return <Loading />

    return (
        <div>
            <Navbar>
                <Navbar.Start>
                    <div className="flex-none">
                        <Button
                            shape="square"
                            color="ghost"
                            onClick={() => window.location = "/"}
                        >
                            <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round"><circle cx="12" cy="12" r="10" /><path d="M12 8l-4 4 4 4M16 12H9" /></svg>
                        </Button>
                    </div>
                </Navbar.Start>
                <Navbar.Center>
                    <h1 className="!text-2xl">Inbox</h1>
                </Navbar.Center>
            </Navbar>
            <Hero>
                <Hero.Content className="text-center">
                    <div className="flex flex-wrap gap-2 justify-center">
                        {notifications}
                    </div>
                </Hero.Content>
            </Hero>
        </div>
    )
}

export default Inbox