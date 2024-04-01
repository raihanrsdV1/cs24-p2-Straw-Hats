import React, { Fragment, useState, useEffect, useRef } from 'react';
import { BrowserRouter as Router, Route, Routes, Navigate, useNavigate, useHistory } from 'react-router-dom';
import { ToastContainer, toast } from 'react-toastify';
import 'react-toastify/dist/ReactToastify.css';


import './App.css';

import Dashboard from './components/Admin/dashboard';
import DEMO from './components/demo/demo';
import Login from './components/Authentication/LoginUi';
import Landfill from './components/Pages/landfill';
import STS from './components/Pages/sts';
import Home from './components/Pages/home';

function App() {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isAdmin, setIsAdmin] = useState(false);
  const [isStsManager, setIsStsManager] = useState(false);
  const [isLandfillManager, setIsLandfillManager] = useState(false);

  async function isAuth(){
    try {
      const response = await fetch(`http://localhost:8000/auth/is-verify`, {
        method: "GET",
        headers: {token: localStorage.token}
      });
      
      const parseRes = await response.json();
      // console.log('this is the verify parseres', parseRes);
      setIsAdmin(parseRes.isAdmin);
      setIsStsManager(parseRes.isStsManager);
      setIsLandfillManager(parseRes.isLandfillManager);
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
          <Route exact path="/login" element={!isAuthenticated?  <Login setAuth={setAuth} setIsAdmin={setIsAdmin} setIsStsManager={setIsStsManager} setIsLandfillManager={setIsLandfillManager} /> : <Navigate to ="/" />} />
          <Route exact path="/dashboard" element={isAuthenticated?  <Dashboard isAuthenticated={isAuthenticated} setAuth={setAuth} setIsAdmin={setIsAdmin} isAdmin={isAdmin} isStsManager={isStsManager} setIsStsManager={setIsStsManager} isLandfillManager={isLandfillManager} setIsLandfillManager={setIsLandfillManager} /> : <Navigate to ="/login" />} />
          <Route exact path="/" element={ <Home isAuthenticated={isAuthenticated} setAuth={setAuth} /> } />
          <Route exact path="/landfill/:landfill_id" element={isAuthenticated?  <Landfill isAuthenticated={isAuthenticated} setAuth={setAuth} setIsAdmin={setIsAdmin} isAdmin={isAdmin} /> : <Navigate to ="/login" />} />
          <Route exact path="/sts/:sts_id" element={isAuthenticated?  <STS isAuthenticated={isAuthenticated} setAuth={setAuth} setIsAdmin={setIsAdmin} isAdmin={isAdmin} /> : <Navigate to ="/login" />} />
          <Route exact path="/demo" element={<DEMO />} />
        </Routes>
      </Router>
    </Fragment>
  );
}

export default App;
