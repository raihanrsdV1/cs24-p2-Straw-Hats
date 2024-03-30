
import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./admin.css"
import UserImg from "../../image/user.png";



const Dashboard = ({ setAuth, setIsAdmin, isAdmin }) =>{
    const [user, setUser] = useState({});
    const [pageState, setPageState] = useState(1);
    const navigate = useNavigate();


    const changePageState = (state) => {
        console.log("comes here");
        setPageState(state);
    }

    useEffect(()=>{
        console.log('admin updated');
    }, [isAdmin])

    const logOut = async() =>{
        localStorage.removeItem("token");
        setAuth(false);
        setIsAdmin(false);
    }


    return (
        <Fragment  key={isAdmin.toString()}>
            <div className='main-div'>
                <div className='bar-div'>
                    <div className='overlay'></div>
                    {
                        isAdmin && (
                            <Fragment>
                            <div className='bar-content-div'>
                            <h2 className='dashboard-heading'>Admin Dashboard</h2>
                            <hr className='bar-div-hr'></hr>
                            
                            <img src={UserImg} className='profile-img' />
                            
                            <h2 className='profile-heading'>{user.username}</h2>
                            <hr className='bar-div-hr'></hr>
                            <button className='bar-buttons' onClick={() => changePageState(1)}>
                                Analytics
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(2)}>
                                Admin Info
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(3)}>
                                Change Password
                            </button>
                            <button className='bar-buttons' onClick={() => logOut()}>
                                Log Out
                            </button>
                            </div>
                            </Fragment>

                        )
                    }
                </div>
                <div className='content-div'>
                    {
                        isAdmin && (
                            <h1>Admin show</h1>
                            
                        )
                    }

{
                    }
                </div>
            </div>
        </Fragment>
    )

}

export default Dashboard;