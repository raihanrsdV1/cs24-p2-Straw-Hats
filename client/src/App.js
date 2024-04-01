import React, { Fragment, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './App.css';

import Login from './components/Authentication/Login';
import Dashboard from './components/User/dashboard';
import DEMO from './components/demo/demo';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStsManager, setIsStsManager] = useState(false);
  const [isLandFillManager, setIsLandFillManager] = useState(false);

  async function isAuth(){
    try {
      const response = await fetch(`http://localhost:8000/auth/is-verify`, {
        method: "GET",
        headers: {token: localStorage.token}
      });
      
      const parseRes = await response.json();
      // console.log('this is the verify parseres', parseRes);
      setIsAdmin(true)
      parseRes.verified === true ? setIsAuthenticated(true) : setIsAuthenticated(false);
      
      // console.log(parseRes.status);
      
    } catch (err) {
      console.error(err.message);
      // console.log("Error in isAuth")
    }
  }

  useEffect(() => {
    
    isAuth();
  }, []);

  const setAuth = (boolean) => {
    setIsAuthenticated(boolean);
  }




  return (
    <Fragment>
      <ToastContainer />
      
      <Router>
        <Routes>
          <Route exact path="/login" element={!isAuthenticated?  <Login setAuth={setAuth} setIsAdmin={setIsAdmin} /> : <Navigate to ="/" />} />
          <Route exact path="/" element={isAuthenticated?  <Dashboard isAuthenticated={isAuthenticated} setAuth={setAuth} setIsAdmin={setIsAdmin} isAdmin={isAdmin} /> : <Navigate to ="/login" />} />
          <Route exact path="/demo" element={<DEMO />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
