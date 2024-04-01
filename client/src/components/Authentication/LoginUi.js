import React, { Fragment, useState, useRef } from 'react';
import { Link } from 'react-router-dom';
import { toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';

import "../css/login.css";

import Login from './Login';
import ResetPassword from './ResetPassword';


const LoginUi = ({setAuth, setIsAdmin, setIsStsManager, setIsLandfillManager}) => {
    const [pageState, setPageState] = useState("login");
    const [inputs, setInputs] = useState({
        email: "",
        password: ""
    });
    return (
        <Fragment>
            {
                pageState === "login" && <Login setAuth={setAuth} setIsAdmin={setIsAdmin} setPageState={setPageState} setIsStsManager={setIsStsManager} setIsLandfillManager={setIsLandfillManager} inputs={inputs} setInputs={setInputs} /> ||
                pageState === "resetPassword" && <ResetPassword setPageState={setPageState} inputs={inputs} />

            }
        </Fragment>
    )
}

export default LoginUi;