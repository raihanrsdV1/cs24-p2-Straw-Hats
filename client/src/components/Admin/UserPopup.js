import React, { Fragment,useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserImg from '../../image/user.png';


const UserPopup = ({user_id, close, openEditPopUp, openDeletePopUp}) =>{

    const [user_data, setUser_data] = useState({});

    useEffect(()=>{
        const getUser = async() =>{
            try {
                const response = await fetch(`http://localhost:8000/users/${user_id}`, {
                    method: 'GET',
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setUser_data(parseRes);

            } catch (err) {
                console.error(err.message);
            }
        }

        getUser();
    }, [])


    


    return (
        <Fragment>
            
            <div className="cancel-form-overlay" >
                <div className="cancel-form-container">

                    <h1 className='cancel-box-heading' style={{ marginBottom: '0px'}}>{user_data.role_name + ' info'}</h1>
                    <hr style={{
                        marginBottom: '0px',
                    }}></hr>
                    {   user_data? 
                        <div className='assigned-box-content'>
                        {
                            user_data.profile_img === 'user.png'?
                            <img src={UserImg} className='profile-img' />:
                            <img src={UserImg} className='profile-img' /> 
                        }
                        <hr></hr>
                        <div className='assigned-box-content-item'>
                            <p>Username: {user_data.username}</p>
                        </div>
                        <div className='assigned-box-content-item'>
                            <p>Full Name: {user_data.full_name}</p>
                        </div>
                        <div className='assigned-box-content-item'>
                            <p>Email: {user_data.email}</p>
                        </div>
                        <div className='assigned-box-content-item'>
                            <p>Contact No: {user_data.contact_no}</p>
                        </div>

                        {/* { user_data.staff_status === 'admin' &&
                            <div className='assigned-box-content-item'>
                                <p>Hire Date: {moment(user_data.hire_date).format('MMMM DD, YYYY')}</p>
                            </div>
                        } */}
                    </div> :
                    <div className='assigned-box-content'>
                        No Data
                    </div>
                    
                    }

                <div className='btn_bar'>
                    <button type="button" className='cancel-box-button' onClick={() => openEditPopUp()} >Update</button>
                    <button type="button" className='cancel-box-button' onClick={() => openDeletePopUp()} >Delete</button>
                    <button type="button" className='cancel-box-button' onClick={() => close()} >Close</button>
                    
                    
                </div>
                </div>
            </div>
        
        </Fragment>
    )
}

export default UserPopup;