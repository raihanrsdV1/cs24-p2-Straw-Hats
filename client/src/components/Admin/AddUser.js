import React, {Fragment, useEffect ,useState} from 'react';
import {Link} from 'react-router-dom';
import {toast} from 'react-toastify';

import "../css/login.css";
import logo from "../../image/login.png";

const AddUser = ({setAuth, setIsAdmin, setIsDeliveryMan}) => {
    const [inputs, setInputs] = useState({
        username: "",
        email: "",
        password: "",
        confirmed_password: "",
        contact_no: "",
        full_name: "",
        role_id: 1,
    });

    const [roles, setRoles] = useState([]);

    useEffect (() => {
        const getRoles = async () => {
            try {
                const response = await fetch("http://localhost:8000/users/roles", {
                    method: "GET",
                    headers: {token: localStorage.token}
                });

                const parseRes = await response.json();
                setRoles(parseRes);
            } catch (err) {
                console.error(err.message);
            }
        }

        getRoles();
    }, []);

    console.log("comes here");

    const {username, email, password, confirmed_password, contact_no, full_name, role_id} = inputs;

    const onChange = e => {
        setInputs({...inputs, [e.target.name]: e.target.value});
    }

    const onSubmitForm = async e => {
        e.preventDefault();
        try {
            if (password !== confirmed_password) {
                alert("Passwords do not match");
            }
            
            const body = inputs;
            console.log(JSON.stringify(body));
            const response = await fetch(`http://localhost:8000/users`, {
                method: "POST",
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

    const handleStaffStatus = (e) => {
        setInputs((prevInputs) => ({
            ...prevInputs,
            role_id: e.target.value
        }));

        console.log(inputs)
    }

    return (
        <Fragment>
            <div class="d-flex justify-content-center align-items-center min-vh-100" style={{marginTop: "0px", backgroundColor: "#ececece"}}>

            <div class="row border rounded-5 p-3 bg-white shadow box-area">


            <div class="col-md-6 right-box">
                <div class="row align-items-center">
                    <div class="header-text mb-4">
                            <h2>Welcome To TechZone</h2>
                            <p>The journey to becoming a TopG begins now</p>
                    </div>

                    <div class="input-group mb-3">
                        <input type="text" name="username" placeholder="Username" className="form-control form-control-lg bg-color fs-6" value={username} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                        <input type="email" name="email" placeholder="Email" className="form-control form-control-lg bg-color fs-6" value={email} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" name="password" placeholder="Password" className="form-control form-control-lg bg-color fs-6" value={password} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                        <input type="password" name="confirmed_password" placeholder="Confirmed Password" className="form-control form-control-lg bg-color fs-6" value={confirmed_password} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                        <input type="text" name="contact_no" placeholder="Contact No." className="form-control form-control-lg bg-color fs-6" value={contact_no} onChange={e => onChange(e)} />
                    </div>
                    <div class="input-group mb-3">
                    <input type="text" name="full_name" placeholder="Full Name"className="form-control form-control-lg bg-color fs-6" value={full_name} onChange={e => onChange(e)} />
                    </div>
                    <label for="Staff Status">Options:</label>
                    <select className="input-group mb-3 form-control form-control-lg bg-color fs-6" id="Staff Status" value={role_id} onChange={e => handleStaffStatus(e)}>
                        <option value={0}>Unassigned</option>
                        {
                            
                            roles.map(role => (
                                <option value={role.role_id}>{role.role_name}</option>
                            ))
                        }
                        
                    </select>

                    <div class="input-group mb-3">
                        <button class="btn btn-lg btn-primary w-100 h-100 fs-6" onClick={onSubmitForm}>Add User</button>
                    </div>
                    
                </div>
            </div> 

            
            <div class="col-md-6 rounded-4 d-flex justify-content-center align-items-center flex-column left-box" style={{background: '#103cbe'}}>
                <div class="featured-image mb-3">
                <img src={logo} class="img-fluid" style={{ width: '250px' }}/>
                </div>
                <p class="text-white fs-2" style={{fontFamily: 'Courier New, Courier, monospace', fontWeight: 600 }}>Indroduce Yourself</p>
                <small class="text-white text-wrap text-center" style={{ width: '17rem', fontFamily: 'Courier New, Courier, monospace'}}>Make your Daily Digital Consumption a Bliss</small>
            </div> 

            </div>
            </div> 
        </Fragment>
    );
}

export default AddUser;
