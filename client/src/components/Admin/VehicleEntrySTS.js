import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";
import moment from 'moment';
import "./admin.css";

const VehicleEntrySTS = () => {
    const [vehicleOnSTS, setVehicleOnSTS] = useState([]);
    const [vehicleOffSTS, setVehicleOffSTS] = useState([]);
    const [sts, setSts] = useState([]);
    const [wasteWeight, setWasteWeight] = useState(0);
    
    useEffect(() => {
        const getInformation = async () => {
            try {
                const response = await fetch("http://localhost:8000/sts_management", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });

                const parseRes = await response.json();
                setVehicleOnSTS(parseRes.vehicles_on_sts);
                setVehicleOffSTS(parseRes.vehicles_off_sts);
                setSts(parseRes.sts);
                console.log(parseRes);
            } catch (error) {
                console.error(error.message);
            }
        }
        getInformation();
    }, []);

    const onChange = (e) => {
        setWasteWeight(e.target.value);
    }

    const onDepart = async(vehicle) => {
        try{
            const body = {
                registration_no: vehicle.registration_no,
                sts_id: vehicle.location_id,
                weight_of_waste: wasteWeight,
            }
            const response = await fetch(`http://localhost:8000/sts_management/depart`, {
                method: "POST",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
        
            setVehicleOnSTS(vehicleOnSTS.filter((vehicle) => vehicle.registration_no !== parseRes.registration_no));
            setVehicleOffSTS([...vehicleOffSTS, parseRes]);
        }
        catch(err){
            console.error(err.message);
        }
        
    }

    const onArrive = async(vehicle) => {
        try{
            const body = {
                registration_no: vehicle.registration_no,
                sts_id: vehicle.location_id
            }
            const response = await fetch(`http://localhost:8000/sts_management/arrive`, {
                method: "POST",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify(body)
            });
            const parseRes = await response.json();
            console.log(parseRes);
        
            setVehicleOffSTS(vehicleOffSTS.filter((vehicle) => vehicle.registration_no !== parseRes.registration_no));
            setVehicleOnSTS([...vehicleOnSTS, parseRes]);
        }
        catch(err){
            console.error(err.message);
        }
    }


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
                    <table className="order-table">
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Capacity</th>
            <th>Arrival Time</th>
            <th>Waste Amount</th>
            <th>Depart</th>
            
          </tr>
        </thead>
        <tbody>
          <div></div>
          {vehicleOnSTS &&
            vehicleOnSTS.map((vehicle) => (
              <tr key={vehicle.registration_no}>
                <td
                  style={{
                    backgroundColor: "#8f6ec5",
                  }}
                >

                  <button
                    style={{
                      cursor: "pointer",
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      height: "50px",
                    }}
                    
                  >
                    {vehicle.registration_no}
                  </button>
                </td>
                <td>
                  {vehicle.vehicle_capacity} ton
                </td>

                <td>{moment(vehicle.arrival_time).format('MMMM DD, YYYY hh:mm a')} </td>
                <td><input type="number" value={wasteWeight} className="form-control form-control-lg bg-color fs-6" onChange={(e) => onChange(e)} /></td>
                <td><button className="btn btn-primary" onClick={() => onDepart(vehicle)}>Depart</button></td>

                
              </tr>
            ))}
        </tbody>
                    </table>

                </div>
                <div style={{
                    width: '48%'
                }}>

<table className="order-table">
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Capacity</th>
            <th>Departure Time</th>
            <th>Waste Amount</th>
            <th>Arrive</th>
            
          </tr>
        </thead>
        <tbody>
          <div></div>
          {vehicleOffSTS &&
            vehicleOffSTS.map((vehicle) => (
              <tr key={vehicle.registration_no}>
                <td
                  style={{
                    backgroundColor: "#8f6ec5",
                  }}
                >

                  <button
                    style={{
                      cursor: "pointer",
                      color: "white",
                      backgroundColor: "transparent",
                      border: "none",
                      width: "100%",
                      height: "50px",
                    }}
                    
                  >
                    {vehicle.registration_no}
                  </button>
                </td>
                <td>
                  {vehicle.vehicle_capacity} ton
                </td>

                <td>{moment(vehicle.departure_time).format('MMMM DD, YYYY hh:mm a')} </td>
                <td>{vehicle.weight_of_waste} ton</td>
                <td><button className="btn btn-primary" onClick={() => onArrive(vehicle)}>Arrive</button></td>
                
              </tr>
            ))}
        </tbody>
                    </table>

                </div>
            </div>
        </Fragment>
    )
}

export default VehicleEntrySTS;