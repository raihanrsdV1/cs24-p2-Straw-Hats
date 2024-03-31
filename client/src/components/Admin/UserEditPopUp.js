import React, { Fragment,useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import moment from 'moment';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import UserImg from '../../image/user.png';


const UserEditPopup = ({user_id, close}) =>{

    const [user_data, setUser_data] = useState({});
    const [roles, setRoles] = useState([]);

    const [inputs, setInputs] = useState({
        username: '',
        email: '',
        contact_no: '',
        full_name: '',

    });
    

    useEffect(()=>{
        const getUser = async() =>{
            try {
                const response = await fetch(`http://localhost:8000/users/${user_id}`, {
                    method: 'GET',
                    headers: { token: localStorage.token }
                });

                const parseRes = await response.json();
                setUser_data(parseRes);
                setInputs({
                    username: parseRes.username,
                    email: parseRes.email,
                    contact_no: parseRes.contact_no,
                    full_name: parseRes.full_name,
                });
            } catch (err) {
                console.error(err.message);
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

        getUser();
    }, [])


    const onChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            const body = inputs;
            console.log(JSON.stringify(body));
            const response = await fetch(`http://localhost:8000/users/${user_id}`, {
                method: "PUT",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            // console.log(parseRes);

            toast.success(parseRes.message);
        } catch (err) {
            console.error(err.message);
        }
    }



    return (
        <Fragment>
            
            <div className="cancel-form-overlay" >
                <div className="cancel-form-container">

                    <h1 className='cancel-box-heading' style={{ marginBottom: '0px'}}>Update User</h1>
                    <hr style={{
                        marginBottom: '0px',
                    }}></hr>
                    <div class="row align-items-center">
                    

                    <div class="input-group mb-3">
                        <input type="text" name="username" placeholder="Username" className="form-control form-control-lg bg-color fs-6" value={inputs.username} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                        <input type="email" name="email" placeholder="Email" className="form-control form-control-lg bg-color fs-6" value={inputs.email} onChange={e => onChange(e)} />
                    </div>
                    
                    <div class="input-group mb-3">
                        <input type="text" name="contact_no" placeholder="Contact No." className="form-control form-control-lg bg-color fs-6" value={inputs.contact_no} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                    <input type="text" name="full_name" placeholder="Full Name"className="form-control form-control-lg bg-color fs-6" value={inputs.full_name} onChange={e => onChange(e)} />
                    </div>
                    

                    <div class="btn_bar">
                        <button class="cancel-box-button" onClick={onSubmitForm}>Update User</button>
                        <button type="button" className='cancel-box-button' onClick={() => close()} >Close</button>
                    </div>
                    
                </div>

                
                </div>
            </div>
        
        </Fragment>
    )
}

export default UserEditPopup;