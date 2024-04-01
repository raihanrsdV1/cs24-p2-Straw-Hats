
import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "./admin.css"
import UserImg from "../../image/user.png";

import Users from './users';
import Sts from './sts';
import Landfill from './landfill';
import Analytics from './Analytics';
import AddUser from './AddUser';
import ChangePassword from './ChangePassword';
import Roles from './Roles';
import GoogleMap from './GoogleMap';
import VehicleType from './VehicleType';
import Vehicles from './Vehicles';



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
                                Users
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(3)}>
                                Add User
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(4)}>
                                Change Password
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(5)}>
                                Roles
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(6)}>
                                Map
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(7)}>
                                Landfill
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(8)}>
                                STS
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(9)}>
                                Vehicle Type
                            </button>
                            <button className='bar-buttons' onClick={() => changePageState(10)}>
                                Vehicle 
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
                            pageState === 1 && <Analytics /> ||
                            pageState === 2 && <Users /> ||
                            pageState === 3 && <AddUser setAuth={setAuth} setIsAdmin={setIsAdmin}  /> ||
                            pageState === 4 && <ChangePassword /> ||
                            pageState === 5 && <Roles /> ||
                            pageState === 6 && <GoogleMap /> ||
                            pageState === 7 && <Landfill /> ||
                            pageState === 8 && <Sts /> ||
                            pageState === 9 && <VehicleType /> ||
                            pageState === 10 && <Vehicles />

                            
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