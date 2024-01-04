import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Menu, Drawer, Button } from 'react-daisyui';
const api = `http://localhost:8000`;

function Chats() {
    const [friends, setFriends] = useState([])
    const [menuItems, setMenuItems] = useState([])
    const [nick, setNick] = useState('')

    async function fetchFriends() {
        if (!window.localStorage.getItem('e')) {
            const response = await axios.get(`${api}/users/profile/friends?email=${window.localStorage.getItem('mail')}`)
            const frnds = response.data.values;
            setFriends(frnds)
        }
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        async function fetchMenuItems() {
            if (friends === '["Start"]') {
                setMenuItems(
                    <Menu.Item key="None" style={{ borderRadius: 3 }}>
                        None
                    </Menu.Item>
                )
            } else {
                const requests = friends.map(async (friend) => {
                    const r = await axios.get(`${api}/users/profile?email=${friend}`);
                    return r.data.values[0].nickname;
                });

                const nicknames = await Promise.all(requests);
                const items = nicknames.map((nickname) => (
                    <Menu.Item key={(nickname) ? nickname : "None"} style={{ borderRadius: 3 }}>
                        {(nickname) ? nickname : "None"}
                    </Menu.Item>
                ));

                setMenuItems(items)
            }

        }

        async function fetchNick() {
            if (!window.localStorage.getItem('e')) {
                const res = await axios.get(`${api}/users/profile?email=${window.localStorage.getItem('mail')}`)
                setNick(res.data.values[0].nickname)
            }
        }

        fetchNick()
        fetchMenuItems()

    }, [friends]);

    return (
        <>
            <div>
                <Drawer open={true} side={
                    <>
                        <Menu className="bg-base-200 rounded-sm text-lg h-full" style={{ width: 250 }}>
                            <Menu.Title className='text-xl' style={{ color: 'gray' }}>
                                <span className='flex justify-between'>
                                    {nick}
                                    <Button
                                        color='ghost' size='sm' className='btn-circle'
                                        onClick={
                                            async function logout() {
                                                window.localStorage.removeItem('mail')
                                                window.location = '/login'
                                            }
                                        }
                                    >
                                        <svg xmlns="http://www.w3.org/2000/svg" width="24" height="24" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'round', strokeLinejoin: 'round' }}><path d="M10 3H6a2 2 0 0 0-2 2v14c0 1.1.9 2 2 2h4M16 17l5-5-5-5M19.8 12H9" /></svg>
                                    </Button>
                                </span>
                            </Menu.Title>
                            <Menu.Item>
                                <Menu.Title className='text-lg'>Me</Menu.Title>
                                <Menu.Item style={{ borderRadius: 3 }}>
                                    <svg className='h-10' xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'round' }}><path d="M5.52 19c.64-2.2 1.84-3 3.22-3h6.52c1.38 0 2.58.8 3.22 3" /><circle cx="12" cy="10" r="3" /><circle cx="12" cy="12" r="10" /></svg>
                                    Profile
                                </Menu.Item>
                                <Menu.Item style={{ borderRadius: 3 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className="h-10" viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'round' }}><path d="M21.5 12H16c-.7 2-2 3-4 3s-3.3-1-4-3H2.5" /><path d="M5.5 5.1L2 12v6c0 1.1.9 2 2 2h16a2 2 0 002-2v-6l-3.4-6.9A2 2 0 0016.8 4H7.2a2 2 0 00-1.8 1.1z" /></svg>
                                    Inbox
                                </Menu.Item>
                                <Menu.Item style={{ borderRadius: 3 }}>
                                    <svg xmlns="http://www.w3.org/2000/svg" className='h-10' viewBox="0 0 24 24" fill="none" stroke="currentColor" style={{ strokeWidth: 2, strokeLinecap: 'square', strokeLinejoin: 'round' }}><path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"></path><circle cx="9" cy="7" r="4"></circle><path d="M23 21v-2a4 4 0 0 0-3-3.87"></path><path d="M16 3.13a4 4 0 0 1 0 7.75"></path></svg>
                                    Friends
                                </Menu.Item>
                            </Menu.Item>
                            <Menu.Item>
                                <Menu.Title className='text-lg'>Chats</Menu.Title>
                                {menuItems}
                            </Menu.Item>
                        </Menu>
                    </>
                } />
            </div>
        </>
    );
}

export default Chats
