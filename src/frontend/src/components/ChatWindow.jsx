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

    const handleSubmit = async () => {
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
                <Join style={{width: '100%', borderRadius: 10, margin: 5}}>
                    <Input
                        style={{ width: 'calc(100% - 80px)', marginRight: 10, }}
                        placeholder='Send a message'
                        className='join-item msg-input'
                        value={message}
                        onChange={e => setMessage(e.target.value)}
                    />
                    <Button className='join-item rounded-s' color='success' onClick={handleSubmit}>
                        <svg className='h-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'round' }}>
                            <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                        </svg>
                    </Button>
                </Join>
            </div>
        </div>
    );
}

export default ChatWindow
