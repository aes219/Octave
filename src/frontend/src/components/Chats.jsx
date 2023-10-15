import React, { useState, useEffect } from 'react';
import axios from 'axios';
import { Button, Menu } from 'react-daisyui';
const api = `http://localhost:8000`;

function Chats() {
    const [friends, setFriends] = useState([]);
    const [menuItems, setMenuItems] = useState([]);

    async function fetchFriends() {
        const response = await axios.get(`${api}/users/profile/friends?email=${window.localStorage.getItem('mail')}`);
        const frnds = response.data.values;
        if(!frnds) setFriends(['Start'])
        setFriends(frnds);
    }

    useEffect(() => {
        fetchFriends();
    }, []);

    useEffect(() => {
        async function fetchMenuItems() {
            const requests = friends.map(async (friend) => {
                const r = await axios.get(`${api}/users/profile?email=${friend}`);
                return r.data.values[0].nickname;
            });

            const nicknames = await Promise.all(requests);
            const items = nicknames.map((nickname) => (
                <Menu.Item key={nickname}>
                    <Button>
                        {nickname}
                    </Button>
                </Menu.Item>
            ));

            setMenuItems(items);
        }

        fetchMenuItems();
    }, [friends]);

    return (
        <>
            <div className='rounded-lg'>
                <Menu className="bg-base-200" style={{ width: 300, borderRadius: 10 }}>
                    {menuItems}
                </Menu>
            </div>
        </>
    );
}

export default Chats;
