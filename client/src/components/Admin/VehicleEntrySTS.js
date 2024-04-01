import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./admin.css";

const VehicleEntrySTS = () => {
    
    return(
        <Fragment>
            <div style={{
                display: 'flex',
                justifyContent: 'space-evenly',
                alignContent: 'center',
                width: "100%",
                height: '100vh'
            }}
            >
                <div style={{
                    width: '48%'
                }}>

                </div>
                <div style={{
                    width: '48%'
                }}>

                </div>
            </div>
        </Fragment>
    )
}

export default VehicleEntrySTS;