import React, { Fragment, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import ".././css/home.css";


import dncc from "../../image/dncc_logo.jpg";

import heroBangladesh from "../../image/hero-bangladesh.jpg";
import wasteManagement from "../../image/wasteManagement.jpg";


import PageFooter from "./PageFooter";
import Navbar from "./Navbar";



export default function Home({isAuthenticated, setAuth, hideNavBar, setHideNavBar,setChoicedCategory}) {
  
  return (
    <Fragment>
        <Navbar isAuthenticated={isAuthenticated} setAuth={setAuth}  />
        {/* Navigation Bar */}


        {/* image slider */}
        <div class="carousel slide" data-bs-ride="carousel" id="carouselExampleIndicators">
          <div class="carousel-indicators">
            <button aria-label="Slide 1" class="active" data-bs-slide-to="0" data-bs-target="#carouselExampleIndicators" type="button"></button> 
            <button aria-label="Slide 2" data-bs-slide-to="1" data-bs-target="#carouselExampleIndicators" type="button"></button> 
            <button aria-label="Slide 3" data-bs-slide-to="2" data-bs-target="#carouselExampleIndicators" type="button"></button>
          </div>
          <div class="carousel-inner">
            <div class="carousel-item active">
              <img alt="..." class="d-block w-100 dark-shadow" src={dncc}/>

            </div>
            <div class="carousel-item">
              <img alt="..." class="d-block w-100 dark-shadow" src={heroBangladesh} />
            </div>
            <div class="carousel-item">
              <img alt="..." class="d-block w-100 dark-shadow" src={wasteManagement} />
              
            </div>
          </div><button class="carousel-control-prev" data-bs-slide="prev" data-bs-target="#carouselExampleIndicators" type="button"><span aria-hidden="true" class="carousel-control-prev-icon"></span> <span class="visually-hidden">Previous</span></button> <button class="carousel-control-next" data-bs-slide="next" data-bs-target="#carouselExampleIndicators" type="button"><span aria-hidden="true" class="carousel-control-next-icon"></span> <span class="visually-hidden">Next</span></button>
        </div>




      
     
       


        {/* Footer --> subject to change */}

        <PageFooter />
    </Fragment>
  );
}