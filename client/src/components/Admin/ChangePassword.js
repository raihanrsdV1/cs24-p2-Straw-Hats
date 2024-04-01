import React, { Fragment,useEffect, useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';
import ReCAPTCHA from 'react-google-recaptcha';

import "./admin.css"

const ChangePassword = () => {
    const [token, setToken] = useState("");
    const [oldPassword, setOldPassword] = useState("");
    const [newPassword, setNewPassword] = useState("");
    const [verified, setVerified] = useState(false);
    const [recaptchaRef, setRecaptchaRef] = useState(null);

    const captchOnChange = (value) => {
        // console.log("Captcha value:", value);
        setToken(value);
        setVerified(true);
    }
    const handleChangePassword = async (e) => {
        e.preventDefault();
        if(oldPassword.length < 6 || newPassword.length < 6) {
            toast.error("Password must be at least 6 characters long");
            return;
        }
        if(oldPassword === newPassword) {
            toast.error("Old Password and New Password cannot be same");
            return;
        }
        try {
            const body = {oldPassword, newPassword, token};
            const response = await fetch(`http://localhost:8000/auth/change-password`, {
                method: "POST",
                headers: {
                    token: localStorage.token,
                    "Content-Type": "application/json"
                },
                body: JSON.stringify(body)
            });

            const parseRes = await response.json();
            console.log(parseRes);
            if (parseRes.success) {
                // console.log("Login Successfully")
                toast.success("Password Changed Successfully");
                if (recaptchaRef) {
                    recaptchaRef.reset(); // Reset ReCAPTCHA
                }
                setNewPassword("");
                setVerified(false);
                setOldPassword("");
            }
            else {
                // console.log(parseRes.message);
                toast.error(parseRes.message);
                setVerified(false);
                if (recaptchaRef) {
                    recaptchaRef.reset(); // Reset ReCAPTCHA
                }
            }
        } catch (err) {
            console.error(err.message);
        }
    }
    return (
        <Fragment>
            <div className='change-password-overlay'>
                <div className='change-password-container'>
                    <h3>Change Password</h3>
                    <form onSubmit={handleChangePassword}>
                    <input
                        type="password"
                        placeholder="Old Password"
                        value={oldPassword}
                        name="password"
                        onChange={e => setOldPassword(e.target.value)}
                        required
                        className="form-control form-control-lg bg-color fs-6 mb-4 mt-4 text-center" 
                    />
                    <input
                        type="password"
                        placeholder="New Password"
                        value={newPassword}
                        name="confirmed_password"
                        onChange={e => setNewPassword(e.target.value)}
                        required
                        className="form-control form-control-lg bg-color fs-6 mb-4 text-center" 
                    />
                        <ReCAPTCHA
                            sitekey="6Leh1KkpAAAAAO7l9gp7Dj66jLDyeydI_NJT7MoX"
                            onChange={captchOnChange}
                            ref={(ref) => setRecaptchaRef(ref)}
                        />
                        <div class="input-group mb-3 mt-4">
                            <button class="btn btn-lg btn-primary w-100 h-100 fs-6" type="submit" disabled={!verified}>Change Password</button>
                        </div>
                    </form>
                </div>
            </div>
        </Fragment>
    )
}

export default ChangePassword;