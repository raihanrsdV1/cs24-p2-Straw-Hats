import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./admin.css"



const Users = () => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);

    useEffect(()=>{
        const getAllUsers = async() =>{
            try {
                const response = await fetch("http://localhost:8000/users", {
                    method: "GET",
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setAllUsers(parseRes);
            } catch (error) {
                console.error(error.message);
            }
        }
    }, [])


    return (
        <Fragment>
            <table className='order-table'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact No.</th>
                        <th>User Role</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers && allUsers.map(user => (
                        <tr key={user.user_id}>
                            <td><a
                                style={{
                                    cursor: 'pointer',
                                    color: '#8f6ec5'
                                }}
                            >{user.user_id}</a></td>
                            <td>{user.full_name}</td>
                            <td>{user.email}</td>
                            <td>{user.contact_no}</td>
                            <td>{user.role_name}</td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </Fragment>
    )
}

export default Users;
