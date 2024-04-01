import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./admin.css"
import UserPopup from './UserPopup';
import UserEditPopup from './UserEditPopUp';
import DeleteBox from './DeleteBox';




const Users = () => {
    const [user, setUser] = useState(null);
    const [allUsers, setAllUsers] = useState([]);
    const [selectedUser, setSelectedUser] = useState(null);
    const [showPopup, setShowPopup] = useState(false);
    const [editMode, setEditMode] = useState(false);
    const [deleteMode, setDeleteMode] = useState(false);
    const [roles, setRoles] = useState([]);

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

        const getRoles = async() =>{
            try {
                const response = await fetch(`http://localhost:8000/users/roles`, {
                    method: 'GET',
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setRoles(parseRes);

            } catch (err) {
                console.error(err.message);
            }
        }

        getRoles();

        getAllUsers();
    }, [])

    const showPopUpFunc = (user) => {
        setShowPopup(true);
        setSelectedUser(user.id);
    }

    const openEditPopup = () => {
        setEditMode(true);
        setShowPopup(false);
        setDeleteMode(false);
    }
    const closePopUp = () => {
        setShowPopup(false);
        setSelectedUser(null);
        setEditMode(false);
        setDeleteMode(false);
    }

    const openDeletePopup = () => {
        setDeleteMode(true);
        setShowPopup(false);
        setEditMode(false);
    }

    const deleteUser = async(user_id) => {
        try {
            const response = await fetch(`http://localhost:8000/users/${user_id}`, {
                method: "DELETE",
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            
            toast.success(parseRes);
            closePopUp();
            setAllUsers(allUsers.filter(user => user.id !== user_id));
            
        } catch (error) {
            console.error(error.message);
        }
    }

    const handleChange = async(user_id, e) => {
        try {
            const response = await fetch(`http://localhost:8000/users/${user_id}/roles`, {
                method: "PUT",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify({role_id: e.target.value})
            });

            const parseRes = await response.json();
            toast.success(parseRes.message);
            setAllUsers(allUsers.map(user => user.id === user_id ? {...user, role_id: parseRes.user.role_id} : user));
            console.log(e.target.value);
            
        } catch (error) {
            console.error(error.message);
        }
    }

    return (
        <Fragment>

            <table className='order-table'>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact No.</th>
                        <th>Full Name</th>
                        <th>User Role</th>
                    </tr>
                </thead>
                <tbody>
                    {allUsers && allUsers.map(user => (
                        <tr key={user.id}>
                            <td style={{
                                backgroundColor: '#8f6ec5',
                            }}><button onClick={() => showPopUpFunc(user)} 
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                    height: '50px',
                                }}
                            >{user.id}</button></td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.contact_no}</td>
                            <td>{user.full_name}</td>

                            <td>
                            <select value={user.role_id? user.role_id : 0} className='admin-select' onChange={(e)=>handleChange(user.id, e)}>
                                <option value={'0'}>Unassigned</option>
                                {roles && roles.map(role => (
                                    <option key={role.role_id} value={role.role_id}>{role.role_name}</option>
                                ))}
                            </select>
                                
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {
                showPopup && selectedUser &&  <UserPopup close={closePopUp} user_id={selectedUser} openEditPopUp={openEditPopup} openDeletePopUp={openDeletePopup} />
            }

            {
                editMode && <UserEditPopup close={closePopUp} user_id={selectedUser} />
            }

            {
                deleteMode && <DeleteBox message="Are you sure you want to delete this?" closeDelete={closePopUp} deleteFunction={deleteUser}  user_id={selectedUser} />
            }
        </Fragment>
    )
}

export default Users;
