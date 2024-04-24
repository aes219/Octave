import { useEffect, useState } from 'react';
import { Button, Navbar, Input, Join, ChatBubble } from 'react-daisyui';
import axios from 'axios'
const api = `http://localhost:8000`;

function ChatWindow({ recipientNickname, recipientEmail }) {
    const client = window.localStorage.getItem('mail')
    const [chats, setChats] = useState([])

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
        fetchChats()
    }, [recipientEmail])

    const chatBubbles = chats.map((message, index) => (
        <ChatBubble key={index} end={message.client === client}>
            <ChatBubble.Message>{message.message}</ChatBubble.Message>
        </ChatBubble>
    ))

    return (
        <div style={{ margin: 250, marginTop: 0, zIndex: 1 }}>
            <div>
                <Navbar>
                    <Navbar.Center style={{ alignItems: 'center' }}>
                        <Button tag="a" color="ghost" className="normal-case text-xl">
                            {recipientNickname || "Chats"}
                        </Button>
                    </Navbar.Center>
                </Navbar>
            </div>
            <div className='chats'>
                {chatBubbles}
            </div>
            <div>
                <div style={{ position: 'fixed', bottom: 5, left: 0, right: 0 }}>
                    <Join>
                        <Input style={{ width: 1000, marginLeft: 260 }} placeholder='Send a message' className='join-item' />
                        <Button className='join-item rounded-s' color='success'>
                            <svg className='h-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'round' }}>
                                <path stroke-linecap="round" stroke-linejoin="round" d="M6 12 3.269 3.125A59.769 59.769 0 0 1 21.485 12 59.768 59.768 0 0 1 3.27 20.875L5.999 12Zm0 0h7.5" />
                            </svg>
                        </Button>
                    </Join>
                </div>
            </div>
        </div>
    )
}

export default ChatWindow