import { useEffect, useState } from 'react';
import { Button, Input, ChatBubble, Navbar, Join } from 'react-daisyui'; // Removed unnecessary imports
import axios from 'axios';

const api = `http://localhost:8000`;

function ChatWindow({ recipientNickname, recipientEmail }) {
    const client = window.localStorage.getItem('mail')
    const [chats, setChats] = useState([])
    const [message, setMessage] = useState('')
    const [counter, setCounter] = useState(0)

    async function fetchChats() {
        try {
            const response = await axios.get(`${api}/users/messages?client=${client}&recipient=${recipientEmail}`);
            if (response.data) {
                setChats(response.data);
            } else {
                setChats([]);
            }
        } catch (e) {
            console.log(e);
        }
    }

    useEffect(() => {
        fetchChats();
    }, [recipientEmail]);

    useEffect(() => {
        if (counter > 0) {
            fetchChats();
        }
    }, [counter]);

    const handleSubmit = async (e) => {
        e.preventDefault()
        if (message) {
            await axios.post(`${api}/users/messages?client=${client}&recipient=${recipientEmail}&message=${message}`)
            setMessage('')
            setCounter(prevCounter => prevCounter + 1)
            await fetchChats()
        }
    };

    return (
        <div style={{ marginLeft: 250, marginRight: 20, zIndex: 1 }}>
            <div>
                <Navbar>
                    <Navbar.Center style={{ alignItems: 'center' }}>
                        <Button tag="a" color="ghost" className="normal-case text-xl">
                            {recipientNickname || "Chats"}
                        </Button>
                    </Navbar.Center>
                </Navbar>
            </div>

            <div className='chats' style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {chats.map((message, index) => (
                    <ChatBubble key={index} end={message.client === client}>
                        <ChatBubble.Message>{message.message}</ChatBubble.Message>
                    </ChatBubble>
                ))}
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 250, right: 20 }}>
                <form onSubmit={handleSubmit}>
                    <Input
                        style={{ width: '100%', borderRadius: 10, margin: 5}}
                        placeholder='Send a message'
                        className='join-item msg-input'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                </form>
            </div>
        </div>
    );
}

export default ChatWindow
