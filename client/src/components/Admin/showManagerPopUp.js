import React, { Fragment,useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';



const UserPopup = ({landfill_id, close}) =>{

    const [managers, setManagers] = useState([]);

    useEffect(() => {
        const getManagers = async () => {
            try {
                const response = await fetch(`http://localhost:8000/landfill/assigned/${landfill_id}`, {
                    method: "GET",
                    headers: { token: localStorage.token }
                });
    
                const parseRes = await response.json();
                setManagers(parseRes);
            } catch (err) {
                console.error(err.message);
            }
        }

        getManagers();
    }, []);

    


    


    return (
        <Fragment>
            
            <div className="cancel-form-overlay" >
                <div className="cancel-form-container" style={{width: 'auto'}}>
                <table className='order-table' style={{
                    color: 'black'
                }}>
                <thead>
                    <tr>
                        <th>User ID</th>
                        <th>Username</th>
                        <th>Email</th>
                        <th>Contact No.</th>
                        <th>Full Name</th>
                        
                    </tr>
                </thead>
                <tbody>
                    {managers && managers.map(user => (
                        <tr key={user.manager_id}>
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
                            >{user.manager_id}</button></td>
                            <td>{user.username}</td>
                            <td>{user.email}</td>
                            <td>{user.contact_no}</td>
                            <td>{user.full_name}</td>
                            
                        </tr>
                    ))}
                </tbody>
            </table>
            <div className='btn_bar'>
                    <button type="button" className='cancel-box-button mt-4' onClick={() => close()} >Close</button>
                </div>

                </div>
            </div>
        
        </Fragment>
    )
}

export default UserPopup;