import { useEffect, useState, useRef } from 'react';
import { ChatBubble, Navbar, Textarea } from 'react-daisyui';
import axios from 'axios';
import Ably from 'ably';
import { v4 as uuidv4 } from 'uuid'

const api = require("../config.json").SERVER_URL;

function ChatWindow({ recipientNickname, recipientEmail }) {
    const client = window.localStorage.getItem('mail');
    const [chats, setChats] = useState([]);
    const [message, setMessage] = useState('');
    const [channel, setChannel] = useState(null);

    const chatContainerRef = useRef(null);

    useEffect(() => {
        if (chatContainerRef.current)
            chatContainerRef.current.scrollTop = chatContainerRef.current.scrollHeight;
    }, [chats])

    useEffect(() => {
        const ablyRealtime = new Ably.Realtime(require("../config.json").ABLY_TOKEN);

        ablyRealtime.connection.once("connected", () => {
            const chatChannel = ablyRealtime.channels.get(`chat`);
            setChannel(chatChannel);

            chatChannel.subscribe((msg) => {
                setChats((prevChats) => {
                    const messageExists = prevChats.some(chat => chat.id === msg.data.id);
                    if (!messageExists) {
                        return [...prevChats, msg.data];
                    }
                    return prevChats;
                });
            });
        });


        return () => {
            if (ablyRealtime) ablyRealtime.connection.close();
        };
    }, [client, recipientEmail]);

    useEffect(() => {
        fetchChats();
    }, [recipientEmail]);

    async function fetchChats() {
        try {
            const response = await axios.get(`${api}/users/messages?client=${client}&recipient=${recipientEmail}`);
            setChats(response.data);
        } catch (e) {
            console.log(e);
        }
    }

    const getCurrentTimestamp = () => {
        const currentDate = new Date();
        const hours = String(currentDate.getHours()).padStart(2, '0');
        const minutes = String(currentDate.getMinutes()).padStart(2, '0');
        const day = currentDate.getDate();
        const month = currentDate.toLocaleString('default', { month: 'short' });
        const year = currentDate.getFullYear();
        return `Sent at ${hours}:${minutes} on ${day} ${month} ${year}`;
    };

    const handleSubmit = async (e) => {
        e.preventDefault();
        if (message) {
            const timestamp = getCurrentTimestamp();
            const id = uuidv4();
            const newMessage = { message, client, timestamp, id };

            setChats((prevChats) => [...prevChats, newMessage]);
            setMessage('');

            await axios.post(`${api}/users/messages?client=${client}&recipient=${recipientEmail}&message=${message}&timestamp=${timestamp}`);
            channel.publish('newMessage', newMessage);
        }
    };

    if (!recipientNickname) return null;

    return (
        <div style={{ marginLeft: 250, marginRight: 20, zIndex: 1 }}>
            <div>
                <Navbar>
                    <Navbar.Center style={{ alignItems: 'center' }}>
                        <label className="normal-case text-xl">
                            {recipientNickname || 'Chats'}
                        </label>
                    </Navbar.Center>
                </Navbar>
            </div>

            <div
                className='chats'
                style={{ maxHeight: '75vh', overflowY: 'auto' }}
                ref={chatContainerRef}
            >
                {chats.map((chatMessage, index) => (
                    <ChatBubble key={index} end={chatMessage.client === client}>
                        <ChatBubble.Message>{chatMessage.message}</ChatBubble.Message>
                        <ChatBubble.Footer>{chatMessage.timestamp}</ChatBubble.Footer>
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

export default ChatWindow;