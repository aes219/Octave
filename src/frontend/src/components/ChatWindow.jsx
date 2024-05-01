import { useEffect, useState } from 'react';
import { Button, ChatBubble, Navbar, Textarea } from 'react-daisyui';
import axios from 'axios';
import io from 'socket.io-client';

const api = `http://localhost:8000`;

function ChatWindow({ recipientNickname, recipientEmail }) {

    const client = window.localStorage.getItem('mail');
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [counter, setCounter] = useState(0);
    const [socket, setSocket] = useState(null);

    useEffect(() => {
        const newSocket = io(api);
        setSocket(newSocket);

        return () => {
            newSocket.close();
        };
    }, []);

    useEffect(() => {
        if (!socket) return;

        socket.on('message', (newMessage) => {
            setChats((prevChats) => [...prevChats, newMessage])
        })

        fetchChats();

        return () => {
            socket.off('message');
        };
    }, [socket])    

    async function fetchChats() {
        try {
            const response = await axios.get(`${api}/users/messages?client=${client}&recipient=${recipientEmail}`);
            if (response.data)
                setChats(response.data);
            else
                setChats([]);
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

    const getCurrentTimestamp = () => {
        const currentDate = new Date();
        const hours = currentDate.getHours();
        const minutes = currentDate.getMinutes();
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        const formattedTimestamp = `Sent at ${hours}:${minutes} on ${day} ${month} ${year}`;
        return formattedTimestamp;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message) {
            const timestamp = getCurrentTimestamp()
            await axios.post(`${api}/users/messages?client=${client}&recipient=${recipientEmail}&message=${message}&timestamp=${timestamp}`);
            
            if (socket)
                socket.emit('newMessage', { message, client, timestamp });
            
            setMessage('');
            setCounter((prevCounter) => prevCounter + 1);
            await fetchChats();
        }
    }

    return (
        <div style={{ marginLeft: 250, marginRight: 20, zIndex: 1 }}>
            <div>
                <Navbar>
                    <Navbar.Center style={{ alignItems: 'center' }}>
                        <Button tag="a" color="ghost" className="normal-case text-xl">
                            {recipientNickname || 'Chats'}
                        </Button>
                    </Navbar.Center>
                </Navbar>
            </div>

            <div className='chats' style={{ maxHeight: '75vh', overflowY: 'auto' }}>
                {chats.map((message, index) => (
                    <ChatBubble key={index} end={message.client === client}>
                        <ChatBubble.Message>{message.message}</ChatBubble.Message>
                        <ChatBubble.Footer>{message.footer}</ChatBubble.Footer>
                    </ChatBubble>
                ))}
            </div>
            <div style={{ position: 'absolute', bottom: 10, left: 250, right: 20 }}>
                <form onSubmit={handleSubmit}>
                    <Textarea
                        rows={1}
                        style={{ width: '100%', borderRadius: 10, margin: 5 }}
                        placeholder='Send a message'
                        className='join-item msg-input'
                        value={message}
                        onChange={(e) => setMessage(e.target.value)}
                        onKeyDown={(e) => {
                            if (e.key === 'Enter' && !e.shiftKey) {
                                e.preventDefault();
                                handleSubmit(e);
                            }
                        }}
                    />
                </form>
            </div>
        </div>
    );
}

export default ChatWindow