import React, { Fragment, useEffect, useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "react-toastify/dist/ReactToastify.css";

import "./admin.css";


const Vehicles = () => {
    const [vehicles, setVehicles] = useState([]);
    const [vehicleTypes, setVehicleTypes] = useState([]);
    const [stss, setStss] = useState([]);
    const [inputs, setInputs] = useState({
        registration_no: "",
        type_id: 1,
        model: "",
        sts_id: 1
    });


    useEffect(() => {
        const getVehicles = async () => {
            try {
                const response = await fetch("http://localhost:8000/vehicle", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });

                const parseRes = await response.json();
                setVehicles(parseRes);
            } catch (error) {
                console.error(error.message);
            }
        };

        const getVelicleTypes = async () => {
            try {
                const response = await fetch("http://localhost:8000/vehicleType", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });

                const parseRes = await response.json();
                setVehicleTypes(parseRes);
            } catch (error) {
                console.error(error.message);
            }
        }

        const getStss = async () => {
            try {
                const response = await fetch("http://localhost:8000/sts", {
                    method: "GET",
                    headers: { token: localStorage.token },
                });

                const parseRes = await response.json();
                setStss(parseRes);
            } catch (error) {
                console.error(error.message);
            }
        }

        getStss();
        getVelicleTypes();
        getVehicles();
    }, []);

    const onChange = (e) => {
        const { name, value } = e.target;
        setInputs({
            ...inputs,
            [name]: value
        });
    }

    const onSubmitForm = async () => {
        try {
            const body = inputs;
            const response = await fetch(`http://localhost:8000/vehicle`, {
                method: "POST",
                headers: { token: localStorage.token, "Content-Type": "application/json" },
                body: JSON.stringify(body),
            });

            const parseRes = await response.json();
            setVehicles(parseRes);
            toast.success("Vehicle Added Successfully");
        } catch (error) {
            console.error(error.message);
        }
    }

    return(
        <Fragment>
     
        <div class="row border m-4 rounded-5 p-3 ml-5 bg-white shadow box-area">
          <div class="col-md-12 right-box">
            <div class="row align-items-center">
              <div class="header-text mb-4">
                <h2>Enter A Vehicle</h2>
              </div>

        
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="registration_no"
                  placeholder="Enter Registration No"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.registration_no}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <input
                  type="text"
                  name="model"
                  placeholder="Vehicle Model"
                  className="form-control form-control-lg bg-color fs-6"
                  value={inputs.model}
                  onChange={(e) => onChange(e)}
                />
              </div>
              <div class="input-group mb-3">
                <select name="type_id" value={inputs.type_id} className="form-control form-control-lg bg-color fs-6" onChange={(e) => onChange(e)}>
                    {vehicleTypes.map((vehicleType) => (
                        <option key={vehicleType.id} value={vehicleType.id}>
                            {vehicleType.type}
                        </option>
                    ))}
                </select>
              </div>
              
              <div class="input-group mb-3">
                <select name="sts_id" value={inputs.sts_id} className="form-control form-control-lg bg-color fs-6" onChange={(e) => onChange(e)}>
                    {stss.map((sts) => (
                        <option key={sts.sts_id} value={sts.sts_id}>
                            {sts.address}
                        </option>
                    ))}
                </select>
              </div>
              

              <div class="input-group mb-3">
                <button
                  class="btn btn-lg btn-primary w-100 h-100 fs-6"
                  onClick={onSubmitForm}
                >
                  Add Vehicle
                </button>
              </div>
            </div>
          </div>

        
        </div>
      
      <table className="order-table">
        <thead>
          <tr>
            <th>Registration No.</th>
            <th>Type</th>
            <th>Model</th>
            <th>Assigned STS</th>
            <th>Edit</th>
            <th>Delete</th>
          </tr>
        </thead>
        <tbody>
          <div></div>
          {vehicles &&
            vehicles.map((vehicle) => (
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
                  {vehicle.vehicle_type}
                </td>

                <td>{vehicle.model} </td>
                <td>{vehicle.address}</td>
                <td><button className="btn btn-primary">Edit</button></td>
                <td><button className="btn btn-danger">Delete</button></td>

                
                
                
              </tr>
            ))}
        </tbody>
      </table>
      
    </Fragment>
    )
}

export default Vehicles;