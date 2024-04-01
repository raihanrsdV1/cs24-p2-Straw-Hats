import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./admin.css"
import DeleteBox from './DeleteBox';


const Roles = () => {
    const [roles, setRoles] = useState([]);
    const [roleName, setRoleName] = useState('');
    const [deleteMode, setDeleteMode] = useState(false);
    const [selectedRole, setSelectedRole] = useState(null);

    useEffect(()=>{
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
    }, []);

    const handleSubmit = async (e) => {
        try{
            e.preventDefault();
            const body = JSON.stringify({ roleName });
            const response = await fetch(`http://localhost:8000/rbac/roles`, {
                method: 'POST',
                headers: { 
                    token: localStorage.token,
                    "Content-Type": "application/json"
                },
                body: body
            });
            
            const parseRes = await response.json();
            if(parseRes.success){
                setRoles(parseRes.roles);
                toast.success(parseRes.message);
            }
            else{
                toast.error(parseRes.message);
            }
            
        }
        catch(err){
            console.error(err.message);
        }
    }


    const handleDelete = async (id) => {
        try{
            const response = await fetch(`http://localhost:8000/rbac/roles/${id}`, {
                method: 'DELETE',
                headers: { token: localStorage.token }
            });

            const parseRes = await response.json();
            if(parseRes.success){
                setRoles(parseRes.roles);
                toast.success(parseRes.message);
            }
            else{
                toast.error(parseRes.message);
            }
            setDeleteMode(false);
        }
        catch(err){
            console.error(err.message);
        }
    }

    const closeDelete = () => {
        setDeleteMode(false);
        setSelectedRole(null);
    }

    const handleDeleteClick = (id) => {
        setDeleteMode(true);
        setSelectedRole(id);
    }
    return (
        <Fragment>
            <form onSubmit={handleSubmit} style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignContent: 'space-evenly',
                width: '90%',
                margin: '5%'
            }}>
                <input type="text" 
                value={roleName} 
                onChange={(e) => setRoleName(e.target.value)} 
                className="form-control form-control-lg bg-color fs-6 m-3"
                placeholder='Enter Role Name'
                />
                <button type="submit"   
                class="btn btn-lg btn-success w-50  fs-6 m-3"
                >Add Role</button>
            </form>
            <table className='order-table'>
                <thead>
                    <tr>
                        <th>Role ID</th>
                        <th>Role Name</th>
                        <th>Edit</th>
                        <th>Delete</th>
                    </tr>
                </thead>
                <tbody>
                    {roles && roles.map(role => (
                        <tr key={role.id}>
                            <td style={{
                                backgroundColor: '#8f6ec5',
                            }}><button
                                style={{
                                    cursor: 'pointer',
                                    color: 'white',
                                    backgroundColor: 'transparent',
                                    border: 'none',
                                    width: '100%',
                                    height: '50px',
                                }}
                            >{role.role_id}</button></td>
                            <td>{role.role_name}</td>
                            <td><button className='btn btn-primary'>Edit</button></td>
                            <td><button className='btn btn-danger' onClick={() => handleDeleteClick(role.role_id)} >Delete</button></td>
                        </tr>
                    ))}
                </tbody>
            </table>
            {
                deleteMode && <DeleteBox message="Are you sure you want to delete this role?" deleteFunction={handleDelete} user_id={selectedRole} closeDelete={closeDelete} />
            }
        </Fragment>
    )
}

export default Roles;


