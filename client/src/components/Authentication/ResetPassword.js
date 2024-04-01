import React, { Fragment, useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import { useParams } from "react-router-dom";

import { CountdownCircleTimer } from 'react-countdown-circle-timer';





const Tracker = ({setPageState, inputs}) => {
    const [email, setEmail] = useState('');
    const [otp, setOtp] = useState('');
    const [showOtpInput, setShowOtpInput] = useState(false);
    const [generatedOtp, setGeneratedOtp] = useState(''); // [1
    const [otpSendCount, setOtpSendCount] = useState(5);
    const [timerKey, setTimerKey] = useState(5); // Key to force re-render and restart timer
    const [password, setPassword] = useState('');
    const [confirmedPassword, setConfirmedPassword] = useState('');
    const timerRef = useRef(null); // Ref for accessing CountdownCircleTimer methods

    const [resetMode, setResetMode] = useState(false);

    

    const handleOtpChange = (e) => {
        setOtp(e.target.value);
    }

    

    

    const handleVerifyOtp = (e) => {
        e.preventDefault();
        // Check if the OTP entered by the user is correct
        if (otp == generatedOtp) {
            // If the OTP is correct, allow the user to reset their password
            // For example:
            // setPageState("resetPassword");
            toast.success("OTP verified successfully. You can now reset your password.");
            setResetMode(true);
        } else {
            toast.error("Invalid OTP. Please try again.");
        }
    }
    const enterEmailHandler = async() => {
        if(email === ""){
            toast.error("Please enter your email");
            return;
        }
        const otp = await Math.floor(100000 + Math.random() * 900000)
        const response = await fetch(`http://localhost:8000/auth/reset-password/initiate`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                otp: otp
            }),
        
        });
        const data = await response.json();
        if(data.success){
            setGeneratedOtp(otp);
        setShowOtpInput(true);
        setOtpSendCount(otpSendCount - 1);
        restartTimer();
        toast.success(`OTP has been sent to your email. Please check the spam box. If you did not receive the OTP, click on Resend OTP. You have ${otpSendCount} attempts left.`)
        }
        else{
            toast.error(data.message);
        }
        
    }

    const restartTimer = () => {
        setTimerKey((prevKey) => prevKey + 1); // Change the key to force re-render and restart timer
        timerRef.current?.start(); // Start the timer
      };

    const handleResetPassword = async(e) => {
        e.preventDefault();
        if(password === "" || confirmedPassword === ""){
            toast.error("Please enter your password");
            return;
        }
        if(password.length < 6){
            toast.error("Password must be a minimum of 6 letters");
            return;
        }
        if(password !== confirmedPassword){
            toast.error("Passwords do not match");
            return;
        }
        const response =  await fetch(`http://localhost:8000/auth/reset-password/confirm`, {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({
                email: email,
                password: password
            }),
        
        });

        const data = await response.json();
        if(data.success){
            toast.success("Password has been reset successfully");
            setShowOtpInput(false);
            setResetMode(false);
        }   
        
    }

   
    return(
        <Fragment>
            
            <div className="tracker-page-overlay">
                <div className="tracker-page-container">
                    

                    <div className="progress-bar-div">
                        {
                            !showOtpInput? (
                                <div>
                                    <h2 className="mb-3">Enter Your Email</h2>
                                    <input type="email" placeholder="Email" value={email} style={{width: '500px'}} className="form-control form-control-lg bg-color fs-6 mb-4 text-center" onChange={e => setEmail(e.target.value)} />
                                    <div className='btn_bar' style={{
                                                    width: '500px',
                                                    justifyContent: 'space-evenly',
                                                    alignContent: 'center'
                                                }}>
                                    <button class="btn btn-lg btn-primary fs-6 " onClick={() => enterEmailHandler()}>Submit</button>
                                    <button class="btn btn-lg btn-primary fs-6 " type="button" onClick={() => setPageState("login")}>Close</button>
                                    </div>
                                    
                                </div>
                            ):(
                                
                                    !resetMode? (
                                        <div className='reset-inner-div'>
                                    <div 
                                    style={{
                                        
                                        width: '100%',
                                        marginBottom: '-50px',
                                        marginTop: '0px',
                                    }}
                                    >
                                    <CountdownCircleTimer
                                        key={timerKey} // Key to force re-render and restart timer
                                        ref={timerRef} // Ref to access CountdownCircleTimer methods
                                        isPlaying
                                        duration={120} // 2 minutes in seconds
                                        colors={['#004777', '#F7B801', '#A30000', '#A30000']} 
                                        style={{
                                            marginTop: '50px'
                                        }}
            
                                        size={80}
                                        strokeWidth={6}
                                        onComplete={() => {
                                            setGeneratedOtp("");
                                        }}
                                        >
                                        {({ remainingTime }) => remainingTime}
                                        </CountdownCircleTimer>
                                     </div>
                                    <h2 className="mb-3">Email Verification</h2>
                                    <p>We have sent an OTP to <b>{email}</b></p>
                                    <form onSubmit={handleVerifyOtp}>
                                    <input
                                        type="text"
                                        placeholder="Enter OTP"
                                        value={otp}
                                        onChange={handleOtpChange}
                                        required
                                        className="form-control form-control-lg bg-color fs-6 mb-4 text-center" 
                                    />
                                    <div className='btn_bar' style={{
                                        width: '500px',
                                        justifyContent: 'space-evenly',
                                        alignContent: 'center'
                                    }}>
                                    <button class="btn btn-lg btn-primary fs-6" type="submit">Submit</button>
                                    <button class="btn btn-lg btn-primary fs-6 " onClick={() => setShowOtpInput(false)}>Close</button>
                                    </div>
                                </form>
                                <p style={{
                                    marginTop : "20px",
                                    fontSize: "13px",
                                    color: 'gray'
                                }}>Didn't Receive OTP? <a style={{
                                    color: 'blue',
                                    cursor: 'pointer',
                                    textDecoration: 'underline'
                                }}
                                onClick={() => enterEmailHandler()}
                                    >Resend OTP</a></p>
          
                                </div>

                                    ):(

                                        <div className='reset-inner-div'>
                                            <h2 className="mb-3">Reset Password</h2>
                                            <form onSubmit={handleResetPassword}>
                                                <input
                                                    type="password"
                                                    placeholder="New Password"
                                                    value={password}
                                                    name="password"
                                                    onChange={e => setPassword(e.target.value)}
                                                    required
                                                    className="form-control form-control-lg bg-color fs-6 mb-4 text-center" 
                                                />
                                                <input
                                                    type="password"
                                                    placeholder="Confirm Password"
                                                    value={confirmedPassword}
                                                    name="confirmed_password"
                                                    onChange={e => setConfirmedPassword(e.target.value)}
                                                    required
                                                    className="form-control form-control-lg bg-color fs-6 mb-4 text-center" 
                                                />
                                                <div className='btn_bar' style={{
                                                    width: '500px',
                                                    justifyContent: 'space-evenly',
                                                    alignContent: 'center'
                                                }}>
                                                <button class="btn btn-lg btn-primary fs-6" type="submit">Submit</button>
                                                <button class="btn btn-lg btn-primary fs-6 " type="button" onClick={() => setResetMode(false)}>Close</button>
                                                </div>
                                            </form>
                                        </div>
                                    )
                                
                                
                            )
                        }
                        
                    </div>
                </div>
            </div>
        </Fragment>
    );
}

export default Tracker;